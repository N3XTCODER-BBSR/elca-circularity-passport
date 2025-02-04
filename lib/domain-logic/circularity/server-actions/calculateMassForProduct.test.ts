import { calculateMassForProduct } from "./calculateMassForProduct"
import { UnsupportedUnitError } from "./utils/calculateMassForNonLayerProduct"

describe("calculateMassForProduct", () => {
  describe("layers", () => {
    it.each([
      { productId: 1, expectedMassInKg: 1.7 },
      { productId: 2, expectedMassInKg: 84 },
      { productId: 3, expectedMassInKg: 1.7 },
      { productId: 4, expectedMassInKg: 84 },
      { productId: 5, expectedMassInKg: 720 },
      { productId: 6, expectedMassInKg: 253 },
      { productId: 8, expectedMassInKg: 1.7 },
      { productId: 9, expectedMassInKg: 84 },
      { productId: 10, expectedMassInKg: 720 },
      { productId: 11, expectedMassInKg: 253 },
      { productId: 13, expectedMassInKg: 1.5 },
      { productId: 14, expectedMassInKg: 50.843 },
    ])(
      "should return the correct weight for layer $productId with kg as ref_unit of the component",
      async ({ productId, expectedMassInKg }) => {
        const mass = await calculateMassForProduct(productId)

        expect(mass).toBeCloseTo(expectedMassInKg, 3)
      }
    )
    it("should return the correct weight for layer with m as ref_unit of the component", async () => {
      const productId = 23
      const mass = await calculateMassForProduct(productId)

      expect(mass).toBe(1027.2)
    })
    it("should return the correct weight for layer with m2 as ref_unit of the component", async () => {
      const productId = 22
      const mass = await calculateMassForProduct(productId)

      expect(mass).toBe(5.39)
    })
    it("should return the correct weight for layer with piece as ref_unit of the component", async () => {
      const productId = 24
      const mass = await calculateMassForProduct(productId)

      expect(mass).toBe(87.84)
    })
  })
  describe("non-layer products", () => {
    it('should throw an error if the unit is "piece"', async () => {
      // 14 pieces
      const productWithPieceUnitId = 21
      await expect(calculateMassForProduct(productWithPieceUnitId)).rejects.toThrow(UnsupportedUnitError)
    })
    it('should return the correct mass for an element component with unit "m"', async () => {
      // 13 meters
      const productWithMUnitId = 20
      const mass = await calculateMassForProduct(productWithMUnitId)

      expect(mass).toBe(27.43)
    })
    it('should return the correct mass for an element component with unit "m2"', async () => {
      // 11 square meters
      const productWithM2UnitId = 18
      const mass = await calculateMassForProduct(productWithM2UnitId)

      expect(mass).toBe(393.8)
    })
    it('should return the correct mass for an element component with unit "m3"', async () => {
      // 10 cubic meters
      const productWithM3UnitId = 17
      const mass = await calculateMassForProduct(productWithM3UnitId)

      expect(mass).toBe(20000)
    })
    it('should return the correct mass for an element component with unit "kg"', async () => {
      // 12 kg
      const productWithKgUnitId = 19
      const mass = await calculateMassForProduct(productWithKgUnitId)

      expect(mass).toBe(12)
    })
  })
})
