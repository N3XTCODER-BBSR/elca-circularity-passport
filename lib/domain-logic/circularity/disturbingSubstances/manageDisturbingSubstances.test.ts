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
import { resetDb } from "tests/utils"
import { addOrUpdateDisturbingSubstance } from "./manageDisturbingSubstances"

describe("addOrUpdateDisturbingSubstance", () => {
  const productId = 5
  const variantId = 1
  const projectId = 1

  beforeAll(async () => {
    await resetDb()
  })
  afterAll(async () => {
    await resetDb()
  })

  it("should create a new disturbing substance selection with class S1", async () => {
    const newDisturbingSubstanceSelection = {
      id: null,
      localId: "local-1",
      userEnrichedProductDataElcaElementComponentId: 5,
      disturbingSubstanceClassId: DisturbingSubstanceClassId.S1,
      disturbingSubstanceName: "",
    }

    const result = await addOrUpdateDisturbingSubstance(
      productId,
      variantId,
      projectId,
      newDisturbingSubstanceSelection
    )

    expect(result.disturbingSubstanceSelections).toEqual([
      {
        id: 1,
        userEnrichedProductDataElcaElementComponentId: 5,
        disturbingSubstanceClassId: "S1",
        disturbingSubstanceName: null,
      },
    ])
    expect(result.component_id).toEqual(5)
    expect(result.disturbingEolScenarioForS4).toBeNull()
  })
  it("should update an existing disturbing substance selection to remove class and name", async () => {
    const newDisturbingSubstanceSelection = {
      id: 1,
      localId: "local-1",
      userEnrichedProductDataElcaElementComponentId: 5,
      disturbingSubstanceClassId: null,
      disturbingSubstanceName: "",
    }

    const result = await addOrUpdateDisturbingSubstance(
      productId,
      variantId,
      projectId,
      newDisturbingSubstanceSelection
    )

    expect(result.disturbingSubstanceSelections).toEqual([
      {
        id: 1,
        userEnrichedProductDataElcaElementComponentId: 5,
        disturbingSubstanceClassId: null,
        disturbingSubstanceName: "",
      },
    ])
    expect(result.component_id).toEqual(5)
    expect(result.disturbingEolScenarioForS4).toBeNull()
  })
})
