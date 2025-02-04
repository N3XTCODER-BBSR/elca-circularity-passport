import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { getElcaElementsForVariantId } from "./getElcaElementsForProjectId"
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

  const elements = await getElcaElementsForVariantId(variantId, projectId)

  // 2. Call existing function to get all the data for the components.
  // TODO (M): consider to refactor so that all data is fetched by only one query;
  // currently there are 1+n queries: 1 for the project and n for the components
  const componentsWithProducts: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await Promise.all(
      elements.map(async (element) => {
        const elementDetailsWithProducts = await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
          variantId,
          projectId,
          element.element_uuid
        )

        const productIds = elementDetailsWithProducts.layers.map((layer) => layer.component_id)
        const excludedProductIds = await dbDalInstance.getExcludedProductIds(productIds)
        const excludedProductIdsSet = new Set(excludedProductIds.map((entry) => entry.productId))

        return {
          ...elementDetailsWithProducts,
          layers: elementDetailsWithProducts.layers
            .filter((layer) => !excludedProductIdsSet.has(layer.component_id))
            .map((layer) => calculateCircularityDataForLayer(layer)),
        } as ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>
      })
    )

  return componentsWithProducts
}
