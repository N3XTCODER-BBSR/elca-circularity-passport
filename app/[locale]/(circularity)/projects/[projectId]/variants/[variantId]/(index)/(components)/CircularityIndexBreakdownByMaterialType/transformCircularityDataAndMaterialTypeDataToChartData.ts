import { MaterialNode, ProcessCategory } from "./CircularityIndexBreakdownByMaterialType"
import { ChartDataInternalNode, ChartDataNode } from "../CircularityIndexBreakdownByDin/ChartAndBreadCrumbComponent"

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
  // Build the hierarchical tree:
  const categoryTree = buildCategoryTree(processCategories, products)

  // Convert the built tree into ChartDataNode:
  const rootNode: ChartDataInternalNode = {
    isLeaf: false,
    label: rootLabel,
    metricValue: 0,
    dimensionalValue: 0,
    children: categoryTree.map(toChartDataNode).filter((n): n is ChartDataInternalNode => n !== null),
  }

  // If skipRootNode is true and there's exactly one top-level node and it's internal, flatten it
  if (skipRootNode && rootNode.children.length === 1 && !rootNode.children[0]!.isLeaf) {
    const singleChild = rootNode.children[0] as ChartDataInternalNode
    rootNode.children = singleChild.children
    rootNode.label = singleChild.label
  }

  // Compute weighted metrics bottom-up
  computeWeightedMetrics(rootNode)

  return rootNode
}

/**
 * Convert a CategoryTreeNode into a ChartDataNode (internal or null).
 * Returns null if a node has no children/materials.
 */
function toChartDataNode(node: CategoryTreeNode): ChartDataInternalNode | null {
  const childNodes = node.subcategories.map(toChartDataNode).filter((n): n is ChartDataInternalNode => n !== null) || []

  const leafNodes = node.materials.map((m) => ({
    isLeaf: true as const,
    metricValue: m.circularityIndex,
    dimensionalValue: m.weight,
    label: m.name,
    resourceId: m.component_uuid,
  }))

  const children = [...childNodes, ...leafNodes]
  if (children.length === 0) return null

  return {
    isLeaf: false,
    label: node.name,
    children,
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/**
 * Compute weighted metrics (metricValue and dimensionalValue) for internal nodes by
 * aggregating children nodes.
 */
function computeWeightedMetrics(node: ChartDataNode): void {
  if (node.isLeaf) return
  for (const child of node.children) {
    computeWeightedMetrics(child)
  }

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

  // We will create a map of root categories and subcategories.
  // Root categories: categories with no '.' in ref_num
  // Subcategories: categories with '.' in ref_num

  const categoriesByRefNum: { [refNum: string]: CategoryNode } = {}
  const categoriesByNodeId: { [nodeId: number]: CategoryNode } = {}

  categories.forEach((category) => {
    if (category.ref_num) {
      categoriesByRefNum[category.ref_num] = category
    }
    categoriesByNodeId[category.node_id] = category
  })

  // Initialize root categories
  // We'll store them in a structure similar to buildTree return:
  // For convenience, we create intermediate structures to hold subcategories and materials.
  type RootCategoryTemp = {
    node_id: number
    name: string
    ref_num: string | null
    subcategories: SubCategoryTemp[]
    materials: MaterialNode[]
  }

  type SubCategoryTemp = {
    node_id: number
    name: string
    ref_num: string | null
    materials: MaterialNode[]
    subcategories: SubCategoryTemp[] // for deeper levels if any
  }

  // In some data sets, we may have multiple levels of nesting. We'll handle them generically.
  // We'll form a hierarchical structure by splitting ref_num by '.' and nesting accordingly.

  // Step 1: Identify the top-level (root) categories
  const rootCategories: { [refNum: string]: RootCategoryTemp } = {}
  categories.forEach((category) => {
    if (category.ref_num && !category.ref_num.includes(".")) {
      rootCategories[category.ref_num] = {
        node_id: category.node_id,
        name: category.name,
        ref_num: category.ref_num,
        subcategories: [],
        materials: [],
      }
    }
  })

  // For convenience, we’ll build a tree structure indexed by ref_num
  // Each node can have subcategories and materials
  // Let's store all nodes in a map keyed by ref_num
  const allNodesByRef: {
    [refNum: string]: {
      node_id: number
      name: string
      ref_num: string | null
      subcategories: SubCategoryTemp[]
      materials: MaterialNode[]
    }
  } = {}

  // Initialize all nodes
  categories.forEach((cat) => {
    allNodesByRef[cat.ref_num ?? ""] = {
      node_id: cat.node_id,
      name: cat.name,
      ref_num: cat.ref_num,
      subcategories: [],
      materials: [],
    }
  })

  // Now we form the hierarchy by linking subcategories to their parents:
  // Any category with '.' is a subcategory of a shorter ref_num (its parent)
  // We'll find parent by truncating last segment of ref_num.
  for (const cat of categories) {
    if (cat.ref_num && cat.ref_num.includes(".")) {
      const parentRefNum = getParentRefNum(cat.ref_num)
      if (parentRefNum && allNodesByRef[parentRefNum]) {
        allNodesByRef[parentRefNum].subcategories.push(allNodesByRef[cat.ref_num] as SubCategoryTemp)
      }
    }
  }

  // Materials are assigned to the category with the exact node_id:
  materials.forEach((material) => {
    const cat = categoriesByNodeId[material.process_category_node_id]
    if (cat && cat.ref_num && allNodesByRef[cat.ref_num]) {
      allNodesByRef[cat.ref_num]!.materials.push(material)
    }
  })

  // Filter out empty subcategories:
  function pruneEmptySubcategories(node: { subcategories: SubCategoryTemp[]; materials: MaterialNode[] }) {
    node.subcategories = node.subcategories.filter((sub) => {
      pruneEmptySubcategories(sub)
      return sub.subcategories.length > 0 || sub.materials.length > 0
    })
  }

  for (const refNum in allNodesByRef) {
    pruneEmptySubcategories(allNodesByRef[refNum]!)
  }

  // Now we only return the top-level categories (which had no '.' in their ref_num)
  const finalRootNodes = Object.values(rootCategories)
    .map((root) => {
      // Root node is already part of allNodesByRef:
      const rootNode = allNodesByRef[root.ref_num!]
      return {
        node_id: rootNode!.node_id,
        name: rootNode!.name,
        subcategories: rootNode!.subcategories.map(convertToCategoryTreeNode),
        materials: rootNode!.materials,
      }
    })
    .filter((r) => r.subcategories.length > 0 || r.materials.length > 0)

  return finalRootNodes
}

// Convert a generic node to CategoryTreeNode structure recursively.
function convertToCategoryTreeNode(node: {
  node_id: number
  name: string
  subcategories: any[]
  materials: MaterialNode[]
}): CategoryTreeNode {
  return {
    node_id: node.node_id,
    name: node.name,
    materials: node.materials,
    subcategories: node.subcategories.map(convertToCategoryTreeNode),
  }
}

// Helper function to get the parent ref_num
function getParentRefNum(refNum: string): string | null {
  const lastDotIndex = refNum.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return null // No parent ref_num
  } else {
    return refNum.substring(0, lastDotIndex)
  }
}
