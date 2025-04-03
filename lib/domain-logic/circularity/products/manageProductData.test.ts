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

import { DismantlingPotentialClassId, DisturbingSubstanceClassId } from "prisma/generated/client"
import { resetDb, seedDb } from "tests/utils"
import { getProductCircularityData, updateProductTBaustoffAndRemoveDisturbingSubstances } from "./manageProductData"
import { upsertUserEnrichedProductDataByLayerId } from "../dismantling/updateDismantlingData"
import { addOrUpdateDisturbingSubstance } from "../disturbingSubstances/manageDisturbingSubstances"

describe("manageProductData", () => {
  it("should return the circularity data for a product that has no enriched product data", async () => {
    const result = await getProductCircularityData(5, 1, 1)

    expect(result).toMatchObject({
      component_id: 5,
      process_name: "Beton der Druckfestigkeitsklasse C 30/37",
      oekobaudat_process_uuid: "b6096c9c-1248-4ce1-9c2d-f4a48aade80f",
      productUnit: "m3",
      productQuantity: 1,
      isExcluded: false,
      isLayer: true,
      mass: 720,
      volume: 0.3,
      circularityIndex: null,
    })
  })
  describe("getProductCircularityData with circularity index", () => {
    beforeAll(async () => {
      await seedDb()

      await updateProductTBaustoffAndRemoveDisturbingSubstances(5, 3)
      await upsertUserEnrichedProductDataByLayerId(5, DismantlingPotentialClassId.II)
      await addOrUpdateDisturbingSubstance(5, 1, 1, {
        id: null,
        userEnrichedProductDataElcaElementComponentId: 5,
        disturbingSubstanceClassId: DisturbingSubstanceClassId.S2,
        disturbingSubstanceName: "",
      })
    })

    afterAll(async () => {
      await resetDb()
    })
    it("should return the circularity data for a product when there is enriched product data", async () => {
      const result = await getProductCircularityData(5, 1, 1)

      expect(result).toMatchObject({
        component_id: 5,
        process_name: "Beton der Druckfestigkeitsklasse C 30/37",
        oekobaudat_process_uuid: "b6096c9c-1248-4ce1-9c2d-f4a48aade80f",
        productUnit: "m3",
        productQuantity: 1,
        isExcluded: false,
        isLayer: true,
        mass: 720,
        volume: 0.3,
        circularityIndex: 85.5,
        dismantlingPotentialClassId: "II",
        tBaustoffProductData: {
          name: "Aluminiumblech",
          tBaustoffProductId: 3,
        },
        tBaustoffProductSelectedByUser: true,
        disturbingSubstanceSelections: [
          {
            disturbingSubstanceClassId: "S2",
          },
        ],
        dismantlingPoints: 75,
        disturbingSubstances: {
          noDisturbingSubstancesOrOnlyNullClassesSelected: false,
          hasS4DisturbingSubstance: false,
        },
        eolUnbuilt: { specificOrTotal: "Total", points: 95, className: "C" },
        eolBuilt: { points: 90, className: "C" },
      })
    })
  })
})
