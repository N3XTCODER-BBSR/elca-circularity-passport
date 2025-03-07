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
import { EolClasses, getEolClassNameByPoints } from "./circularityMappings"

describe("getEolClassNameByPoints", () => {
  it("should return NA for null or undefined points", () => {
    expect(getEolClassNameByPoints(null)).toBe(EolClasses.NA)
    expect(getEolClassNameByPoints(undefined)).toBe(EolClasses.NA)
  })

  it("should return NA for NaN", () => {
    expect(getEolClassNameByPoints(NaN)).toBe(EolClasses.NA)
  })

  it("should return A for points >= 140", () => {
    expect(getEolClassNameByPoints(140)).toBe(EolClasses.A)
    expect(getEolClassNameByPoints(150)).toBe(EolClasses.A)
  })

  it("should return B for points >= 100 and < 140", () => {
    expect(getEolClassNameByPoints(100)).toBe(EolClasses.B)
    expect(getEolClassNameByPoints(139)).toBe(EolClasses.B)
  })

  it("should return C for points >= 80 and < 100", () => {
    expect(getEolClassNameByPoints(80)).toBe(EolClasses.C)
    expect(getEolClassNameByPoints(99)).toBe(EolClasses.C)
  })

  it("should return CD for points >= 70 and < 80", () => {
    expect(getEolClassNameByPoints(70)).toBe(EolClasses.CD)
    expect(getEolClassNameByPoints(79)).toBe(EolClasses.CD)
  })

  it("should return D for points >= 60 and < 70", () => {
    expect(getEolClassNameByPoints(60)).toBe(EolClasses.D)
    expect(getEolClassNameByPoints(69)).toBe(EolClasses.D)
  })

  it("should return DE for points >= 40 and < 60", () => {
    expect(getEolClassNameByPoints(40)).toBe(EolClasses.DE)
    expect(getEolClassNameByPoints(59)).toBe(EolClasses.DE)
  })

  it("should return E for points >= 20 and < 40", () => {
    expect(getEolClassNameByPoints(20)).toBe(EolClasses.E)
    expect(getEolClassNameByPoints(39)).toBe(EolClasses.E)
  })

  it("should return EF for points >= 0 and < 20", () => {
    expect(getEolClassNameByPoints(0)).toBe(EolClasses.EF)
    expect(getEolClassNameByPoints(19)).toBe(EolClasses.EF)
  })

  it("should return F for points >= -20 and < 0", () => {
    expect(getEolClassNameByPoints(-20)).toBe(EolClasses.F)
    expect(getEolClassNameByPoints(-1)).toBe(EolClasses.F)
  })

  it("should return FG for points >= -40 and < -20", () => {
    expect(getEolClassNameByPoints(-40)).toBe(EolClasses.FG)
    expect(getEolClassNameByPoints(-21)).toBe(EolClasses.FG)
  })

  it("should return G for points >= -60 and < -40", () => {
    expect(getEolClassNameByPoints(-60)).toBe(EolClasses.G)
    expect(getEolClassNameByPoints(-41)).toBe(EolClasses.G)
  })

  it("should return H for points >= -80 and < -60", () => {
    expect(getEolClassNameByPoints(-80)).toBe(EolClasses.H)
    expect(getEolClassNameByPoints(-61)).toBe(EolClasses.H)
  })

  it("should return I for points >= -100 and < -80", () => {
    expect(getEolClassNameByPoints(-100)).toBe(EolClasses.I)
    expect(getEolClassNameByPoints(-81)).toBe(EolClasses.I)
  })

  it("should return J for points >= -140 and < -100", () => {
    expect(getEolClassNameByPoints(-140)).toBe(EolClasses.J)
    expect(getEolClassNameByPoints(-101)).toBe(EolClasses.J)
  })

  it("should return J for points less than -140", () => {
    expect(getEolClassNameByPoints(-150)).toBe(EolClasses.J)
  })
})
