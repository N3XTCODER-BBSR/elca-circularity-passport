import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"

export const calculateTotalCircularityIndexForProject = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
) => {
  // TODO (XL): ensure to exlude
  // 1. components which don't fall into our selection of DIN categories
  // 2. explicitly excluded components

  // Calculate the total circularity index for the project by iterating over
  // all entries in circulartiyData
  //   and within each entry, summing the
  //     circularity index of each component
  //     calculate the volume of each component
  // At the end, divide the total circularity index by the total volume of the project
  // to get the total circularity index of the project

  let circularityIndexTimesVolumeSumOverAllComponentLayers = 0
  let totalVolume = 0

  for (const component of circularityData) {
    for (const layer of component.layers) {
      // Get the volume
      const { volume } = layer
      if (volume == null) {
        continue
      }

      // Accumulate total volume
      totalVolume += volume

      // Only proceed if circularityIndex is not null
      if (layer.circularityIndex == null) {
        continue
      }

      // Accumulate the product of circularityIndex and volume
      circularityIndexTimesVolumeSumOverAllComponentLayers += layer.circularityIndex * volume
    }
  }
  // Calculate the total circularity index for the project

  const totalCircularityIndexForProject = circularityIndexTimesVolumeSumOverAllComponentLayers / totalVolume
  return totalCircularityIndexForProject
}
