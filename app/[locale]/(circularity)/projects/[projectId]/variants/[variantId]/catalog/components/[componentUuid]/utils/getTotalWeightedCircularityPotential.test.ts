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
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { getTotalWeightedCircularityPotential } from "./getTotalWeightedCircularityPotential"
import { layers } from "./testFixtures"

describe("getTotalWeightedCircularityPotential", () => {
  test("returns weighted average for valid layers", () => {
    const result = getTotalWeightedCircularityPotential(layers)

    expect(result).toBeCloseTo(-10.24, 2)
  })

  test("returns data for layer 1 when layer 2 is excluded from calculation", () => {
    const result = getTotalWeightedCircularityPotential([
      { ...layers[0] } as EnrichedElcaElementComponent,
      { ...layers[1], isExcluded: true } as EnrichedElcaElementComponent,
    ])

    expect(result).toBe(-60)
  })

  test("returns data for layer 1 when layer 2 is excluded and doesn't have a volume", () => {
    const result = getTotalWeightedCircularityPotential([
      { ...layers[0] } as EnrichedElcaElementComponent,
      { ...layers[1], isExcluded: true, volume: null } as EnrichedElcaElementComponent,
    ])

    expect(result).toBe(-60)
  })

  test("returns null when at least one layer does not have a volume", () => {
    const result = getTotalWeightedCircularityPotential([
      { ...layers[0], volume: null } as EnrichedElcaElementComponent,
      { ...layers[1] } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })

  test("returns null for empty layers", () => {
    const result = getTotalWeightedCircularityPotential([])

    expect(result).toBeNull()
  })

  test("returns null for layers with no volume", () => {
    const result = getTotalWeightedCircularityPotential([
      { ...layers[0], volume: null } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })

  test("returns null for layers with no circularity potential", () => {
    const result = getTotalWeightedCircularityPotential([
      {
        ...layers[0],
        tBaustoffProductData: { ...layers[0]?.tBaustoffProductData, eolData: {} },
      } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })
})
