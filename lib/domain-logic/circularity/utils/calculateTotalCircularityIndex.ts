import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"

export const calculateTotalCircularityIndexForProject = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
) => {
  // TODO: ensure to exlude
  // 1. components which don't fall into our selection of DIN categories
  // 2. explicitly excluded components

  // Calculate the total circularity index for the project by iterating over
  // all entries in circulartiyData
  //   and within each entry, summing the
  //     circularity index of each component
  //     calculate the mass of each component
  // At the end, divide the total circularity index by the total mass of the project
  // to get the total circularity index of the project

  let circularityIndexTimesMassSumOverAllComponentLayers = 0
  let totalMass = 0

  for (const component of circularityData) {
    for (const layer of component.layers) {
      // Await the asynchronous function
      const { mass } = layer
      if (mass == null) {
        continue
      }

      // Accumulate total mass
      totalMass += mass

      // Only proceed if circularityIndex is not null
      if (layer.circularityIndex == null) {
        continue
      }

      // Accumulate the product of circularityIndex and mass
      circularityIndexTimesMassSumOverAllComponentLayers += layer.circularityIndex * mass
    }
  }
  // Calculate the total circularity index for the project

  const totalCircularityIndexForProject = circularityIndexTimesMassSumOverAllComponentLayers / totalMass
  return totalCircularityIndexForProject
}
