import _ from "lodash"
import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import calculateCircularityDataForLayer, {
  CalculateCircularityDataForLayerReturnType,
} from "../utils/calculate-circularity-data-for-layer"
import { getElcaElementsForProjectId } from "./getElcaElementsForProjectId"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"

// type ProjectCircularityIndexData = {
//   projectId: string
//   projectName: string
//   components: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
// }

export const getProjectCircularityIndexData = async (
  projectId: number,
  userId: string
  // ): Promise<ProjectCircularityIndexData> => {
): Promise<ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]> => {
  // TODO: once the merge confusion is resolved (is checked by Niko)
  // add authorization / authentication check here

  // 1. Get all components for the project
  const elements = await getElcaElementsForProjectId(projectId, userId)

  // 2. Call existing function to get all the data for the components
  const componentsWithProducts: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await Promise.all(
      elements.map(async (element) => {
        const elementDetailsWithProducts = await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
          element.element_uuid,
          userId
        )
        // return elementDetailsWithProducts
        return {
          ...elementDetailsWithProducts,
          layers: elementDetailsWithProducts.layers.map((layer) => calculateCircularityDataForLayer(layer)),
        } as ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>
      })
    )

  // make TODO note: refactor so that all data is fetched by only one query;
  // currently there are 1+n queries: 1 for the project and n for the components

  // return {
  //   projectId,
  //   projectName: ,
  //   components: componentsWithProducts,
  // }

  return componentsWithProducts
}
