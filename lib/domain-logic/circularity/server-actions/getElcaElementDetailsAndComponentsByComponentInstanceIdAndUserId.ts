import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { getTBaustoffMappingEntries, getTBaustoffProducts, getUserDefinedTBaustoffData } from "prisma/queries/db"
import { getElcaProjectComponentsByInstanceIdAndUserId } from "prisma/queries/legacyDb"
import { getWeightByProductId } from "./getWeightByProductId"
import { Prisma, TBs_OekobaudatMapping, UserEnrichedProductData } from "../../../../prisma/generated/client"
import { calculateEolDataByEolCateogryData } from "../utils/calculateEolDataByEolCateogryData"

export const getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId = async (
  componentInstanceId: string,
  userId: string
): Promise<ElcaElementWithComponents<EnrichedElcaElementComponent>> => {
  const projectComponents: ElcaProjectComponentRow[] = await getElcaProjectComponentsByInstanceIdAndUserId(
    componentInstanceId,
    userId
  )

  const componentIds = Array.from(new Set(projectComponents.map((c) => c.component_id)))
  const oekobaudatProcessUuids = Array.from(new Set(projectComponents.map((c) => c.oekobaudat_process_uuid)))

  const [userDefinedTBaustoffDataList, tBaustoffMappingEntries] = await Promise.all([
    getUserDefinedTBaustoffData(componentIds),
    getTBaustoffMappingEntries(oekobaudatProcessUuids),
  ])

  const userDefinedTBaustoffDataMap = createMap(userDefinedTBaustoffDataList, (entry) => entry.elcaElementComponentId)
  const tBaustoffMappingEntriesMap = createMap(tBaustoffMappingEntries, (entry) => entry.oebd_processUuid)

  const tBaustoffProductIds = getUniqueTBaustoffProductIds(userDefinedTBaustoffDataList, tBaustoffMappingEntries)

  const tBaustoffProductsList = await getTBaustoffProducts(tBaustoffProductIds)
  const tBaustoffProductMap = createMap(tBaustoffProductsList, (product) => product.id)

  //         const { element_name, element_type_name, din_code, unit } = components[0]!

  //         const layers = processLayers(components, userDefinedMap, mappingEntriesMap, productMap)

  // const projectComponentsWithLayers: ElcaElementWithComponents<EnrichedElcaElementComponent> = processProjectComponents(
  //   projectComponents,
  //   userDefinedTBaustoffDataMap,
  //   tBaustoffMappingEntriesMap,
  //   tBaustoffProductMap
  // )

  // return projectComponentsWithLayers

  const componentData = projectComponents[0]

  return {
    element_uuid: componentData?.element_uuid,
    element_name: componentData?.element_name,
    element_type_name: componentData?.element_type_name,
    din_code: componentData?.din_code,
    unit: componentData?.unit,
    layers: await processLayers(
      projectComponents,
      userDefinedTBaustoffDataMap,
      tBaustoffMappingEntriesMap,
      tBaustoffProductMap
    ),
  } as ElcaElementWithComponents<EnrichedElcaElementComponent>
  // })
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
  oekobaudatProcessUuid: string,
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
    const mappingEntry = mappingEntriesMap.get(oekobaudatProcessUuid)
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

// TODO: 'process' doesn't seem to be the best name for this function
// it's more specifically about mapping/grouping/filtering
// function processProjectComponents(
//   projectComponents: ElcaProjectComponentRow[],
//   userDefinedMap: Map<number, UserEnrichedProductDataWithDisturbingSubstanceSelection>,
//   mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
//   productMap: Map<
//     number,
//     Prisma.TBs_ProductDefinitionGetPayload<{
//       include: { tBs_ProductDefinitionEOLCategory: true }
//     }>
//   >
// ): ElcaElementWithComponents<EnrichedElcaElementComponent>[] {
//   return (
//     _(projectComponents)
//       // TODO: check why this is needed
//       .groupBy("element_uuid")
//       .map((components, elementUuid) => {
//         const { element_name, element_type_name, din_code, unit } = components[0]!

//         const layers = processLayers(components, userDefinedMap, mappingEntriesMap, productMap)

//         return {
//           element_uuid: elementUuid,
//           element_name,
//           element_type_name,
//           din_code,
//           unit,
//           layers,
//         } as ElcaElementWithComponents<EnrichedElcaElementComponent>
//       })
//       .value()
//   )
// }

// TODO: 'process' doesn't seem to be the best name for this function
// it's more specifically about mapping/filtering
const processLayers = async (
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
      const weight = await getWeightByProductId(component.component_id)

      const enrichedElcaElementComponent: EnrichedElcaElementComponent = {
        ...component,
        weight,
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
