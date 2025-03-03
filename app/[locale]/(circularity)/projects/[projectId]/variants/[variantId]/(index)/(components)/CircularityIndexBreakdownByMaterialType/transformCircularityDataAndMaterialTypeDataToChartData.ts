import { MaterialNode, ProcessCategory } from "./CircularityIndexBreakdownByMaterialType"
import {
  ChartDataInternalNode,
  ChartDataLeaf,
  ChartDataNode,
} from "../CircularityIndexBreakdownByDin/ChartAndBreadCrumbComponent"

// Internal structure that mimics what buildTree returned:
type CategoryTreeNode = {
  node_id: number
  name: string
  subcategories: CategoryTreeNode[]
  materials: MaterialNode[]
}

/**
 * Main function that:
 * 1) Builds a hierarchical category-material structure from processCategories and products.
 * 2) Transforms that structure into ChartDataNode.
 *
 * @param processCategories Array of categories with hierarchical ref_num
 * @param products          Array of products/materials associated to categories
 * @param rootLabel         Label for the root node of the chart
 * @param skipRootNode      If true and there's a single top-level node, skip the artificial root
 * @returns ChartDataNode hierarchical structure suitable for charting
 */
export function transformCircularityDataAndMaterialTypesToChartData(
  processCategories: ProcessCategory[],
  products: MaterialNode[],
  rootLabel: string,
  skipRootNode: boolean
): ChartDataNode {
  // 1) Build the hierarchical tree:
  const categoryTree = buildCategoryTree(processCategories, products)

  // 2) Convert the built tree into ChartDataNode:
  const rootNode: ChartDataInternalNode = {
    isLeaf: false,
    label: rootLabel,
    metricValue: 0,
    dimensionalValue: 0,
    children: categoryTree.map(toChartDataNode).filter((n): n is ChartDataInternalNode => n !== null),
  }

  // If skipRootNode is true and there's exactly one top-level node and it's internal, flatten it:
  if (skipRootNode && rootNode.children.length === 1 && !rootNode.children[0]?.isLeaf) {
    const singleChild = rootNode.children[0] as ChartDataInternalNode
    rootNode.children = singleChild.children
    rootNode.label = singleChild.label
  }

  // Compute weighted metrics bottom-up:
  computeWeightedMetrics(rootNode)

  return rootNode
}

/**
 * Convert a CategoryTreeNode into a ChartDataNode (internal or null).
 */
function toChartDataNode(node: CategoryTreeNode): ChartDataInternalNode | null {
  // Recursively map subcategories into ChartDataNodes:
  const childCategoryNodes = node.subcategories
    .map(toChartDataNode)
    .filter((n): n is ChartDataInternalNode => n !== null)

  // Build intermediate "product-group" nodes from node.materials:
  const productGroupChildren = buildProductGroupChildren(node.materials)

  // Combine subcategory children with these product-group children:
  const allChildren = [...childCategoryNodes, ...productGroupChildren]

  // If there are no children (no subcats or materials), return null to prune:
  if (allChildren.length === 0) {
    return null
  }

  // Build an internal node for this category:
  return {
    isLeaf: false,
    label: node.name,
    metricValue: 0,
    dimensionalValue: 0,
    children: allChildren,
  }
}

/**
 * Create internal nodes grouping materials by some key (e.g., 'name' or 'product_id').
 * Each group becomes an internal node, which then has leaves aggregated by component_uuid.
 */
function buildProductGroupChildren(materials: MaterialNode[]): ChartDataInternalNode[] {
  const groupedByName = groupBy(materials, (m) => m.name)

  const productGroups: ChartDataInternalNode[] = []

  for (const [materialName, itemsInThisGroup] of Array.from(groupedByName.entries())) {
    // For each group, build leaves aggregated by component_uuid:
    const leafChildren = buildLeavesAggregatedByUuid(itemsInThisGroup)

    if (leafChildren.length === 0) {
      continue
    }

    // Create one internal node for this group of materials:
    productGroups.push({
      isLeaf: false,
      label: materialName,
      metricValue: 0,
      dimensionalValue: 0,
      children: leafChildren,
    })
  }
  return productGroups
}

/**
 * Build leaf nodes for each unique component_uuid in a group of materials.
 * If the same component_uuid appears multiple times, we sum the weights
 * and compute a weighted-average of the circularityIndex.
 */
function buildLeavesAggregatedByUuid(materials: MaterialNode[]): ChartDataLeaf[] {
  const groupedByUuid = groupBy(materials, (m) => m.component_uuid)

  const leaves: ChartDataLeaf[] = []

  for (const [uuid, items] of Array.from(groupedByUuid.entries())) {
    // Sum total mass (dimensionalValue), weighted-sum for metricValue:
    const { totalWeight, weightedMetric } = items.reduce(
      (acc: { totalWeight: number; weightedMetric: number }, mat: MaterialNode) => {
        acc.totalWeight += mat.weight
        acc.weightedMetric += mat.circularityIndex * mat.weight
        return acc
      },
      { totalWeight: 0, weightedMetric: 0 }
    )

    const finalMetric = totalWeight > 0 ? weightedMetric / totalWeight : 0

    // Use the first matched item’s component_name for the label:
    leaves.push({
      isLeaf: true,
      metricValue: finalMetric,
      dimensionalValue: totalWeight,
      label: items[0]?.component_name ?? `Component ${uuid}`,
      resourceId: uuid,
    })
  }
  return leaves
}

// TODO: consider to replace this with lodash groupBy
/**
 * Simple groupBy helper. Returns a Map of key -> array of items that share that key.
 */
function groupBy<T, K>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(item)
  }
  return map
}

/**
 * Compute weighted metrics (metricValue and dimensionalValue) for internal nodes by
 * aggregating children nodes. This is bottom-up, so it first recurses, then aggregates.
 */
function computeWeightedMetrics(node: ChartDataNode): void {
  if (node.isLeaf) {
    return
  }

  // Recurse into children first:
  for (const child of node.children) {
    computeWeightedMetrics(child)
  }

  // Now aggregate:
  let totalWeight = 0
  let weightedSum = 0

  for (const child of node.children) {
    totalWeight += child.dimensionalValue
    weightedSum += child.metricValue * child.dimensionalValue
  }

  node.dimensionalValue = totalWeight
  node.metricValue = totalWeight > 0 ? weightedSum / totalWeight : 0
}

/**
 * Build a category tree structure from the given categories and materials.
 * This replicates the logic from the old buildTree function internally.
 */
function buildCategoryTree(categories: ProcessCategory[], materials: MaterialNode[]): CategoryTreeNode[] {
  type CategoryNode = {
    node_id: number
    name: string
    ref_num: string | null
  }

  // We'll create a map of categories by ref_num and by node_id:
  const categoriesByRefNum: { [refNum: string]: CategoryNode } = {}
  const categoriesByNodeId: { [nodeId: number]: CategoryNode } = {}

  categories.forEach((category) => {
    if (category.ref_num) {
      categoriesByRefNum[category.ref_num] = category
    }
    categoriesByNodeId[category.node_id] = category
  })

  // Prepare an object to hold all categories in a tree structure, keyed by ref_num:
  type CategoryTreeTemp = {
    node_id: number
    name: string
    ref_num: string | null
    subcategories: CategoryTreeTemp[]
    materials: MaterialNode[]
  }

  const allNodesByRef: { [refNum: string]: CategoryTreeTemp } = {}

  // Initialize all categories as CategoryTreeTemp objects:
  categories.forEach((cat) => {
    allNodesByRef[cat.ref_num ?? ""] = {
      node_id: cat.node_id,
      name: cat.name,
      ref_num: cat.ref_num,
      subcategories: [],
      materials: [],
    }
  })

  // Link subcategories to their parents:
  for (const cat of categories) {
    if (cat.ref_num && cat.ref_num.includes(".")) {
      const parentRefNum = getParentRefNum(cat.ref_num)
      if (parentRefNum && allNodesByRef[parentRefNum] && allNodesByRef[cat.ref_num]) {
        allNodesByRef[parentRefNum].subcategories.push(allNodesByRef[cat.ref_num]!)
      }
    }
  }

  // Assign materials to the category with matching node_id:
  materials.forEach((material) => {
    const cat = categoriesByNodeId[material.process_category_node_id]
    if (cat && cat.ref_num && allNodesByRef[cat.ref_num]) {
      allNodesByRef[cat.ref_num]!.materials.push(material)
    }
  })

  // Prune empty subcategories (recursively):
  function pruneEmptySubcategories(node: CategoryTreeTemp): void {
    node.subcategories = node.subcategories.filter((sub) => {
      pruneEmptySubcategories(sub)
      return sub.subcategories.length > 0 || sub.materials.length > 0
    })
  }
  Object.values(allNodesByRef).forEach((tempNode) => {
    pruneEmptySubcategories(tempNode)
  })

  // Identify root-level categories (no '.' in their ref_num),
  // skipping any that end up empty after pruning:
  const rootCategoryNodes = categories.filter((cat) => cat.ref_num && !cat.ref_num.includes("."))

  // Return the final CategoryTreeNode array:
  return rootCategoryNodes
    .map((rootCat) => {
      const rootNode = allNodesByRef[rootCat.ref_num!]!
      return {
        node_id: rootNode.node_id,
        name: rootNode.name,
        subcategories: rootNode.subcategories.map(convertToCategoryTreeNode),
        materials: rootNode.materials,
      }
    })
    .filter((r) => r.subcategories.length > 0 || r.materials.length > 0)
}

// Convert a generic node to CategoryTreeNode structure recursively.
function convertToCategoryTreeNode(node: CategoryTreeNode): CategoryTreeNode {
  return {
    node_id: node.node_id,
    name: node.name,
    materials: node.materials,
    subcategories: node.subcategories.map(convertToCategoryTreeNode),
  }
}

// Helper function to get the parent ref_num by removing the last '.' segment.
function getParentRefNum(refNum: string): string | null {
  const lastDotIndex = refNum.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return null
  }
  return refNum.substring(0, lastDotIndex)
}
