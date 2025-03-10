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
