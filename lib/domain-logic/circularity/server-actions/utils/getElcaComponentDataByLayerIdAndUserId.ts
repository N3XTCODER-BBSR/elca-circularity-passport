import {
  Product,
  EnrichedProduct,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { Prisma, TBs_OekobaudatMapping } from "prisma/generated/client"

import {
  getTBaustoffMappingEntry,
  getTBaustoffProduct,
  getUserDefinedTBaustoffDataForComponentId,
} from "prisma/queries/db"
import { getElcaComponentDataByLayerIdAndUserId } from "prisma/queries/legacyDb"
import { calculateEolDataByEolCateogryData } from "../../utils/calculateEolDataByEolCateogryData"

export const fetchElcaComponentByIdAndUserId = async (layerId: number, userId: string) => {
  const projectComponent = await getElcaComponentDataByLayerIdAndUserId(layerId, userId)

  const [userDefinedData, mappingEntry] = await Promise.all([
    getUserDefinedTBaustoffDataForComponentId(layerId),
    getTBaustoffMappingEntry(projectComponent.oekobaudat_process_uuid, projectComponent.oekobaudat_process_db_uuid),
  ])

  const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappingEntry?.tBs_productId

  let product = null
  if (productId != null) {
    product = await getTBaustoffProduct(productId)
  }

  const enrichedComponent = processProjectComponent(projectComponent, userDefinedData, mappingEntry, product)

  return enrichedComponent
}

function processProjectComponent(
  projectComponent: Product,
  userDefinedData: UserEnrichedProductDataWithDisturbingSubstanceSelection | null,
  mappingEntry: TBs_OekobaudatMapping | null,
  product: Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }> | null
): EnrichedProduct {
  const componentRow: Product = projectComponent

  const productData = getTBaustoffProductData(
    componentRow.component_id,
    componentRow.oekobaudat_process_uuid,
    userDefinedData,
    mappingEntry,
    product
  )

  const enrichedComponent: EnrichedProduct = {
    ...componentRow,
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
  // TODO: check: do we need the underscored params still?
  _componentId: number,
  _oekobaudatProcessUuid: string,
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
