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

import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/circularity/misc/domain-types"
import { DisturbingSubstanceClassId, Prisma, TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

/**
 * Deletes a disturbing substance selection by its ID
 *
 * @param disturbingSubstanceSelectionId The ID of the disturbing substance selection to delete
 * @returns Promise that resolves when the deletion is complete
 */
export async function deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId: number) {
  return dbDalInstance.deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)
}

/**
 * Updates or inserts disturbing EOL scenario for S4 category
 *
 * @param layerId The ID of the element component layer to update
 * @param specificScenario The EOL category scenario to use
 * @returns Promise with the updated user-enriched product data
 */
export async function upsertDisturbingEolScenarioForS4(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
) {
  return dbDalInstance.upsertDisturbingEolScenarioForS4(layerId, specificScenario)
}

/**
 * Initializes or updates a user-enriched product data record
 *
 * @param layerId The ID of the element component layer to update
 * @returns Promise with the created or updated user-enriched product data
 */
export async function upsertUserEnrichedProductData(layerId: number) {
  return dbDalInstance.upsertUserEnrichedProductData(layerId)
}

/**
 * Creates a new disturbing substance selection
 *
 * @param createData The data for the new selection
 * @returns Promise with the created disturbing substance selection
 */
export async function createDisturbingSubstanceSelection(createData: Prisma.DisturbingSubstanceSelectionCreateInput) {
  return dbDalInstance.createDisturbingSubstanceSelection(createData)
}

/**
 * Finds disturbing substances by layer ID and class ID
 *
 * @param layerId The ID of the element component layer
 * @param classId The class ID to filter by
 * @returns Promise with the list of matching disturbing substance selections
 */
export async function findDisturbingSubstancesByLayerIdAndClassId(
  layerId: number,
  classId: DisturbingSubstanceClassId
) {
  return dbDalInstance.findDisturbingSubstancesByLayerIdAndClassId(layerId, classId)
}

/**
 * Updates user-enriched product data to clear the disturbing EOL scenario
 *
 * @param layerId The ID of the element component layer to update
 * @returns Promise with the updated user-enriched product data
 */
export async function updateUserEnrichedProductDataDisturbingEolScenario(layerId: number) {
  return dbDalInstance.updateUserEnrichedProductDataDisturbingEolScenario(layerId)
}

/**
 * Deletes all disturbing substance selections for a layer
 *
 * @param layerId The ID of the element component layer
 * @returns Promise that resolves when the deletion is complete
 */
export async function deleteDisturbingSubstanceSelectionsByLayerId(layerId: number) {
  return dbDalInstance.deleteDisturbingSubstanceSelectionsByLayerId(layerId)
}

/**
 * Adds or updates a disturbing substance selection for a product
 *
 * This function encapsulates all the business logic for managing disturbing substances,
 * handling both creation and updating of substance selections, as well as
 * management of related user-enriched product data.
 *
 * @param productId The ID of the product (element component layer)
 * @param variantId The variant ID
 * @param projectId The project ID
 * @param disturbingSubstanceSelectionWithNullableId The disturbing substance data with optional ID
 * @returns Promise with the updated element component data
 */
export async function addOrUpdateDisturbingSubstance(
  productId: number,
  variantId: number,
  projectId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
) {
  // Initialize or update user-enriched product data
  await upsertUserEnrichedProductData(productId)

  // Handle updating an existing selection
  if (disturbingSubstanceSelectionWithNullableId.id != null) {
    const { disturbingSubstanceClassId, disturbingSubstanceName } = disturbingSubstanceSelectionWithNullableId

    const updateData: Prisma.DisturbingSubstanceSelectionUpdateInput = {
      disturbingSubstanceClassId,
      disturbingSubstanceName,
    }

    // Special handling for S0 class - clear the substance name
    if (disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
      updateData.disturbingSubstanceName = null
    }

    await dbDalInstance.updateDisturbingSubstanceSelection(disturbingSubstanceSelectionWithNullableId.id, updateData)
  }
  // Handle creating a new selection
  else {
    const createData: Prisma.DisturbingSubstanceSelectionCreateInput = {
      disturbingSubstanceClassId: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId || null,
      disturbingSubstanceName: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceName || null,
      userEnrichedProductData: {
        connect: {
          elcaElementComponentId: productId,
        },
      },
    }

    // Special handling for S0 class - clear the substance name
    if (disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
      createData.disturbingSubstanceName = null
    }

    await createDisturbingSubstanceSelection(createData)
  }

  // If there are no S4 disturbing substances, remove the disturbingEolScenarioForS4
  const disturbingSubstances = await findDisturbingSubstancesByLayerIdAndClassId(
    productId,
    DisturbingSubstanceClassId.S4
  )
  if (disturbingSubstances.length === 0) {
    await updateUserEnrichedProductDataDisturbingEolScenario(productId)
  }

  // Return the updated component data
  return fetchElcaComponentById(productId, variantId, projectId)
}
