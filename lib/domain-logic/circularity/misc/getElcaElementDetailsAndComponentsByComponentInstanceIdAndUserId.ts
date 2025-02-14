import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { ElcaVariantElementBaseData } from "prisma/queries/legacyDb"
import { calculateMassForProduct } from "./calculateMassForProduct"
import { Prisma, TBs_OekobaudatMapping, UserEnrichedProductData } from "../../../../prisma/generated/client"
import { calculateEolDataByEolCateogryData } from "../utils/calculateEolDataByEolCateogryData"
import { calculateVolumeForLayer } from "../utils/calculateMassForLayer"

// TODO: Rename now
export const getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId = async (
  elementBaseData: ElcaVariantElementBaseData,
  elementComponents: ElcaProjectComponentRow[]
): Promise<ElcaElementWithComponents<EnrichedElcaElementComponent>> => {
  const componentIds = Array.from(new Set(elementComponents.map((c) => c.component_id)))
  const oekobaudatProcessUuids = Array.from(
    new Set(elementComponents.map((c) => c.oekobaudat_process_uuid).filter(Boolean))
  )

  const [excludedProductIds, userDefinedTBaustoffDataList, tBaustoffMappingEntries] = await Promise.all([
    dbDalInstance.getExcludedProductIds(componentIds),
    dbDalInstance.getUserDefinedTBaustoffData(componentIds),
    dbDalInstance.getTBaustoffMappingEntries(oekobaudatProcessUuids),
  ])

  const excludedProductIdsSet = new Set(excludedProductIds.map((entry) => entry.productId))

  const userDefinedTBaustoffDataMap = createMap(userDefinedTBaustoffDataList, (entry) => entry.elcaElementComponentId)
  const tBaustoffMappingEntriesMap = createMap(tBaustoffMappingEntries, (entry) => entry.oebd_processUuid)

  const tBaustoffProductIds = getUniqueTBaustoffProductIds(userDefinedTBaustoffDataList, tBaustoffMappingEntries)

  const tBaustoffProductsList = await dbDalInstance.getTBaustoffProducts(tBaustoffProductIds)
  const tBaustoffProductMap = createMap(tBaustoffProductsList, (product) => product.id)

  return {
    element_uuid: elementBaseData.uuid,
    element_name: elementBaseData.element_name,
    element_type_name: elementBaseData.element_type_name,
    din_code: elementBaseData.din_code,
    unit: elementBaseData.unit,
    quantity: elementBaseData.quantity,
    layers: await enrichLayerData(
      excludedProductIdsSet,
      elementComponents,
      userDefinedTBaustoffDataMap,
      tBaustoffMappingEntriesMap,
      tBaustoffProductMap
    ),
  } as ElcaElementWithComponents<EnrichedElcaElementComponent>
}

function createMap<T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>()
  list.forEach((item) => {
    const key = keyGetter(item)
    map.set(key, item)
  })
  return map
}

function getUniqueTBaustoffProductIds(
  userDefinedList: UserEnrichedProductData[],
  mappingEntries: TBs_OekobaudatMapping[]
): number[] {
  const userDefinedIds = userDefinedList
    .map((entry) => entry.tBaustoffProductDefinitionId)
    .filter((id): id is number => id != null)

  const mappingEntryIds = mappingEntries.map((entry) => entry.tBs_productId).filter((id): id is number => id != null)

  return Array.from(new Set([...userDefinedIds, ...mappingEntryIds]))
}

function getTBaustoffProductData(
  componentId: number,
  oekobaudatProcessUuid: string | null | undefined,
  userDefinedMap: Map<number, UserEnrichedProductData>,
  mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  productMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >
): TBaustoffProductData | undefined {
  const userDefinedData = userDefinedMap.get(componentId)
  let productId = userDefinedData?.tBaustoffProductDefinitionId

  if (productId == null) {
    const mappingEntry = mappingEntriesMap.get(oekobaudatProcessUuid!)
    productId = mappingEntry?.tBs_productId
  }

  if (productId != null) {
    const product = productMap.get(productId)
    if (!product) {
      console.error("tBaustoffProduct is null")
      return undefined
    }

    const eolCategory = product.tBs_ProductDefinitionEOLCategory
    const eolData = calculateEolDataByEolCateogryData(eolCategory)
    const tBaustoffProductData: TBaustoffProductData = { name: product.name, eolData, tBaustoffProductId: product.id }
    return tBaustoffProductData
  }

  return undefined
}

const enrichLayerData = async (
  excludedProductIdsSet: Set<number>,
  components: ElcaProjectComponentRow[],
  userDefinedMap: Map<number, UserEnrichedProductDataWithDisturbingSubstanceSelection>,
  mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  productMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >
): Promise<EnrichedElcaElementComponent[]> => {
  const enrichedComponents = components
    .filter(({ component_id }) => component_id != null)
    .map(async (component) => {
      const productData = getTBaustoffProductData(
        component.component_id,
        component.oekobaudat_process_uuid,
        userDefinedMap,
        mappingEntriesMap,
        productMap
      )

      const userDefinedComponentData = userDefinedMap.get(component.component_id)
      let mass: number | null = null
      try {
        mass = await calculateMassForProduct(component.component_id)
      } catch (error) {
        console.error(error)
      }

      const volume = calculateVolumeForLayer(component)

      const enrichedElcaElementComponent: EnrichedElcaElementComponent = {
        ...component,
        mass,
        volume,
        isExcluded: excludedProductIdsSet.has(component.component_id),
        tBaustoffProductData: productData,
        dismantlingPotentialClassId: userDefinedComponentData?.dismantlingPotentialClassId,
        tBaustoffProductSelectedByUser: userDefinedComponentData?.tBaustoffProductSelectedByUser,
        eolUnbuiltSpecificScenario: userDefinedComponentData?.specificEolUnbuiltTotalScenario,
        eolUnbuiltSpecificScenarioProofText: userDefinedComponentData?.specificEolUnbuiltTotalScenarioProofText,
        disturbingSubstanceSelections: userDefinedComponentData?.selectedDisturbingSubstances || [],
        disturbingEolScenarioForS4: userDefinedComponentData?.disturbingEolScenarioForS4,
      }

      return enrichedElcaElementComponent
    })
  return (await Promise.all(enrichedComponents)).sort((a, b) => a.layer_position - b.layer_position)
}
