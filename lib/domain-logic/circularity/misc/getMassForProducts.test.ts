import { getMassForProduct, getMassForProducts } from "./getMassForProducts"
import { MassInKg, ProductId } from "./types"

describe("calculateMassForProducts", () => {
  describe("layers", () => {
    const productIdsExpectedMassMap = new Map<ProductId, MassInKg>([
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

    const productIds = Array.from(productIdsExpectedMassMap.entries()).map(([productId]) => productId)
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
        const expectedMass = productIdsExpectedMassMap.get(productId)!

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
