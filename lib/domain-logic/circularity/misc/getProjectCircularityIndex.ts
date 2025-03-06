import { ElcaElementWithComponents, ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { ElcaVariantElementBaseData } from "prisma/queries/legacyDb"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { preloadCircularityData } from "./preloadCircularityData"
import calculateCircularityDataForLayer, {
  CalculateCircularityDataForLayerReturnType,
} from "../utils/calculate-circularity-data-for-layer"

type RawComponent = Awaited<
  ReturnType<typeof legacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId>
>[number]["element_components"][number]

export function mapLegacyComponentToProjectComponentRow(
  elementBaseData: ElcaVariantElementBaseData,
  rawComponent: RawComponent
): ElcaProjectComponentRow {
  return {
    component_id: rawComponent.id,
    element_uuid: elementBaseData.uuid,
    layer_position: rawComponent.layer_position || -1,
    is_layer: rawComponent.is_layer,
    process_name: rawComponent.process_configs.name,
    oekobaudat_process_uuid: rawComponent.process_configs.process_life_cycle_assignments[0]?.processes.uuid,
    pdb_name: rawComponent.process_configs.process_life_cycle_assignments[0]?.processes.process_dbs.name,
    pdb_version: rawComponent.process_configs.process_life_cycle_assignments[0]?.processes.process_dbs.version,
    oekobaudat_process_db_uuid:
      rawComponent.process_configs.process_life_cycle_assignments[0]?.processes.process_dbs.uuid,
    element_name: elementBaseData.element_name,
    unit: elementBaseData.unit,
    quantity: elementBaseData.quantity,
    layer_size: rawComponent.layer_size === null ? null : Number(rawComponent.layer_size),
    layer_length: rawComponent.layer_length === null ? null : Number(rawComponent.layer_length),
    layer_width: rawComponent.layer_width === null ? null : Number(rawComponent.layer_width),
    layer_area_ratio: rawComponent.layer_area_ratio === null ? null : Number(rawComponent.layer_area_ratio),
    process_config_density:
      rawComponent.process_configs.density === null ? null : Number(rawComponent.process_configs.density),
    process_config_id: rawComponent.process_configs.id,
    process_config_name: rawComponent.process_configs.name,
    process_category_node_id: rawComponent.process_configs.process_category_node_id,
    process_category_ref_num: rawComponent.process_configs.process_categories.ref_num,
  }
}

export const getProjectCircularityIndexData = async (
  variantId: number,
  projectId: number
): Promise<ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]> => {
  const elementsWithComponents = await legacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId(
    variantId,
    projectId
  )

  const mappedComponents = elementsWithComponents.flatMap((element) => {
    const elementBaseData: ElcaVariantElementBaseData = {
      uuid: element.uuid,
      din_code: element.element_types.din_code,
      element_name: element.name,
      element_type_name: element.element_types.name,
      unit: element.ref_unit,
      quantity: Number(element.quantity),
    }

    return element.element_components.map((component) =>
      mapLegacyComponentToProjectComponentRow(elementBaseData, component)
    )
  })

  const preloadedData = await preloadCircularityData(mappedComponents)

  return await Promise.all(
    elementsWithComponents.map(async (element) => {
      const elementBaseData: ElcaVariantElementBaseData = {
        uuid: element.uuid,
        din_code: element.element_types.din_code,
        element_name: element.name,
        element_type_name: element.element_types.name,
        unit: element.ref_unit,
        quantity: Number(element.quantity),
      }

      const elementComponents: ElcaProjectComponentRow[] = element.element_components.map((component) =>
        mapLegacyComponentToProjectComponentRow(elementBaseData, component)
      )

      const elementDetailsWithProducts = await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
        elementBaseData,
        elementComponents,
        preloadedData.excludedProductIdsSet,
        preloadedData.userEnrichedMap,
        preloadedData.tBaustoffMappingEntriesMap,
        preloadedData.tBaustoffProductMap,
        preloadedData.productMassMap
      )

      return {
        ...elementDetailsWithProducts,
        layers: elementDetailsWithProducts.layers
          .filter((layer) => !preloadedData.excludedProductIdsSet.has(layer.component_id))
          .map((layer) => calculateCircularityDataForLayer(layer)),
      } as ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>
    })
  )
}
