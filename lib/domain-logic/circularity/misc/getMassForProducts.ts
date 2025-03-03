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
