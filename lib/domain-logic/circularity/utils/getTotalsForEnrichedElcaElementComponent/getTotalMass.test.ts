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
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { getTotalMass } from "./getTotalMass"
import { layers } from "./testFixtures"

describe("getTotalMass", () => {
  test("returns total volume for valid layers", () => {
    const result = getTotalMass(layers)

    expect(result).toBeCloseTo(1604.25, 2)
  })

  test("returns data for layer 1 when layer 2 is excluded from calculation", () => {
    const result = getTotalMass([
      { ...layers[0] } as EnrichedElcaElementComponent,
      { ...layers[1], isExcluded: true } as EnrichedElcaElementComponent,
    ])

    expect(result).toBe(layers[0]!.mass)
  })

  test("returns null for empty layers", () => {
    const result = getTotalMass([])

    expect(result).toBeNull()
  })

  test("ignores layer when its mass value is null", () => {
    const result = getTotalMass([
      { ...layers[0], mass: null } as EnrichedElcaElementComponent,
      { ...layers[1] } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeCloseTo(layers[1]!.mass!, 2)
  })
})
