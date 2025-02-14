import { ElcaElementWithComponents, ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { ElcaVariantElementBaseData } from "prisma/queries/legacyDb"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import calculateCircularityDataForLayer, {
  CalculateCircularityDataForLayerReturnType,
} from "../utils/calculate-circularity-data-for-layer"

export const getProjectCircularityIndexData = async (
  variantId: number,
  projectId: number
): Promise<ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]> => {
  const elementsWithComponents = await legacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId(
    variantId,
    projectId
  )

  return await Promise.all(
    elementsWithComponents.map(async (element) => {
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
