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

import { ElcaProjectComponentRow } from "./domain-types"
import { preloadCircularityData } from "./preloadCircularityData"

// Mock the dependencies
jest.mock("../../../../prisma/queries/dalSingletons", () => ({
  dbDalInstance: {
    getExcludedProductIds: jest.fn(),
    getUserDefinedTBaustoffData: jest.fn(),
    getTBaustoffMappingEntries: jest.fn(),
    getTBaustoffProducts: jest.fn(),
  },
  legacyDbDalInstance: {
    getProcessDbUuidForProject: jest.fn(),
  },
}))

jest.mock("./getMassForProducts", () => ({
  getMassForProducts: jest.fn(),
}))

describe("preloadCircularityData", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should fetch process DB UUID and pass it to getTBaustoffMappingEntries", async () => {
    // Arrange
    const projectId = 123
    const processDbUuid = "test-process-db-uuid"
    const components: ElcaProjectComponentRow[] = [
      {
        component_id: 1,
        oekobaudat_process_uuid: "test-uuid-1",
      } as ElcaProjectComponentRow,
      {
        component_id: 2,
        oekobaudat_process_uuid: "test-uuid-2",
      } as ElcaProjectComponentRow,
    ]

    // Mock the dependencies
    const mockExcludedProductRows = [{ productId: 1 }]
    const mockUserEnrichedRows = [{ elcaElementComponentId: 1, tBaustoffProductDefinitionId: 101 }]
    const mockTBaustoffMappingEntries = [{ oebd_processUuid: "test-uuid-1", tBs_productId: 201 }]
    const mockProductMassMap = new Map([[1, 100]])
    const mockTBaustoffProducts = [{ id: 101 }, { id: 201 }]

    // Import the mocked modules
    const dalSingletons = await import("../../../../prisma/queries/dalSingletons")
    const { dbDalInstance, legacyDbDalInstance } = dalSingletons
    const massModule = await import("./getMassForProducts")
    const { getMassForProducts } = massModule

    ;(dbDalInstance.getExcludedProductIds as jest.Mock).mockResolvedValue(mockExcludedProductRows)
    ;(dbDalInstance.getUserDefinedTBaustoffData as jest.Mock).mockResolvedValue(mockUserEnrichedRows)
    ;(dbDalInstance.getTBaustoffMappingEntries as jest.Mock).mockResolvedValue(mockTBaustoffMappingEntries)
    ;(getMassForProducts as jest.Mock).mockResolvedValue(mockProductMassMap)
    ;(dbDalInstance.getTBaustoffProducts as jest.Mock).mockResolvedValue(mockTBaustoffProducts)
    ;(legacyDbDalInstance.getProcessDbUuidForProject as jest.Mock).mockResolvedValue(processDbUuid)

    // Act
    await preloadCircularityData(components, projectId)

    // Assert
    expect(legacyDbDalInstance.getProcessDbUuidForProject).toHaveBeenCalledWith(projectId)
    expect(dbDalInstance.getTBaustoffMappingEntries).toHaveBeenCalledWith(
      expect.arrayContaining(["test-uuid-1", "test-uuid-2"]),
      processDbUuid
    )
  })

  it("should throw an error if no process DB UUID is found", async () => {
    // Arrange
    const projectId = 123
    const components: ElcaProjectComponentRow[] = [
      {
        component_id: 1,
        oekobaudat_process_uuid: "test-uuid-1",
      } as ElcaProjectComponentRow,
    ]

    // Import the mocked modules
    const dalSingletons = await import("../../../../prisma/queries/dalSingletons")
    const { legacyDbDalInstance } = dalSingletons

    // Mock the dependencies to return null for process DB UUID
    ;(legacyDbDalInstance.getProcessDbUuidForProject as jest.Mock).mockResolvedValue(null)

    // Act & Assert
    await expect(preloadCircularityData(components, projectId)).rejects.toThrow("No process_db UUID found for project")
  })
})
