import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import {
  din276Hierarchy,
  costGroupCategoryNumbersToInclude,
  ComponentGroup,
  ComponentCategory,
  ComponentType,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ChartDataInternalNode, ChartDataLeaf, ChartDataNode } from "./CircularityBreakdownChart"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"

type GetWeightByProductIdFn = (componentId: number) => Promise<number>

/**
 * Transforms the given `circularityData` into the ChartDataNode tree structure.
 *
 * Steps:
 * 1. Filter out all components not belonging to the selected DIN categories.
 * 2. Create leaf nodes for each layer (CalculateCircularityDataForLayerReturnType).
 * 3. Build internal nodes from `din276Hierarchy` that contain these leaf nodes.
 * 4. Compute weighted average `metricValue` for internal nodes.
 *
 * @param circularityData array of ElcaElementWithComponents
 * @param getWeightByProductId function to get the weight for a given product_id
 * @param rootLabel label for the root node (if you want a single artificial root)
 * @returns ChartDataNode representing the entire hierarchy
 */
export async function transformCircularityDataAndDinHierachyToChartTree(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  // TODO: move this out and do the weight enrichment upstream in datalayer / domin layer
  getWeightByProductId: GetWeightByProductIdFn,
  rootLabel: string
): Promise<ChartDataNode> {
  // 1. Filter data
  const filteredData = filterDataByCostGroup(circularityData)

  // 2. Map DIN codes to leaf nodes
  const dinCodeToLeaves = await buildDinCodeToLeafNodesMap(filteredData, getWeightByProductId)

  // 3. Build the hierarchy from `din276Hierarchy`
  //    We might have multiple top-level groups. Let's create a single root that contains them.
  const children = din276Hierarchy
    .map((group) => buildNodeFromGroup(group, dinCodeToLeaves))
    .filter((node): node is ChartDataInternalNode => node !== null)

  // If there's only one top-level node, you could return it directly.
  // Otherwise, return a root node combining all top-level groups.
  const rootNode: ChartDataInternalNode = {
    isLeaf: false,
    label: rootLabel,
    children: children,
    metricValue: 0, // Will compute after building children
    dimensionalValue: 0,
  }

  // 4. Compute weighted averages bottom-up
  computeWeightedMetrics(rootNode)

  return rootNode
}

/** Filter out components not falling into selected DIN categories */
function filterDataByCostGroup(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
): ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] {
  return circularityData.filter((elem) => {
    const level2Din = Math.floor(elem.din_code / 10) * 10
    return costGroupCategoryNumbersToInclude.includes(level2Din)
  })
}

/** Build a map from DIN code to an array of leaf nodes (ChartDataLeaf). */
async function buildDinCodeToLeafNodesMap(
  data: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  getWeightByProductId: GetWeightByProductIdFn
): Promise<Map<number, ChartDataLeaf[]>> {
  const map = new Map<number, ChartDataLeaf[]>()

  for (const element of data) {
    const { din_code } = element
    for (const layer of element.layers) {
      const weight = layer.weight ?? (await getWeightByProductId(layer.component_id))
      const metricValue = layer.circularityIndex ?? 0
      const dimensionalValue = weight

      const leaf: ChartDataLeaf = {
        isLeaf: true,
        metricValue,
        dimensionalValue,
        label: layer.element_name,
        resourceId: layer.element_uuid,
      }

      if (!map.has(din_code)) {
        map.set(din_code, [])
      }
      map.get(din_code)!.push(leaf)
    }
  }

  return map
}

/**
 * Recursively build a node from a ComponentGroup.
 * If the group or its descendants don't have any leaves, return null.
 */
function buildNodeFromGroup(
  group: ComponentGroup,
  dinCodeToLeaves: Map<number, ChartDataLeaf[]>
): ChartDataInternalNode | null {
  const childrenNodes = group.children
    .map((category) => buildNodeFromCategory(category, dinCodeToLeaves))
    .filter((node): node is ChartDataInternalNode => node !== null)

  if (childrenNodes.length === 0) {
    return null
  }

  return {
    isLeaf: false,
    label: `${group.number}: ${group.name}`,
    children: childrenNodes,
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/**
 * Recursively build a node from a ComponentCategory.
 * If the category or its descendants have no leaves, return null.
 */
function buildNodeFromCategory(
  category: ComponentCategory,
  dinCodeToLeaves: Map<number, ChartDataLeaf[]>
): ChartDataInternalNode | null {
  const childrenNodes = category.children
    .map((type) => buildNodeFromType(type, dinCodeToLeaves))
    .filter((node): node is ChartDataNode => node !== null)

  if (childrenNodes.length === 0) {
    return null
  }

  return {
    isLeaf: false,
    label: `${category.number}: ${category.name}`,
    children: childrenNodes,
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/**
 * Build a node from a ComponentType.
 * A ComponentType can have multiple leaf nodes (if multiple elements matched this din_code)
 * or no leaves at all. If no leaves, return null.
 */
function buildNodeFromType(type: ComponentType, dinCodeToLeaves: Map<number, ChartDataLeaf[]>): ChartDataNode | null {
  const leaves = dinCodeToLeaves.get(type.number)
  if (!leaves || leaves.length === 0) {
    return null
  }

  // If there are multiple leaves, we keep it as an internal node containing those leaves.
  // If there's only one leaf, we could directly return that leaf. But let's keep hierarchy consistent:
  // The instructions do not say we must flatten single-child nodes. We'll keep it as internal with children.
  if (leaves.length === 1) {
    // Optionally, return the leaf directly if you prefer:
    // return leaves[0]
  }

  return {
    isLeaf: false,
    label: `${type.number}: ${type.name}`,
    children: leaves, // all leaves for this DIN code
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/**
 * Compute weighted metric values for internal nodes by aggregating their children.
 * For leaves, metricValue is already set.
 * For internal nodes: metricValue = sum(child.metricValue*child.dimensionalValue) / sum(child.dimensionalValue)
 */
function computeWeightedMetrics(node: ChartDataNode): void {
  if (node.isLeaf) {
    // Leaf: metricValue and dimensionalValue already set
    return
  }

  // Internal node: compute children's metrics first
  for (const child of node.children) {
    computeWeightedMetrics(child)
  }

  let totalWeight = 0
  let weightedSum = 0

  for (const child of node.children) {
    const childMetric = child.metricValue
    const childDim = child.dimensionalValue
    totalWeight += childDim
    weightedSum += childMetric * childDim
  }

  node.dimensionalValue = totalWeight
  node.metricValue = totalWeight > 0 ? weightedSum / totalWeight : 0
}
