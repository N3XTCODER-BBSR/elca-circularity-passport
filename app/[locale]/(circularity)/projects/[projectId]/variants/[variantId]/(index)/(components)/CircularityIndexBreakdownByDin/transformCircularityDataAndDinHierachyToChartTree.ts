/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  ComponentCategory,
  ComponentGroup,
  ComponentType,
  costGroupCategoryNumbersToInclude,
  din276Hierarchy,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { DimensionalFieldName, MetricType } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { ChartDataInternalNode, ChartDataLeaf, ChartDataNode } from "./ChartAndBreadCrumbComponent"

/**
 * Transforms a list of elements (with possible multiple layers each) into a hierarchical
 * chart data structure aligned with the DIN 276 hierarchy.
 *
 * **Steps**:
 * 1. Filter elements by cost group (e.g. only 330, 340, 350, etc.).
 * 2. Build a map from DIN code to an array of single **leaf** nodes, aggregating each element's
 *    layers into total volume/mass & weighted-average circularity index.
 * 3. Recursively build internal nodes from the `din276Hierarchy` for group → category → type.
 * 4. Optionally skip the top-level root node if there's only one child (for simpler UI).
 * 5. Recursively compute dimensionalValue (sum of children's volume/mass) and metricValue (weighted avg).
 *
 * @param circularityData  A list of elements, each having one or more layers with circularity data
 * @param rootLabel        The label to give the top-level (root) node in the hierarchy
 * @param skipRootNode     If true, removes the artificial top-level node if it has only one child
 * @returns                The fully built hierarchy of chart data, with internal nodes for DIN groups and leaves for elements
 */
export function transformCircularityDataAndDinHierachyToChartTree(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName,
  rootLabel: string,
  metricType: MetricType,
  skipRootNode = true
): ChartDataNode {
  // 1. Filter data by cost group
  const filteredData = filterDataByCostGroup(circularityData)

  // 2. Build a map: DIN code -> array of single-leaf nodes (aggregated per element)
  const dinCodeToLeaves = buildDinCodeToLeafNodesMap(filteredData, dimensionalFieldName, metricType)

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

/**
 * Filters the list of elements so that only those whose DIN code
 * belongs to a selected set of cost group categories remain.
 *
 * @param circularityData  Array of building elements with associated circularity data
 * @returns                A filtered array including only elements whose DIN code
 *                        falls into `costGroupCategoryNumbersToInclude`.
 */
function filterDataByCostGroup(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
): ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] {
  return circularityData.filter((elem) => {
    // e.g. if din_code=331 -> floor(331/10)*10=330
    const level2Din = Math.floor(elem.din_code / 10) * 10
    return costGroupCategoryNumbersToInclude.includes(level2Din)
  })
}

function getMetricValue(layer: CalculateCircularityDataForLayerReturnType, metricType: MetricType): number {
  // TODO (L): when doing the type refactoring:
  // this is another place where we have to check for proper fallback handling
  // (or ideally even use a stricter input type)
  // Also, be aware that we have a getMetricValue defined twice atm, for different input types
  // (MaterialNode vs CalculateCircularityDataForLayerReturnType)
  switch (metricType) {
    case "eolBuiltPoints":
      return layer.eolBuilt?.points ?? 0
    case "dismantlingPoints":
      return layer.dismantlingPoints ?? 0
    case "circularityIndex":
      return layer.circularityIndex ?? 0
    default:
      return 0
  }
}

/**
 * Builds a map from DIN code → an array of *aggregated* leaf nodes, with exactly one leaf per element.
 *
 * We:
 * - Sum up all layer volumes or mass (depending on the value of dimensionalFieldName) in an element.
 * - Compute a weighted average circularity index based on those volumes/masses.
 *
 * @param data  List of elements to be aggregated
 * @returns     A Map where each DIN code points to a list of ChartDataLeaf nodes
 */
function buildDinCodeToLeafNodesMap(
  data: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName,
  metricType: MetricType
): Map<number, ChartDataLeaf[]> {
  const map = new Map<number, ChartDataLeaf[]>()

  for (const element of data) {
    // TODO: review / check whether the fallback to 1 for quantity is valid
    // TODO: also check codebase for other instances of fallback values and check if they are valid
    const { din_code, element_name, element_uuid, quantity } = element

    let totalDimensionalValue = 0
    let weightedSumMetric = 0

    for (const layer of element.layers) {
      const dimensionalValue = (layer[dimensionalFieldName] ?? 0) * quantity
      totalDimensionalValue += dimensionalValue

      const metricValue = getMetricValue(layer, metricType)

      weightedSumMetric += metricValue * dimensionalValue
    }

    const avgMetricValue = totalDimensionalValue > 0 ? weightedSumMetric / totalDimensionalValue : 0

    // Create exactly one leaf for this element
    const leaf: ChartDataLeaf = {
      isLeaf: true,
      label: element_name,
      resourceId: element_uuid,
      metricValue: avgMetricValue,
      dimensionalValue: totalDimensionalValue,
    }

    if (!map.has(din_code)) {
      map.set(din_code, [])
    }
    map.get(din_code)!.push(leaf)
  }

  return map
}

/**
 * Builds an internal node corresponding to a top-level `ComponentGroup` in the DIN hierarchy.
 * Collects children from the categories inside that group.
 *
 * @param group           A top-level DIN group (like "300: Bauwerk - Baukonstruktionen")
 * @param dinCodeToLeaves Map from DIN code to an array of aggregated leaf nodes
 * @returns               A ChartDataInternalNode, or `null` if there were no valid children
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
 * Builds an internal node corresponding to a `ComponentCategory` in the DIN hierarchy.
 * Collects children from the types inside that category.
 *
 * @param category        A DIN category (like "330: Außenwände")
 * @param dinCodeToLeaves Map from DIN code to an array of aggregated leaf nodes
 * @returns               A ChartDataInternalNode, or `null` if there were no valid children
 */
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

/**
 * Builds an internal node from a `ComponentType` in the DIN hierarchy,
 * retrieving all aggregated leaf nodes (one per element) from the `dinCodeToLeaves` map.
 *
 * @param type            A DIN type (like "331: Tragende Außenwände")
 * @param dinCodeToLeaves Map from DIN code to an array of aggregated leaf nodes
 * @returns               A ChartDataInternalNode with leaf children, or `null` if no leaves exist
 */
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
 * Recursively computes:
 * - `node.dimensionalValue` = sum of children's dimensionalValue
 * - `node.metricValue`      = weighted average (child.metricValue * child.dimensionalValue)
 *
 * This function modifies each node in-place, walking from the leaves up to the root.
 *
 * @param node  A chart data node (leaf or internal) whose metrics should be updated.
 */
function computeWeightedMetrics(node: ChartDataNode): void {
  if (node.isLeaf) return

  // Recurse on children first
  for (const child of node.children) {
    computeWeightedMetrics(child)
  }

  // Then compute this node's dimensionalValue (volume/mass sum) & metricValue (weighted average)
  let totalWeight = 0
  let weightedSum = 0

  for (const child of node.children) {
    totalWeight += child.dimensionalValue
    weightedSum += child.metricValue * child.dimensionalValue
  }

  node.dimensionalValue = totalWeight
  node.metricValue = totalWeight > 0 ? weightedSum / totalWeight : 0
}
