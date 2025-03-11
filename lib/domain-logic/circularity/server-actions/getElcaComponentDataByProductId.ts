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
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import calculateCircularityDataForLayer from "../utils/calculate-circularity-data-for-layer"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

const getElcaComponentDataByProductId = async (variantId: number, projectId: number, productId: number) => {
  return withServerActionErrorHandling(async () => {
    z.number().parse(variantId)
    z.number().parse(productId)
    z.number().parse(projectId)

    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)
    await ensureUserAuthorizationToProject(userId, projectId)

    const newElcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
    const isExcluded = await dbDalInstance.getExcludedProductId(newElcaElementComponentData.component_id)
    newElcaElementComponentData.isExcluded = !!isExcluded

    return calculateCircularityDataForLayer(newElcaElementComponentData)
  })
}

export default getElcaComponentDataByProductId
