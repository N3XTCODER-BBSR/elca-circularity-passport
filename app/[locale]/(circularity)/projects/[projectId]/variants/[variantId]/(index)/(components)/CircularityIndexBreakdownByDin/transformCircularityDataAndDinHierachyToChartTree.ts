import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  ComponentCategory,
  ComponentGroup,
  ComponentType,
  costGroupCategoryNumbersToInclude,
  din276Hierarchy,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { ChartDataInternalNode, ChartDataLeaf, ChartDataNode } from "./ChartAndBreadCrumbComponent"

export function transformCircularityDataAndDinHierachyToChartTree(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  rootLabel: string,
  skipRootNode = true
): ChartDataNode {
  // 1. Filter data by cost group
  const filteredData = filterDataByCostGroup(circularityData)

  // 2. Build a map: DIN code -> array of single-leaf nodes (aggregated per element)
  const dinCodeToLeaves = buildDinCodeToLeafNodesMap(filteredData)

  // 3. Build the hierarchy from `din276Hierarchy`
  const children = din276Hierarchy
    .map((group) => buildNodeFromGroup(group, dinCodeToLeaves))
    .filter((node): node is ChartDataInternalNode => node !== null) // Type predicate

  // Create the top-level root node
  const rootNode: ChartDataInternalNode = {
    isLeaf: false,
    label: rootLabel,
    children: children,
    metricValue: 0,
    dimensionalValue: 0,
  }

  // 4. Possibly skip the root node in the final UI
  if (skipRootNode && rootNode.children.length === 1 && !rootNode.children[0]!.isLeaf) {
    // Flatten the single child
    const singleChild = rootNode.children[0] as ChartDataInternalNode
    rootNode.children = singleChild.children
  }

  // 5. Compute weighted average metrics bottom-up
  computeWeightedMetrics(rootNode)

  return rootNode
}

/** Filter out elements whose DIN code is not in the selected cost group categories. */
function filterDataByCostGroup(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
): ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] {
  return circularityData.filter((elem) => {
    const level2Din = Math.floor(elem.din_code / 10) * 10
    return costGroupCategoryNumbersToInclude.includes(level2Din)
  })
}

/**
 * Build a map from DIN code -> array of leaf nodes (one leaf per element),
 * aggregating that element's layers into totalMass & weighted average circularityIndex.
 */
function buildDinCodeToLeafNodesMap(
  data: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
): Map<number, ChartDataLeaf[]> {
  const map = new Map<number, ChartDataLeaf[]>()

  for (const element of data) {
    const { din_code, element_name, element_uuid, quantity = 1 } = element

    let totalMass = 0
    let weightedSumCI = 0

    for (const layer of element.layers) {
      const mass = (layer.mass ?? 0) * quantity
      const ci = layer.circularityIndex ?? 0
      totalMass += mass
      weightedSumCI += ci * mass
    }

    const avgCI = totalMass > 0 ? weightedSumCI / totalMass : 0

    const leaf: ChartDataLeaf = {
      isLeaf: true,
      label: element_name,
      resourceId: element_uuid,
      metricValue: avgCI,
      dimensionalValue: totalMass,
    }

    if (!map.has(din_code)) {
      map.set(din_code, [])
    }
    map.get(din_code)!.push(leaf)
  }

  return map
}

/** Build an internal node from a top-level DIN group. Returns null if no children. */
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

/** Build an internal node from a category. Returns null if no children. */
function buildNodeFromCategory(
  category: ComponentCategory,
  dinCodeToLeaves: Map<number, ChartDataLeaf[]>
): ChartDataInternalNode | null {
  const childrenNodes = category.children
    .map((type) => buildNodeFromType(type, dinCodeToLeaves))
    .filter((node): node is ChartDataInternalNode => node !== null)

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

/** Build an internal node from a type. This node has leaves (ChartDataLeaf) as children. */
function buildNodeFromType(
  type: ComponentType,
  dinCodeToLeaves: Map<number, ChartDataLeaf[]>
): ChartDataInternalNode | null {
  const leaves = dinCodeToLeaves.get(type.number)
  if (!leaves || leaves.length === 0) {
    return null
  }

  return {
    isLeaf: false,
    label: `${type.number}: ${type.name}`,
    children: leaves, // leaves are ChartDataLeaf[], which is valid for ChartDataNode[]
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/**
 * Recursively compute:
 * - node.dimensionalValue = sum of children's dimensionalValue
 * - node.metricValue = weighted average (child.metricValue * child.dimensionalValue)
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
