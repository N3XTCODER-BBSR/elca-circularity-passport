import { getWeightByProductId } from "./getWeightByProductId"

describe("getWeightByProductId", () => {
  it.each([
    { productId: 8, expectedWeight: 1.7 },
    { productId: 3, expectedWeight: 1.7 },
    { productId: 1, expectedWeight: 1.7 },
    { productId: 2, expectedWeight: 84 },
    { productId: 4, expectedWeight: 84 },
    { productId: 9, expectedWeight: 84 },
    { productId: 5, expectedWeight: 720 },
    { productId: 10, expectedWeight: 720 },
    { productId: 6, expectedWeight: 253 },
    { productId: 11, expectedWeight: 253 },
    { productId: 13, expectedWeight: 1.5 },
    { productId: 14, expectedWeight: 50.843 },
  ])("should return the correct weight for productId $productId", async ({ productId, expectedWeight }) => {
    const { weight } = await getWeightByProductId(productId)

    expect(weight).toBeCloseTo(expectedWeight, 3)
  })

  it("should throw an error if product is not found", async () => {
    const invalidProductId = 999
    await expect(getWeightByProductId(invalidProductId)).rejects.toThrow("Product not found")
  })
})
