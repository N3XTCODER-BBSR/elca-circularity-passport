import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"
import { DimensionalFieldName } from "../misc/domain-types"

/**
 * Project metric values type definition
 * Contains the calculated values for different circularity metrics across the project
 */
export type ProjectMetricValues = {
  circularityIndex: number
  eolBuiltPoints: number
  dismantlingPoints: number
}

type Layer = CalculateCircularityDataForLayerReturnType
type Component = ElcaElementWithComponents<Layer>

// Types for intermediate calculations
type MetricAccumulator = {
  circularityIndexTimesDimensionalValueSum: number
  eolBuiltPointsTimesDimensionalValueSum: number
  dismantlingPointsTimesDimensionalValueSum: number
  totalDimensionalValue: number
}

/**
 * Gets the dimensional value for a layer based on component quantity
 *
 * @param {Layer} layer - The layer to get the dimensional value from
 * @param {number} componentQuantity - The quantity of the component
 * @param {DimensionalFieldName} dimensionalFieldName - The name of the dimensional field to use
 * @returns {number} - The calculated dimensional value
 */
const getDimensionalValue = (
  layer: Layer,
  componentQuantity: number,
  dimensionalFieldName: DimensionalFieldName
): number => (layer[dimensionalFieldName] ?? 0) * componentQuantity

/**
 * Calculates weighted metric value if the metric exists
 *
 * @param {number | null | undefined} metricValue - The metric value to weight
 * @param {number} dimensionalValue - The dimensional value to weight by
 * @returns {number} - The weighted metric value or 0 if metric doesn't exist
 */
const getWeightedMetricValue = (metricValue: number | null | undefined, dimensionalValue: number): number =>
  metricValue != null ? metricValue * dimensionalValue : 0

/**
 * Processes a single layer and returns its contribution to the metrics
 *
 * @param {Layer} layer - The layer to process
 * @param {number} componentQuantity - The quantity of the component
 * @param {DimensionalFieldName} dimensionalFieldName - The name of the dimensional field to use
 * @returns {MetricAccumulator} - The metric accumulator with this layer's contribution
 */
const processLayer = (
  layer: Layer,
  componentQuantity: number,
  dimensionalFieldName: DimensionalFieldName
): MetricAccumulator => {
  const dimensionalValue = getDimensionalValue(layer, componentQuantity, dimensionalFieldName)

  return {
    circularityIndexTimesDimensionalValueSum: getWeightedMetricValue(layer.circularityIndex, dimensionalValue),
    eolBuiltPointsTimesDimensionalValueSum: getWeightedMetricValue(layer.eolBuilt?.points, dimensionalValue),
    dismantlingPointsTimesDimensionalValueSum: getWeightedMetricValue(layer.dismantlingPoints, dimensionalValue),
    totalDimensionalValue: dimensionalValue,
  }
}

/**
 * Combines two metric accumulators into a single accumulator
 *
 * @param {MetricAccumulator} acc1 - First accumulator
 * @param {MetricAccumulator} acc2 - Second accumulator
 * @returns {MetricAccumulator} - Combined accumulator
 */
const combineAccumulators = (acc1: MetricAccumulator, acc2: MetricAccumulator): MetricAccumulator => ({
  circularityIndexTimesDimensionalValueSum:
    acc1.circularityIndexTimesDimensionalValueSum + acc2.circularityIndexTimesDimensionalValueSum,
  eolBuiltPointsTimesDimensionalValueSum:
    acc1.eolBuiltPointsTimesDimensionalValueSum + acc2.eolBuiltPointsTimesDimensionalValueSum,
  dismantlingPointsTimesDimensionalValueSum:
    acc1.dismantlingPointsTimesDimensionalValueSum + acc2.dismantlingPointsTimesDimensionalValueSum,
  totalDimensionalValue: acc1.totalDimensionalValue + acc2.totalDimensionalValue,
})

// Initial accumulator with zero values
const initialAccumulator: MetricAccumulator = {
  circularityIndexTimesDimensionalValueSum: 0,
  eolBuiltPointsTimesDimensionalValueSum: 0,
  dismantlingPointsTimesDimensionalValueSum: 0,
  totalDimensionalValue: 0,
}

/**
 * Calculates final metric values from the accumulator
 *
 * @param {MetricAccumulator} accumulator - The accumulated metric values
 * @returns {ProjectMetricValues} - The final calculated metric values
 */
const calculateFinalMetrics = (accumulator: MetricAccumulator): ProjectMetricValues => {
  const {
    circularityIndexTimesDimensionalValueSum,
    eolBuiltPointsTimesDimensionalValueSum,
    dismantlingPointsTimesDimensionalValueSum,
    totalDimensionalValue,
  } = accumulator

  /**
   * Safely divides two numbers, returning 0 if denominator is 0
   *
   * @param {number} numerator - The numerator
   * @param {number} denominator - The denominator
   * @returns {number} - The result of division or 0 if denominator is 0
   */
  const safeDivide = (numerator: number, denominator: number): number =>
    denominator === 0 ? 0 : numerator / denominator

  return {
    circularityIndex: safeDivide(circularityIndexTimesDimensionalValueSum, totalDimensionalValue),
    eolBuiltPoints: safeDivide(eolBuiltPointsTimesDimensionalValueSum, totalDimensionalValue),
    dismantlingPoints: safeDivide(dismantlingPointsTimesDimensionalValueSum, totalDimensionalValue),
  }
}

/**
 * Processes all layers in a component and returns the combined metrics
 *
 * @param {Component} component - The component to process
 * @param {DimensionalFieldName} dimensionalFieldName - The name of the dimensional field to use
 * @returns {MetricAccumulator} - The accumulated metrics for this component
 */
const processComponentLayers = (component: Component, dimensionalFieldName: DimensionalFieldName): MetricAccumulator =>
  component.layers.reduce(
    (acc, layer) => combineAccumulators(acc, processLayer(layer, component.quantity, dimensionalFieldName)),
    initialAccumulator
  )

/**
 * Calculates total metric values for a project based on circularity data
 *
 * This function processes all components and their layers to calculate weighted
 * averages of circularity metrics across the entire project.
 *
 * @param {Component[]} circularityData - Array of components with circularity data
 * @param {DimensionalFieldName} dimensionalFieldName - The name of the dimensional field to use for calculations
 * @returns {ProjectMetricValues} - The calculated metric values for the project
 */
export const calculateTotalMetricValuesForProject = (
  circularityData: Component[],
  dimensionalFieldName: DimensionalFieldName
): ProjectMetricValues => {
  // Process all components and their layers
  const accumulatedMetrics = circularityData.reduce(
    (acc, component) => combineAccumulators(acc, processComponentLayers(component, dimensionalFieldName)),
    initialAccumulator
  )

  // Calculate the final metric values
  return calculateFinalMetrics(accumulatedMetrics)
}
