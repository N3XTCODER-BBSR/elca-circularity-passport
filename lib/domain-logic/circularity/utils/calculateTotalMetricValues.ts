import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"

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

// Get the dimensional value for a layer based on component quantity
const getDimensionalValue = (
  layer: Layer,
  componentQuantity: number,
  dimensionalFieldName: DimensionalFieldName
): number => (layer[dimensionalFieldName] ?? 0) * componentQuantity

// Calculate weighted metric value if the metric exists
const getWeightedMetricValue = (metricValue: number | null | undefined, dimensionalValue: number): number =>
  metricValue != null ? metricValue * dimensionalValue : 0

// Process a single layer and return its contribution to the metrics
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

// Combine two metric accumulators
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

// Calculate final metric values from accumulator
const calculateFinalMetrics = (accumulator: MetricAccumulator): ProjectMetricValues => {
  const {
    circularityIndexTimesDimensionalValueSum,
    eolBuiltPointsTimesDimensionalValueSum,
    dismantlingPointsTimesDimensionalValueSum,
    totalDimensionalValue,
  } = accumulator

  const safeDivide = (numerator: number, denominator: number): number =>
    denominator === 0 ? 0 : numerator / denominator

  return {
    circularityIndex: safeDivide(circularityIndexTimesDimensionalValueSum, totalDimensionalValue),
    eolBuiltPoints: safeDivide(eolBuiltPointsTimesDimensionalValueSum, totalDimensionalValue),
    dismantlingPoints: safeDivide(dismantlingPointsTimesDimensionalValueSum, totalDimensionalValue),
  }
}

// Process all layers in a component
const processComponentLayers = (component: Component, dimensionalFieldName: DimensionalFieldName): MetricAccumulator =>
  component.layers.reduce(
    (acc, layer) => combineAccumulators(acc, processLayer(layer, component.quantity, dimensionalFieldName)),
    initialAccumulator
  )

// Main function
export const calculateTotalMetricValuesForProject = (
  circularityData: Component[],
  dimensionalFieldName: DimensionalFieldName
): ProjectMetricValues => {
  // TODO (XL): ensure to exclude
  // 1. components which don't fall into our selection of DIN categories
  // 2. explicitly excluded components

  // Process all components and their layers
  const accumulatedMetrics = circularityData.reduce(
    (acc, component) => combineAccumulators(acc, processComponentLayers(component, dimensionalFieldName)),
    initialAccumulator
  )

  // Calculate the final metric values
  return calculateFinalMetrics(accumulatedMetrics)
}
