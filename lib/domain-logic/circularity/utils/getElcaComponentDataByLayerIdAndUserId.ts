/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
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

  const volume = calculateVolumeForProduct({
    layerLength: componentRow.layer_length,
    layerWidth: componentRow.layer_width,
    layerSize: componentRow.layer_size,
    share: componentRow.layer_area_ratio,
    quantity: componentRow.productQuantity,
    unit: componentRow.productUnit,
  })

  const isExcluded = await dbDalInstance.getExcludedProductId(componentRow.component_id)
  const enrichedComponent: EnrichedElcaElementComponent = {
    ...componentRow,
    mass,
    isExcluded: !!isExcluded,
    isLayer: componentRow.is_layer,
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
