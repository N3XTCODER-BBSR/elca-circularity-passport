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
import { getMassForProduct, getMassForProducts } from "./getMassForProducts"
import { MassInKg, ProductId } from "./types"

describe("calculateMassForProducts", () => {
  describe("layers", () => {
    const productIdExpectedMassMap = new Map<ProductId, MassInKg>([
      [1, 1.7],
      [2, 84],
      [3, 1.7],
      [4, 84],
      [5, 720],
      [6, 253],
      [8, 1.7],
      [9, 84],
      [10, 720],
      [11, 253],
      [13, 1.5],
      [14, 50.843],
    ])

    const productIds = Array.from(productIdExpectedMassMap.entries()).map(([productId]) => productId)
    let productIdMassMap: Map<ProductId, MassInKg | null>

    beforeAll(async () => {
      // calculate the mass for all products at once
      productIdMassMap = await getMassForProducts(productIds)
    })

    it.each(
      productIds.map((productId) => ({
        productId,
      }))
    )(
      "should return the correct weight for layer $productId with kg as ref_unit of the component",
      async ({ productId }) => {
        const mass = productIdMassMap.get(productId)
        const expectedMass = productIdExpectedMassMap.get(productId)!

        expect(mass).toBeCloseTo(expectedMass, 3)
      }
    )
    it("should return the correct weight for layer with m as ref_unit of the component", async () => {
      const productId = 23
      const result = await getMassForProduct(productId)

      expect(result).toBe(1027.2)
    })
    it("should return the correct weight for layer with m2 as ref_unit of the component", async () => {
      const productId = 22
      const result = await getMassForProduct(productId)

      expect(result).toBe(5.39)
    })
    it("should return the correct weight for layer with piece as ref_unit of the component", async () => {
      const productId = 24
      const result = await getMassForProduct(productId)

      expect(result).toBe(87.84)
    })
  })
  describe("non-layer products", () => {
    it('should throw an error if the unit is "piece"', async () => {
      // 14 pieces
      const productWithPieceUnitId = 21

      const result = await getMassForProduct(productWithPieceUnitId)

      expect(result).toBeNull()
    })
    it('should return the correct mass for an element component with unit "m"', async () => {
      // 13 meters
      const productWithMUnitId = 20
      const result = await getMassForProduct(productWithMUnitId)

      expect(result).toBe(27.43)
    })
    it('should return the correct mass for an element component with unit "m2"', async () => {
      // 11 square meters
      const productWithM2UnitId = 18
      const result = await getMassForProduct(productWithM2UnitId)

      expect(result).toBe(393.8)
    })
    it('should return the correct mass for an element component with unit "m3"', async () => {
      // 10 cubic meters
      const productWithM3UnitId = 17
      const result = await getMassForProduct(productWithM3UnitId)

      expect(result).toBe(20000)
    })
    it('should return the correct mass for an element component with unit "kg"', async () => {
      // 12 kg
      const productWithKgUnitId = 19
      const result = await getMassForProduct(productWithKgUnitId)

      expect(result).toBe(12)
    })
  })
})
