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
import { calculateBnbDismantlingPoints, calculateBnbCircularityPoints } from "./calculateBnbPoints"

describe("calculateBnbDismantlingPoints", () => {
  it("returns 30 for RGeb >= 50", () => {
    expect(calculateBnbDismantlingPoints(50)).toBe(30)
    expect(calculateBnbDismantlingPoints(60)).toBe(30)
  })
  it("returns 0 for RGeb <= 20", () => {
    expect(calculateBnbDismantlingPoints(20)).toBe(0)
    expect(calculateBnbDismantlingPoints(10)).toBe(0)
  })
  it("interpolates and rounds for 20 < RGeb < 50", () => {
    expect(calculateBnbDismantlingPoints(35)).toBe(15)
    expect(calculateBnbDismantlingPoints(34)).toBe(14)
    expect(calculateBnbDismantlingPoints(21)).toBe(1)
    expect(calculateBnbDismantlingPoints(49)).toBe(29)
  })
})

describe("calculateBnbCircularityPoints", () => {
  it("returns 60 for ZGeb >= 60", () => {
    expect(calculateBnbCircularityPoints(60)).toBe(60)
    expect(calculateBnbCircularityPoints(70)).toBe(60)
  })
  it("returns 0 for ZGeb <= 20", () => {
    expect(calculateBnbCircularityPoints(20)).toBe(0)
    expect(calculateBnbCircularityPoints(10)).toBe(0)
  })
  it("interpolates and rounds for 20 < ZGeb < 60", () => {
    expect(calculateBnbCircularityPoints(40)).toBe(30)
    expect(calculateBnbCircularityPoints(21)).toBe(2)
    expect(calculateBnbCircularityPoints(59)).toBe(59)
  })
})
