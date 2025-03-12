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
import { dismantlingPotentialClassIdMapping } from "lib/domain-logic/circularity/utils/circularityMappings"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { DismantlingPotentialClassId } from "prisma/generated/client"
import { getTotalWeightedDismantlingPotential } from "./getTotalWeightedDismantlingPotential"
import { layers } from "./testFixtures"

describe("getTotalWeightedDismantlingPotential", () => {
  test("returns weighted average for valid layers", () => {
    const result = getTotalWeightedDismantlingPotential(layers)

    expect(result).toBe(100)
  })

  test("returns data for layer 1 when layer 2 is excluded from calculation", () => {
    const dismantlingPotentialClassIdLayer1 = DismantlingPotentialClassId.II

    const result = getTotalWeightedDismantlingPotential([
      { ...layers[0], dismantlingPotentialClassId: dismantlingPotentialClassIdLayer1 } as EnrichedElcaElementComponent,
      { ...layers[1], isExcluded: true } as EnrichedElcaElementComponent,
    ])

    expect(result).toBe(dismantlingPotentialClassIdMapping[dismantlingPotentialClassIdLayer1].points)
  })

  test("returns null for empty layers", () => {
    const result = getTotalWeightedDismantlingPotential([])

    expect(result).toBeNull()
  })

  test("returns null for layers with no volume", () => {
    const result = getTotalWeightedDismantlingPotential([
      { ...layers[0], volume: null } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })

  test("returns null for layers when dismantlingPotentialClassId is null", () => {
    const result = getTotalWeightedDismantlingPotential([
      {
        ...layers[0],
        dismantlingPotentialClassId: null,
      } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })
})
