import { mergeMaps } from "app/(utils)/map"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { calculateMassForLayers } from "../utils/calculateMassForLayer"
import { calculateMassForNonLayerProducts } from "../utils/calculateMassForNonLayerProduct"

export const calculateMassForProducts = async (productIds: number[]) => {
  const products = await legacyDbDalInstance.getProductsByIds(productIds)

  const nonLayerProductIds = products.filter((product) => !product.is_layer).map((product) => product.id)
  const layerProductIds = products.filter((product) => product.is_layer).map((product) => product.id)

  const [productIdMassMapForNonLayerProducts, productIdMassForLayerProducts] = await Promise.all([
    calculateMassForNonLayerProducts(nonLayerProductIds),
    calculateMassForLayers(layerProductIds),
  ])

  return mergeMaps(productIdMassMapForNonLayerProducts, productIdMassForLayerProducts)
}

export const calculateMassForProduct = async (productId: number) => {
  return (await calculateMassForProducts([productId])).get(productId)
}
