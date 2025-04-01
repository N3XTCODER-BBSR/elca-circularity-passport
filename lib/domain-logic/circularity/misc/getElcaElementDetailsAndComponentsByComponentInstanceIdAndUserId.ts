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
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/circularity/misc/domain-types"
import { ElcaVariantElementBaseData } from "prisma/queries/legacyDb"
import { Prisma, TBs_OekobaudatMapping } from "../../../../prisma/generated/client"
import { calculateEolDataByEolCateogryData } from "../utils/calculateEolDataByEolCateogryData"
import { calculateVolumeForProduct } from "../utils/calculateVolumeForProduct"

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

    const volume = calculateVolumeForProduct({
      layerLength: component.layer_length,
      layerWidth: component.layer_width,
      layerSize: component.layer_size,
      share: component.layer_area_ratio,
      quantity: component.productQuantity,
      unit: component.productUnit,
    })

    return {
      ...component,
      isLayer: component.is_layer,
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
