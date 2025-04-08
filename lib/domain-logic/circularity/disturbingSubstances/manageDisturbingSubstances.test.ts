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

import { DisturbingSubstanceClassId } from "prisma/generated/client"
import { resetDb, seedDb } from "tests/utils"
import { addOrUpdateDisturbingSubstance } from "./manageDisturbingSubstances"

describe("addOrUpdateDisturbingSubstance", () => {
  const productId = 5
  const variantId = 1
  const projectId = 1

  beforeEach(async () => {
    await resetDb()
    await seedDb()
  })

  afterAll(async () => {
    await resetDb()
    await seedDb()
  })

  it("should create a new disturbing substance selection with class S1", async () => {
    const newDisturbingSubstanceSelection = {
      id: null,
      localId: "local-1",
      userEnrichedProductDataElcaElementComponentId: productId,
      disturbingSubstanceClassId: DisturbingSubstanceClassId.S1,
      disturbingSubstanceName: "",
    }

    let enrichedProductData = await addOrUpdateDisturbingSubstance(
      productId,
      variantId,
      projectId,
      newDisturbingSubstanceSelection
    )

    expect(enrichedProductData.disturbingSubstanceSelections).toMatchObject([
      {
        disturbingSubstanceClassId: "S1",
        disturbingSubstanceName: null,
      },
    ])
    expect(enrichedProductData.component_id).toEqual(productId)
    expect(enrichedProductData.disturbingEolScenarioForS4).toBeNull()

    const removeDisturbingSubstanceSelection = {
      id: 1,
      localId: "local-1",
      userEnrichedProductDataElcaElementComponentId: productId,
      disturbingSubstanceClassId: null,
      disturbingSubstanceName: "",
    }

    enrichedProductData = await addOrUpdateDisturbingSubstance(
      productId,
      variantId,
      projectId,
      removeDisturbingSubstanceSelection
    )

    expect(enrichedProductData.disturbingSubstanceSelections).toMatchObject([
      {
        disturbingSubstanceClassId: null,
        disturbingSubstanceName: "",
      },
    ])
    expect(enrichedProductData.component_id).toEqual(productId)
    expect(enrichedProductData.disturbingEolScenarioForS4).toBeNull()
  })
})
