import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import calculateCircularityDataForLayer, {
  CalculateCircularityDataForLayerReturnType,
} from "../utils/calculate-circularity-data-for-layer"

// type ProjectCircularityIndexData = {
//   projectId: string
//   projectName: string
//   components: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
// }

export const getProjectCircularityIndexData = async (
  variantId: number,
  projectId: number
  // ): Promise<ProjectCircularityIndexData> => {
): Promise<ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]> => {
  // TODO (XL): once the merge confusion is resolved (is checked by Niko)
  // add authorization / authentication check here
  // 1. Get all components for the project
  // TODO (XL): only get the elements that are falling into the DIN categories we are considering

  // const elements = await getElcaElementsForVariantId(variantId, projectId)

  // 2. Call existing function to get all the data for the components.
  // TODO (M): consider to refactor so that all data is fetched by only one query;
  // currently there are 1+n queries: 1 for the project and n for the components
  // const componentsWithProducts: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =

  const elementsWithComponents = await legacyDbDalInstance.FOOgetElcaComponentsWithElementsForProjectAndVariantId(
    variantId,
    projectId
  )

  // TODO: BATCHING - START
  // TODO: Lift this up
  // const elementBaseData: ElcaVariantElementBaseData = await legacyDbDalInstance.getElcaVariantElementBaseDataByUuid(
  //   componentInstanceId,
  //   variantId,
  //   projectId
  // )

  // // TODO: Lift this up
  // const projectComponents: ElcaProjectComponentRow[] = await legacyDbDalInstance.getElcaVariantComponentsByInstanceId(
  //   componentInstanceId,
  //   variantId,
  //   projectId
  // )
  // TODO: BATCHING - END

  await Promise.all(
    elementsWithComponents.map(async (element) => {
      // TODO: probably highly inefficient DB query handling here.
      // Should use batching etc instead of mapping throgh elements and hitting a new query for each one
      // const elementDetailsWithProducts = await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
      //   variantId,
      //   projectId,
      //   element.element_uuid
      // )

      const productIds = element.element_components.map((component) => component.id)
      const excludedProductIds = await dbDalInstance.getExcludedProductIds(productIds)
      const excludedProductIdsSet = new Set(excludedProductIds.map((entry) => entry.productId))

      return {
        ...elementDetailsWithProducts,
        layers: element.element_components
          .filter((layer) => !excludedProductIdsSet.has(layer.id))
          .map((layer) => calculateCircularityDataForLayer(layer)),
      } as ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>
    })
  )

  return componentsWithProducts
}
