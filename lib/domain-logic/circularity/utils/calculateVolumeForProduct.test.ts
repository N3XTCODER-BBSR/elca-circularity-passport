import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { calculateVolumeForProduct } from "./calculateVolumeForProduct"

describe("calculateVolumeForProduct", () => {
  const productIdExpectedVolumeMap = new Map<number, number | null>([
    [25, 0.0576], // shares layer with product 26
    [26, 0.5824], // shares layer with product 25
    [5, 0.3],
    [6, 0.115],
    [7, 0.302],
    [17, null], // other material
    [18, null], // other material
    [19, null], // other material
    [22, 0.154],
    [23, 0.856],
  ])

  it.each(
    Array.from(productIdExpectedVolumeMap.entries()).map(([productId]) => ({
      productId,
    }))
  )("should return the correct volume for product $productId ", async ({ productId }) => {
    const product = await legacyDbDalInstance.getProductById(productId)
    if (!product) {
      throw new Error(`Product with id ${productId} not found`)
    }

    const volume = calculateVolumeForProduct(
      product.layer_length?.toNumber() || null,
      product.layer_width?.toNumber() || null,
      product.layer_size?.toNumber() || null,
      product.layer_area_ratio?.toNumber() || null
    )
    const expectedVolume = productIdExpectedVolumeMap.get(productId)!

    expect(volume).toBe(expectedVolume)
  })
})
