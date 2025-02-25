import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { ElcaVariantElementBaseData } from "prisma/queries/legacyDb"
import { calculateVolumeForLayer } from "./getMassForLayer"
import { Prisma, TBs_OekobaudatMapping } from "../../../../prisma/generated/client"
import { calculateEolDataByEolCateogryData } from "../utils/calculateEolDataByEolCateogryData"

export const getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId = async (
  elementBaseData: ElcaVariantElementBaseData,
  elementComponents: ElcaProjectComponentRow[],
  excludedProductIdsSet: Set<number>,
  userDefinedTBaustoffDataMap: Map<number, UserEnrichedProductDataWithDisturbingSubstanceSelection>,
  tBaustoffMappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  tBaustoffProductMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >,
  productMassMap: Map<number, number | null>
): Promise<ElcaElementWithComponents<EnrichedElcaElementComponent>> => {
  const layers = await enrichLayerData(
    excludedProductIdsSet,
    elementComponents,
    userDefinedTBaustoffDataMap,
    tBaustoffMappingEntriesMap,
    tBaustoffProductMap,
    productMassMap
  )
  return {
    element_uuid: elementBaseData.uuid,
    element_name: elementBaseData.element_name,
    element_type_name: elementBaseData.element_type_name,
    din_code: elementBaseData.din_code!,
    unit: elementBaseData.unit!,
    quantity: elementBaseData.quantity,
    layers,
  }
}

async function enrichLayerData(
  excludedProductIdsSet: Set<number>,
  components: ElcaProjectComponentRow[],
  userDefinedMap: Map<number, UserEnrichedProductDataWithDisturbingSubstanceSelection>,
  mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  productMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >,
  productMassMap: Map<number, number | null>
): Promise<EnrichedElcaElementComponent[]> {
  const enrichedComponents = components.map(async (component) => {
    const userDefinedData = userDefinedMap.get(component.component_id)
    const oekobaudatUuid = component.oekobaudat_process_uuid

    const mappedEntry = oekobaudatUuid ? mappingEntriesMap.get(oekobaudatUuid) : null
    const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappedEntry?.tBs_productId

    let tBaustoffProductData: TBaustoffProductData | undefined
    if (productId !== null && productId !== undefined) {
      const product = productMap.get(productId)
      if (product) {
        const eolCategory = product.tBs_ProductDefinitionEOLCategory
        const eolData = calculateEolDataByEolCateogryData(eolCategory)
        tBaustoffProductData = {
          name: product.name,
          eolData,
          tBaustoffProductId: product.id,
        }
      }
    }

    const mass = productMassMap.get(component.component_id) || null

    const volume = calculateVolumeForLayer(component)

    return {
      ...component,
      mass,
      volume,
      isExcluded: excludedProductIdsSet.has(component.component_id),
      tBaustoffProductData,
      dismantlingPotentialClassId: userDefinedData?.dismantlingPotentialClassId,
      tBaustoffProductSelectedByUser: userDefinedData?.tBaustoffProductSelectedByUser,
      eolUnbuiltSpecificScenario: userDefinedData?.specificEolUnbuiltTotalScenario,
      eolUnbuiltSpecificScenarioProofText: userDefinedData?.specificEolUnbuiltTotalScenarioProofText,
      disturbingSubstanceSelections: userDefinedData?.selectedDisturbingSubstances || [],
      disturbingEolScenarioForS4: userDefinedData?.disturbingEolScenarioForS4,
    }
  })
  return (await Promise.all(enrichedComponents)).sort((a, b) => a.layer_position - b.layer_position)
}
