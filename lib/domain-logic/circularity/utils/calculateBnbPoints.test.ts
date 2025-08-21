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
  it("returns 25 for RGeb >= 45", () => {
    expect(calculateBnbDismantlingPoints(45)).toBe(25)
    expect(calculateBnbDismantlingPoints(60)).toBe(25)
  })
  it("returns 0 for RGeb <= 7.5", () => {
    expect(calculateBnbDismantlingPoints(7.5)).toBe(0)
    expect(calculateBnbDismantlingPoints(5)).toBe(0)
  })
  it("interpolates and rounds for 7.5 < RGeb < 45", () => {
    expect(calculateBnbDismantlingPoints(26.25)).toBe(13)
    expect(calculateBnbDismantlingPoints(26)).toBe(12)
    expect(calculateBnbDismantlingPoints(8)).toBe(0)
    expect(calculateBnbDismantlingPoints(44)).toBe(24)
  })
})

describe("calculateBnbCircularityPoints", () => {
  it("returns 50 for ZGeb >= 60", () => {
    expect(calculateBnbCircularityPoints(60)).toBe(50)
    expect(calculateBnbCircularityPoints(70)).toBe(50)
  })
  it("returns 0 for ZGeb <= 20", () => {
    expect(calculateBnbCircularityPoints(20)).toBe(0)
    expect(calculateBnbCircularityPoints(10)).toBe(0)
  })
  it("interpolates and rounds for 20 < ZGeb < 60", () => {
    expect(calculateBnbCircularityPoints(40)).toBe(25)
    expect(calculateBnbCircularityPoints(21)).toBe(1)
    expect(calculateBnbCircularityPoints(59)).toBe(49)
  })
})
