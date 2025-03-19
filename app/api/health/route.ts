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
import { NextResponse } from "next/server"
import { getRequestId } from "app/(utils)/getRequestId"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"

export async function GET() {
  const healthResponse = {
    server: "ok",
    databases: {
      legacyDb: "ok",
      newDb: "ok",
    },
  }

  try {
    await legacyDbDalInstance.healthCheck()
  } catch (error) {
    console.error(`Error in /api/health route handler  (requestId: ${getRequestId()})`, error)
    healthResponse.databases.legacyDb = "error"
  }

  try {
    await dbDalInstance.healthCheck()
  } catch (error) {
    console.error(`Error in /api/health route handler  (requestId: ${getRequestId()})`, error)
    healthResponse.databases.newDb = "error"
  }

  const status = healthResponse.databases.legacyDb === "ok" && healthResponse.databases.newDb === "ok" ? 200 : 500

  return NextResponse.json(healthResponse, { status })
}
