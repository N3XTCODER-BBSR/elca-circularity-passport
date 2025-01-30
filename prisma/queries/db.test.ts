import { dbDalInstance } from "./dalSingletons"

describe("db queries", () => {
  describe("excluded product queries", () => {
    beforeEach(async () => {
      await dbDalInstance.truncateExcludedProductTable()
    })

    it("should toggle the excluded product and retrieve it correctly", async () => {
      const excludedProductId = 1
      await dbDalInstance.toggleExcludedProduct(excludedProductId)

      const result = await dbDalInstance.getExcludedProductId(excludedProductId)
      const want = { productId: excludedProductId }

      expect(result).toMatchObject(want)
    })
    it("should toggle the excluded product twice and retrieve it correctly", async () => {
      const excludedProductId = 1
      await dbDalInstance.toggleExcludedProduct(excludedProductId)
      await dbDalInstance.toggleExcludedProduct(excludedProductId)

      const result = await dbDalInstance.getExcludedProductId(excludedProductId)

      expect(result).toBeNull()
    })
    it("should toggle several excluded products and retrieve them correctly", async () => {
      const excludedProductIds = [1, 2, 3]
      for (const excludedProductId of excludedProductIds) {
        await dbDalInstance.toggleExcludedProduct(excludedProductId)
      }

      const result = await dbDalInstance.getExcludedProductIds(excludedProductIds)
      const want = excludedProductIds.map((productId) => ({ productId }))

      expect(result).toHaveLength(want.length)
      expect(result).toMatchObject(want)
    })
    it("should toggle several excluded products and retrieve a superset of them correctly", async () => {
      const excludedProductIds = [1, 2, 3]
      for (const excludedProductId of excludedProductIds) {
        await dbDalInstance.toggleExcludedProduct(excludedProductId)
      }

      const result = await dbDalInstance.getExcludedProductIds([...excludedProductIds, 4, 5])
      const want = excludedProductIds.map((productId) => ({ productId }))

      expect(result).toHaveLength(want.length)
      expect(result).toMatchObject(want)
    })
  })
})
