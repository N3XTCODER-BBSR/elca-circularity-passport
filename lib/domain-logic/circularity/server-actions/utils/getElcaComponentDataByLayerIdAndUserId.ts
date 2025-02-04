import {
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { Prisma, TBs_OekobaudatMapping } from "prisma/generated/client"

import {
  getExcludedProductId,
  getTBaustoffMappingEntry,
  getTBaustoffProduct,
  getUserDefinedTBaustoffDataForComponentId,
} from "prisma/queries/db"
import { getElcaComponentDataByLayerId } from "prisma/queries/legacyDb"
import { calculateEolDataByEolCateogryData } from "../../utils/calculateEolDataByEolCateogryData"
import { calculateMassForProduct, calculateVolumeForLayer } from "../calculateMassForProduct"

export const fetchElcaComponentById = async (layerId: number, variantId: number, projectId: number) => {
  const projectComponent = await getElcaComponentDataByLayerId(layerId, variantId, projectId)

  const [userDefinedData, mappingEntry] = await Promise.all([
    getUserDefinedTBaustoffDataForComponentId(layerId),
    getTBaustoffMappingEntry(projectComponent.oekobaudat_process_uuid, projectComponent.oekobaudat_process_db_uuid!),
  ])

  const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappingEntry?.tBs_productId

  let product = null
  if (productId != null) {
    product = await getTBaustoffProduct(productId)
  }

  const enrichedComponent = await processProjectComponent(
    projectComponent as unknown as ElcaProjectComponentRow, // TODO (L): adapt types so they are compatible to Prisma types
    userDefinedData,
    mappingEntry,
    product
  )

  return enrichedComponent
}

async function processProjectComponent(
  projectComponent: ElcaProjectComponentRow,
  userDefinedData: UserEnrichedProductDataWithDisturbingSubstanceSelection | null,
  mappingEntry: TBs_OekobaudatMapping | null,
  product: Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }> | null
): Promise<EnrichedElcaElementComponent> {
  const componentRow: ElcaProjectComponentRow = projectComponent

  const productData = getTBaustoffProductData(userDefinedData, mappingEntry, product)

  // for (const component of circularityData) {
  //   for (const layer of component.layers) {
  //     // Await the asynchronous function
  //     const { mass } = await calculateVolumeAndMass(layer)
  //     if (mass == null) {
  //       continue
  //     }

  //     // Accumulate total mass
  //     totalMass += mass

  //     // Only proceed if circularityIndex is not null
  //     if (layer.circularityIndex == null) {
  //       continue
  //     }

  //     // Accumulate the product of circularityIndex and mass
  //     circularityIndexTimesMassSumOverAllComponentLayers += layer.circularityIndex * mass
  //   }
  // }

  const mass = await calculateMassForProduct(componentRow.component_id)
  const volume = calculateVolumeForLayer(componentRow)
  const isExcluded = await getExcludedProductId(componentRow.component_id)
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
