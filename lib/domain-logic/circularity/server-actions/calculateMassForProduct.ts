import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { calculateMassForLayer } from "../utils/calculateMassForLayer"
import { calculateMassForNonLayerProduct } from "../utils/calculateMassForNonLayerProduct"

export const calculateMassForProduct = async (productId: number) => {
  const product = await legacyDbDalInstance.getProductById(productId)

  if (!product) {
    throw new Error("Product not found")
  }

  if (!product.is_layer) {
    return calculateMassForNonLayerProduct(productId)
  }

  return calculateMassForLayer(productId)
}
