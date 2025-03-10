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
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { DisturbingSubstanceClassId, Prisma } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function addOrUpdateDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  productId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
) {
  return withServerActionErrorHandling(async () => {
    z.number().parse(variantId)
    z.number().parse(productId)
    z.object({}).passthrough().parse(disturbingSubstanceSelectionWithNullableId)
    z.number().parse(projectId)

    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.upsertUserEnrichedProductData(productId)

    if (disturbingSubstanceSelectionWithNullableId.id != null) {
      const { disturbingSubstanceClassId, disturbingSubstanceName } = disturbingSubstanceSelectionWithNullableId

      const updateData: Prisma.DisturbingSubstanceSelectionUpdateInput = {
        disturbingSubstanceClassId,
        disturbingSubstanceName,
      }

      if (disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        updateData.disturbingSubstanceName = null
      }

      await dbDalInstance.updateDisturbingSubstanceSelection(disturbingSubstanceSelectionWithNullableId.id, updateData)
    } else {
      const createData: Prisma.DisturbingSubstanceSelectionCreateInput = {
        disturbingSubstanceClassId: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId || null,
        disturbingSubstanceName: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceName || null,
        userEnrichedProductData: {
          connect: {
            elcaElementComponentId: productId,
          },
        },
      }

      if (disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        createData.disturbingSubstanceName = null
      }

      await dbDalInstance.createDisturbingSubstanceSelection(createData)
    }

    // If there are no S4 disturbing substances, remove the disturbingEolScenarioForS4
    const disturbingSubstances = await dbDalInstance.findDisturbingSubstancesByLayerIdAndClassId(
      productId,
      DisturbingSubstanceClassId.S4
    )
    if (disturbingSubstances.length === 0) {
      await dbDalInstance.updateUserEnrichedProductDataDisturbingEolScenario(productId)
    }

    const elcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
    return elcaElementComponentData
  })
}
