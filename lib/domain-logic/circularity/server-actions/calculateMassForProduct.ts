import { prismaLegacy } from "prisma/prismaClient"
import { calculateMassForLayer } from "../utils/calculateMassForLayer"
import { calculateMassForNonLayerProduct } from "../utils/calculateMassForNonLayerProduct"

export const calculateMassForProduct = async (productId: number) => {
  const product = await prismaLegacy.elca_element_components.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  if (!product.is_layer) {
    return calculateMassForNonLayerProduct(productId)
  }

  return calculateMassForLayer(productId)
}
