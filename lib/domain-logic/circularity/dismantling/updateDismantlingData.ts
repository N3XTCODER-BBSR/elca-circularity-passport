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

import { DismantlingPotentialClassId } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"

/**
 * Updates or inserts user-enriched product data with dismantling potential class ID for a product
 *
 * @param layerId The ID of the element component layer to update
 * @param dismantlingPotentialClassId The new dismantling potential class ID value
 * @returns Promise with the updated user-enriched product data
 */
export async function upsertUserEnrichedProductDataByLayerId(
  layerId: number,
  dismantlingPotentialClassId: DismantlingPotentialClassId | null
) {
  // Return the result directly instead of trying to type it as void
  return dbDalInstance.upsertUserEnrichedProductDataByLayerId(layerId, dismantlingPotentialClassId)
}
