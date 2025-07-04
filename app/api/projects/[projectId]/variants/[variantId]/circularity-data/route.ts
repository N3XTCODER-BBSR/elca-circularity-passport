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

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ensureVariantAccessible } from "app/[locale]/(circularity)/(utils)/ensureAccessible"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/auth/ensureAuthorized"
import { getProjectCircularityData } from "lib/domain-logic/circularity/misc/getProjectCircularityData"

export async function GET(_: NextRequest, { params }: { params: Promise<{ projectId: string; variantId: string }> }) {
  const { projectId, variantId } = await params
  const variantIdNumber = Number(variantId)
  const projectIdNumber = Number(projectId)

  // validation
  try {
    z.number().parse(variantIdNumber)
    z.number().parse(projectIdNumber)
  } catch (error) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
  }

  // authorization
  const session = await ensureUserIsAuthenticated()
  await ensureUserAuthorizationToProject(Number(session.user.id), projectIdNumber)
  await ensureVariantAccessible(variantIdNumber, projectIdNumber)

  const circularityData = await getProjectCircularityData(variantIdNumber, projectIdNumber)

  return NextResponse.json(circularityData)
}
