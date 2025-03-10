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
import { NotFoundError, UnauthorizedError } from "lib/errors"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"

/**
 * Validates if a variant belongs to a specific project.
 *
 * @param {number} variantId - The ID of the variant to validate.
 * @param {number} projectId - The ID of the project to validate against.
 * @throws {NotFoundError} If the variant is not found.
 * @throws {UnauthorizedError} If the variant does not belong to the project.
 */
export const ensureVariantAccessible = async (variantId: number, projectId: number) => {
  const variant = await legacyDbDalInstance.getVariantById(variantId)
  if (!variant) {
    throw new NotFoundError()
  }
  if (variant.project_id !== projectId) {
    throw new UnauthorizedError()
  }
}
