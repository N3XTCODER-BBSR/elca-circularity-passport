import {
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { Prisma, TBs_OekobaudatMapping } from "prisma/generated/client"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { calculateEolDataByEolCateogryData } from "./calculateEolDataByEolCateogryData"
import { calculateVolumeForProduct } from "./calculateVolumeForProduct"
import { getMassForProduct } from "../misc/getMassForProducts"

export const fetchElcaComponentById = async (layerId: number, variantId: number, projectId: number) => {
  const projectComponent = await legacyDbDalInstance.getElcaComponentDataByLayerId(layerId, variantId, projectId)

  const mass = await getMassForProduct(layerId)

  const [userDefinedData, mappingEntry] = await Promise.all([
    dbDalInstance.getUserDefinedTBaustoffDataForComponentId(layerId),
    dbDalInstance.getTBaustoffMappingEntry(
      projectComponent.oekobaudat_process_uuid,
      projectComponent.oekobaudat_process_db_uuid!
    ),
  ])

  const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappingEntry?.tBs_productId

  let product = null
  if (productId !== null && productId !== undefined) {
    product = await dbDalInstance.getTBaustoffProduct(productId)
  }

  const enrichedComponent = await processProjectComponent(
    projectComponent as unknown as ElcaProjectComponentRow, // TODO (L): adapt types so they are compatible to Prisma types
    userDefinedData,
    mappingEntry,
    product,
    mass
  )

  return enrichedComponent
}

async function processProjectComponent(
  projectComponent: ElcaProjectComponentRow,
  userDefinedData: UserEnrichedProductDataWithDisturbingSubstanceSelection | null,
  mappingEntry: TBs_OekobaudatMapping | null,
  product: Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }> | null,
  mass: number | null
): Promise<EnrichedElcaElementComponent> {
  const componentRow: ElcaProjectComponentRow = projectComponent

  const productData = getTBaustoffProductData(userDefinedData, mappingEntry, product)

  const volume = calculateVolumeForProduct(componentRow.layer_length, componentRow.layer_width, componentRow.layer_size)

  const isExcluded = await dbDalInstance.getExcludedProductId(componentRow.component_id)
  const enrichedComponent: EnrichedElcaElementComponent = {
    ...componentRow,
    mass,
    isExcluded: !!isExcluded,
    volume,
    tBaustoffProductData: productData,
    tBaustoffProductSelectedByUser: userDefinedData?.tBaustoffProductSelectedByUser,
    dismantlingPotentialClassId: userDefinedData?.dismantlingPotentialClassId,
    eolUnbuiltSpecificScenario: userDefinedData?.specificEolUnbuiltTotalScenario,
    eolUnbuiltSpecificScenarioProofText: userDefinedData?.specificEolUnbuiltTotalScenarioProofText,
    disturbingSubstanceSelections: userDefinedData?.selectedDisturbingSubstances ?? [],
    disturbingEolScenarioForS4: userDefinedData?.disturbingEolScenarioForS4,
  }

  return enrichedComponent
}

function getTBaustoffProductData(
  userDefinedData: UserEnrichedProductDataWithDisturbingSubstanceSelection | null,
  mappingEntry: TBs_OekobaudatMapping | null,
  product: Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }> | null
): TBaustoffProductData | undefined {
  const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappingEntry?.tBs_productId

  if (productId != null && product != null) {
    const eolCategory = product.tBs_ProductDefinitionEOLCategory
    const eolData = calculateEolDataByEolCateogryData(eolCategory)
    const tBaustoffProductData: TBaustoffProductData = { name: product.name, eolData, tBaustoffProductId: product.id }
    return tBaustoffProductData
  }

  return undefined
}
