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
import { dbDalInstance } from "prisma/queries/dalSingletons"

export const dynamic = "force-dynamic" // defaults to auto
export const runtime = "nodejs" // defaults to edge

export async function GET(request: NextRequest, { params }: { params: { releaseUuid: string } }) {
  console.log("GET /releases/:releaseUuid/products", params)
  const { releaseUuid } = params
  if (!releaseUuid) {
    return NextResponse.json(
      { error: { code: "MISSING_RELEASE_UUID", message: "releaseUuid is required" } },
      { status: 400 }
    )
  }
  const products = await dbDalInstance.getAllProdcutsInRelease(releaseUuid)

  return NextResponse.json({ data: products })
}
