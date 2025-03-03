import _ from "lodash"
import { mergeMaps } from "app/(utils)/map"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { getMassForLayers } from "./getMassForLayer"
import { getMassForNonLayerProducts } from "../utils/calculateMassForNonLayerProduct"

export const getMassForProducts = async (productIds: number[]) => {
  const products = await legacyDbDalInstance.getProductsByIds(productIds)

  const [nonLayerProducts, layerProducts] = _.partition(products, (product) => product.layer_size === null)
  const nonLayerProductIds = nonLayerProducts.map((product) => product.id)
  const layerProductIds = layerProducts.map((product) => product.id)

  const [productIdMassMapForNonLayerProducts, productIdMassForLayerProducts] = await Promise.all([
    getMassForNonLayerProducts(nonLayerProductIds),
    getMassForLayers(layerProductIds),
  ])

  return mergeMaps(productIdMassMapForNonLayerProducts, productIdMassForLayerProducts)
}

export const getMassForProduct = async (productId: number) => {
  const massMap = await getMassForProducts([productId])
  return massMap.get(productId) || null
}
