import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"

export type ProjectMetricValues = {
  circularityIndex: number
  eolBuiltPoints: number
  dismantlingPoints: number
}

export const calculateTotalMetricValuesForProject = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName
): ProjectMetricValues => {
  // TODO (XL): ensure to exlude
  // 1. components which don't fall into our selection of DIN categories
  // 2. explicitly excluded components

  // Calculate the total circularity index for the project by iterating over
  // all entries in circulartiyData
  //   and within each entry, summing the
  //     circularity index of each component
  //     calculate the volume or mass (depending on dimensionalFieldName) of each component
  // At the end, divide the total circularity index by the total volume/mass of the project
  // to get the total circularity index of the project

  let circularityIndexTimesDimensionalValueSum = 0
  let eolBuiltPointsTimesDimensionalValueSum = 0
  let dismantlingPointsTimesDimensionalValueSum = 0
  let totalDimensionalValue = 0

  for (const component of circularityData) {
    for (const layer of component.layers) {
      // Get the dimensional value of the layer
      const dimensionalValue = (layer[dimensionalFieldName] ?? 0) * component.quantity
      if (dimensionalValue == null) {
        continue
      }

      // Accumulate total dimensional value
      totalDimensionalValue += dimensionalValue

      // Accumulate the product of each metric and dimensionalValue
      if (layer.circularityIndex != null) {
        circularityIndexTimesDimensionalValueSum += layer.circularityIndex * dimensionalValue
      }

      if (layer.eolBuilt?.points != null) {
        eolBuiltPointsTimesDimensionalValueSum += layer.eolBuilt.points * dimensionalValue
      }

      if (layer.dismantlingPoints != null) {
        dismantlingPointsTimesDimensionalValueSum += layer.dismantlingPoints * dimensionalValue
      }
    }
  }
  // Calculate the total metric values for the project
  return {
    circularityIndex: circularityIndexTimesDimensionalValueSum / totalDimensionalValue,
    eolBuiltPoints: eolBuiltPointsTimesDimensionalValueSum / totalDimensionalValue,
    dismantlingPoints: dismantlingPointsTimesDimensionalValueSum / totalDimensionalValue,
  }
}
