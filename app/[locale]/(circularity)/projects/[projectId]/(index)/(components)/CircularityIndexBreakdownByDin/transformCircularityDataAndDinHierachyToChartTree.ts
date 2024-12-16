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

/**
 * Transforms the given `circularityData` into the ChartDataNode tree structure.
 *
 * Steps:
 * 1. Filter out all components not belonging to the selected DIN categories.
 * 2. Create leaf nodes for each layer (CalculateCircularityDataForLayerReturnType).
 * 3. Build internal nodes from `din276Hierarchy` that contain these leaf nodes.
 * 4. Compute weighted average `metricValue` for internal nodes.
 * 5. If `skipRootNode` is true, ensure that the `rootLabel` is used at the top level but
 *    remove any unnecessary single top-level node layer so we don't start with a single bar.
 *
 * @param circularityData array of ElcaElementWithComponents
 * @param getWeightByProductId function to get the weight for a given product_id
 * @param rootLabel the projectName or main title for the root breadcrumb
 * @param skipRootNode if true, we do not show the artificial root node from the DIN hierarchy and start directly from the next level down, but still use `rootLabel` for the top-level.
 * @returns ChartDataNode representing the entire hierarchy
 */
export function transformCircularityDataAndDinHierachyToChartTree(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  // getWeightByProductId: GetWeightByProductIdFn,
  rootLabel: string,
  skipRootNode = true
): ChartDataNode {
  // 1. Filter data
  const filteredData = filterDataByCostGroup(circularityData)

  // 2. Map DIN codes to leaf nodes
  const dinCodeToLeaves = buildDinCodeToLeafNodesMap(filteredData)

  // 3. Build the hierarchy from `din276Hierarchy`
  const children = din276Hierarchy
    .map((group) => buildNodeFromGroup(group, dinCodeToLeaves))
    .filter((node): node is ChartDataInternalNode => node !== null)

  let rootNode: ChartDataNode

  if (skipRootNode) {
    // We don't show the artificial DIN root node.
    // Instead, use rootLabel for the top-level node.

    // Even if there are multiple top-level nodes, we combine them:
    rootNode = {
      isLeaf: false,
      label: rootLabel,
      children: children,
      metricValue: 0,
      dimensionalValue: 0,
    }

    // After building, if there's exactly one top-level child and it's internal,
    // we "flatten" it by lifting its children up. This avoids starting with a single bar.
    if (rootNode.children.length === 1 && !rootNode.children[0]!.isLeaf) {
      const singleChild = rootNode.children[0] as ChartDataInternalNode
      // Replace root's children with singleChild's children
      rootNode.children = singleChild.children
    }
  } else {
    // skipRootNode = false: we show an artificial root node
    rootNode = {
      isLeaf: false,
      label: rootLabel,
      children: children,
      metricValue: 0, // Will compute after building children
      dimensionalValue: 0,
    }
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
function buildDinCodeToLeafNodesMap(
  data: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  // getWeightByProductId: GetWeightByProductIdFn
): Map<number, ChartDataLeaf[]> {
  const map = new Map<number, ChartDataLeaf[]>()

  for (const element of data) {
    const { din_code } = element
    for (const layer of element.layers) {
      const weight = layer.mass
      const metricValue = layer.circularityIndex ?? 0 // TODO: probably not valid to fall back to 0; better throw error or ensure on type level beforehand
      // that circularityIndex is never null for any layer before being passed to this function

      const dimensionalValue = weight

      const leaf: ChartDataLeaf = {
        isLeaf: true,
        metricValue,
        // TODO: check whether this is valid handling or whether we should change the types
        dimensionalValue: dimensionalValue || 0,
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

/** Build a node from a ComponentGroup. Returns null if no descendants. */
function buildNodeFromGroup(
  group: ComponentGroup,
  dinCodeToLeaves: Map<number, ChartDataLeaf[]>
): ChartDataInternalNode | null {
  const childrenNodes = group.children
    .map((category) => buildNodeFromCategory(category, dinCodeToLeaves))
    .filter((node): node is ChartDataInternalNode => node !== null)

  if (childrenNodes.length === 0) return null

  return {
    isLeaf: false,
    label: `${group.number}: ${group.name}`,
    children: childrenNodes,
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/** Build a node from a ComponentCategory. Returns null if no descendants. */
function buildNodeFromCategory(
  category: ComponentCategory,
  dinCodeToLeaves: Map<number, ChartDataLeaf[]>
): ChartDataInternalNode | null {
  const childrenNodes = category.children
    .map((type) => buildNodeFromType(type, dinCodeToLeaves))
    .filter((node): node is ChartDataNode => node !== null)

  if (childrenNodes.length === 0) return null

  return {
    isLeaf: false,
    label: `${category.number}: ${category.name}`,
    children: childrenNodes,
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/** Build a node from a ComponentType. Returns null if no leaves. */
function buildNodeFromType(type: ComponentType, dinCodeToLeaves: Map<number, ChartDataLeaf[]>): ChartDataNode | null {
  const leaves = dinCodeToLeaves.get(type.number)
  if (!leaves || leaves.length === 0) {
    return null
  }

  return {
    isLeaf: false,
    label: `${type.number}: ${type.name}`,
    children: leaves,
    metricValue: 0,
    dimensionalValue: 0,
  }
}

/** Compute weighted metric values for internal nodes recursively. */
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
