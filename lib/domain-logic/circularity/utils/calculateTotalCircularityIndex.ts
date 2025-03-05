import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"

export const calculateTotalCircularityIndexForProject = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName
) => {
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

  let circularityIndexTimesDimensionalValueSumOverAllComponentLayers = 0
  let totalDimensionalValue = 0

  for (const component of circularityData) {
    for (const layer of component.layers) {
      // Get the dimensional value of the layer
      const dimensionalValue = layer[dimensionalFieldName]
      if (dimensionalValue == null) {
        continue
      }

      // Accumulate total dimensional value
      totalDimensionalValue += dimensionalValue

      // Only proceed if circularityIndex is not null
      if (layer.circularityIndex == null) {
        continue
      }

      // Accumulate the product of circularityIndex and dimensionalValue
      circularityIndexTimesDimensionalValueSumOverAllComponentLayers += layer.circularityIndex * dimensionalValue
    }
  }
  // Calculate the total circularity index for the project

  const totalCircularityIndexForProject =
    circularityIndexTimesDimensionalValueSumOverAllComponentLayers / totalDimensionalValue
  return totalCircularityIndexForProject
}
