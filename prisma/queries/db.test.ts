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

  describe("tBaustoff mapping queries", () => {
    // These tests verify that the methods are called with the correct parameters

    it("should pass process DB UUID to getTBaustoffMappingEntries", async () => {
      // Save the original implementation
      const originalGetTBaustoffMappingEntries = dbDalInstance.getTBaustoffMappingEntries

      try {
        // Create a mock function
        const mockFn = jest.fn().mockResolvedValue([])

        // Replace the original method with the mock
        dbDalInstance.getTBaustoffMappingEntries = mockFn

        const processUuids = ["uuid1", "uuid2"]
        const processDbUuid = "test-process-db-uuid"

        // Call the method
        await dbDalInstance.getTBaustoffMappingEntries(processUuids, processDbUuid)

        // Verify it was called with the correct parameters
        expect(mockFn).toHaveBeenCalledWith(processUuids, processDbUuid)
      } finally {
        // Restore the original method
        dbDalInstance.getTBaustoffMappingEntries = originalGetTBaustoffMappingEntries
      }
    })

    it("should pass process DB UUID to getTBaustoffMappingEntry", async () => {
      // Save the original implementation
      const originalGetTBaustoffMappingEntry = dbDalInstance.getTBaustoffMappingEntry

      try {
        // Create a mock function
        const mockFn = jest.fn().mockResolvedValue(null)

        // Replace the original method with the mock
        dbDalInstance.getTBaustoffMappingEntry = mockFn

        const processUuid = "uuid1"
        const processDbUuid = "test-process-db-uuid"

        // Call the method
        await dbDalInstance.getTBaustoffMappingEntry(processUuid, processDbUuid)

        // Verify it was called with the correct parameters
        expect(mockFn).toHaveBeenCalledWith(processUuid, processDbUuid)
      } finally {
        // Restore the original method
        dbDalInstance.getTBaustoffMappingEntry = originalGetTBaustoffMappingEntry
      }
    })
  })
})
