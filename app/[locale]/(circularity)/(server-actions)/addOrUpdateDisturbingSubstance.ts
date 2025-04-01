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
"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import { addOrUpdateDisturbingSubstance } from "lib/domain-logic/circularity/disturbingSubstances/manageDisturbingSubstances"
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/circularity/misc/domain-types"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/auth/ensureAuthorized"

/**
 * Server action for adding or updating a disturbing substance selection
 *
 * Handles validation, authorization, and delegates business logic to the domain layer
 */
export async function addOrUpdateDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  productId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
) {
  return withServerActionErrorHandling(async () => {
    // Input validation
    z.number().parse(variantId)
    z.number().parse(productId)
    z.object({}).passthrough().parse(disturbingSubstanceSelectionWithNullableId)
    z.number().parse(projectId)

    // Authentication and authorization
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)
    await ensureUserAuthorizationToElementComponent(userId, productId)

    // Delegate to domain logic
    return addOrUpdateDisturbingSubstance(productId, variantId, projectId, disturbingSubstanceSelectionWithNullableId)
  })
}
