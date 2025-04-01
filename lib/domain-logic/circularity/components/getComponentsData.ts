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

import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"

/**
 * Type representing the base data for an ELCA variant element
 */
export type ElementBaseData = Awaited<ReturnType<typeof legacyDbDalInstance.getElcaVariantElementBaseDataByUuid>>

/**
 * Type representing the components of an ELCA variant
 */
export type VariantComponents = Awaited<ReturnType<typeof legacyDbDalInstance.getElcaVariantComponentsByInstanceId>>

/**
 * Retrieves base data for an ELCA variant element by its UUID.
 *
 * @param uuid The UUID of the ELCA variant element
 * @param variantId The ID of the variant
 * @param projectId The ID of the project
 * @returns Base data for the specified element
 */
export async function getElcaVariantElementBaseDataByUuid(
  uuid: string,
  variantId: number,
  projectId: number
): Promise<ElementBaseData> {
  return legacyDbDalInstance.getElcaVariantElementBaseDataByUuid(uuid, variantId, projectId)
}

/**
 * Retrieves components for an ELCA variant by its instance ID.
 *
 * @param instanceId The instance UUID of the component
 * @param variantId The ID of the variant
 * @param projectId The ID of the project
 * @returns Components associated with the variant
 */
export async function getElcaVariantComponentsByInstanceId(
  instanceId: string,
  variantId: number,
  projectId: number
): Promise<VariantComponents> {
  return legacyDbDalInstance.getElcaVariantComponentsByInstanceId(instanceId, variantId, projectId)
}

/**
 * Retrieves all available construction products.
 *
 * @returns A list of all available construction products with their IDs and names
 */
export async function getAvailableTBaustoffProducts() {
  return dbDalInstance.getAvailableTBaustoffProducts()
}
