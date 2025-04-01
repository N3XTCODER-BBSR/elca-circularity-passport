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

import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { getExcludedProductId } from "./manageProductExclusion"
import { deleteDisturbingSubstanceSelectionsByLayerId } from "../disturbingSubstances/manageDisturbingSubstances"
import calculateCircularityDataForLayer from "../utils/calculate-circularity-data-for-layer"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

/**
 * Updates or inserts user-enriched product data with TBaustoff product reference
 *
 * @param layerId The ID of the element component layer to update
 * @param selectedTBaustoffProductId The TBaustoff product ID to associate with the layer
 * @returns Promise with the updated user-enriched product data
 */
export async function upsertUserEnrichedProductDataWithTBaustoffProduct(
  layerId: number,
  selectedTBaustoffProductId: number
) {
  return dbDalInstance.upsertUserEnrichedProductDataWithTBaustoffProduct(layerId, selectedTBaustoffProductId)
}

/**
 * Updates or inserts user-enriched product data with EOL scenario
 *
 * @param layerId The ID of the element component layer to update
 * @param specificScenario The EOL category scenario to use
 * @param specificEolUnbuiltTotalScenarioProofText The proof text for the scenario
 * @returns Promise with the updated user-enriched product data
 */
export async function upsertUserEnrichedProductDataWithEolScenario(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
  specificEolUnbuiltTotalScenarioProofText: string
) {
  return dbDalInstance.upsertUserEnrichedProductDataWithEolScenario(
    layerId,
    specificScenario,
    specificEolUnbuiltTotalScenarioProofText
  )
}

/**
 * Retrieves component data for a product and calculates its circularity data
 *
 * @param productId The ID of the product
 * @param variantId The ID of the variant
 * @param projectId The ID of the project
 * @returns Promise with the component data including circularity calculations
 */
export async function getProductCircularityData(productId: number, variantId: number, projectId: number) {
  const componentData = await fetchElcaComponentById(productId, variantId, projectId)
  const isExcluded = await getExcludedProductId(componentData.component_id)
  componentData.isExcluded = !!isExcluded

  return calculateCircularityDataForLayer(componentData)
}

/**
 * Updates a product's TBaustoff reference and removes any associated disturbing substance selections
 *
 * @param productId The ID of the product to update
 * @param selectedId The ID of the selected TBaustoff product
 * @returns Promise that resolves when the operations are complete
 */
export async function updateProductTBaustoffAndRemoveDisturbingSubstances(productId: number, selectedId: number) {
  // Update the TBaustoff product reference
  await upsertUserEnrichedProductDataWithTBaustoffProduct(productId, selectedId)

  // Remove any associated disturbing substance selections
  await deleteDisturbingSubstanceSelectionsByLayerId(productId)
}
