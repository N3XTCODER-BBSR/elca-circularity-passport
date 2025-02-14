import { ElcaElementWithComponents, ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { ElcaVariantElementBaseData } from "prisma/queries/legacyDb"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
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

  return await Promise.all(
    elementsWithComponents.map(async (element) => {
      // TODO: probably highly inefficient DB query handling here.
      // Should use batching etc instead of mapping throgh elements and hitting a new query for each one
      const elementBaseData: ElcaVariantElementBaseData = {
        uuid: element.uuid,
        din_code: element.element_types.din_code,
        element_name: element.element_types.name,
        element_type_name: element.element_types.name,
        unit: element.ref_unit,
        quantity: Number(element.quantity),
      }
      const elementComponents: ElcaProjectComponentRow[] = element.element_components.map((component) => ({
        component_id: component.id,
        element_uuid: element.uuid,
        layer_position: component.layer_position || -1,
        process_name: component.process_configs.name,
        // oekobaudat_process_uuid: component.process_configs.id,
        // TODO: thinkg about whether we would have to do a check here that there is only (exactly or max) one process_life_cycle_assignment
        // because we already filter by ident: "A1-3" in the query
        // and then there should probably not be any other fields that would create variance
        oekobaudat_process_uuid: component.process_configs.process_life_cycle_assignments[0]?.processes.uuid,
        pdb_name: component.process_configs.process_life_cycle_assignments[0]?.processes.process_dbs.name,
        pdb_version: component.process_configs.process_life_cycle_assignments[0]?.processes.process_dbs.version,
        oekobaudat_process_db_uuid:
          component.process_configs.process_life_cycle_assignments[0]?.processes.process_dbs.uuid,
        element_name: element.element_types.name,
        unit: element.ref_unit,
        quantity: Number(element.quantity),
        layer_size: Number(component.layer_size),
        layer_length: Number(component.layer_length),
        layer_width: Number(component.layer_width),
        process_config_density: Number(component.process_configs.density),
        process_config_id: component.process_configs.id,
        process_config_name: component.process_configs.name,
        process_category_node_id: component.process_configs.process_category_node_id,
        process_category_ref_num: component.process_configs.process_categories.ref_num,
      }))
      const elementDetailsWithProducts = await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
        elementBaseData,
        elementComponents
      )

      const productIds = element.element_components.map((component) => component.id)
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
}
