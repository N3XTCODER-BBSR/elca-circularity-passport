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

// Mock the crypto.randomUUID function
Object.defineProperty(global.crypto, "randomUUID", {
  value: () => "test-uuid",
  configurable: true,
})

// Set up mocks before imports
jest.mock("../misc/getProjectCircularityData", () => ({
  __esModule: true,
  getProjectCircularityData: jest.fn(),
}))

// Set up mock for PassportDataSchema
jest.mock("../../grp/data-schema/versions/v1/passportSchema", () => ({
  __esModule: true,
  PassportDataSchema: {
    parse: jest.fn((data) => data),
  },
}))

// Set up mock for dalSingletons
jest.mock("../../../../prisma/queries/dalSingletons", () => ({
  dbDalInstance: {
    createNewPassportForProjectVariantId: jest.fn().mockResolvedValue({
      id: "mock-id",
      uuid: "mock-uuid",
      projectVariantId: "123",
      versionTag: "v1.0.0",
      passportData: {},
      issueDate: new Date(),
      expiryDate: new Date(),
    }),
  },
  legacyDbDalInstance: {
    getPassportRelevantDataForProjectVariantFromLegacyDb: jest.fn(),
    getProjectWithVaraitnsAndProcessDbById: jest.fn(),
  },
}))

// Import modules after mocks are set up
import { createCompletePassportForProjectVariant } from "./managePassport"
import { dbDalInstance, legacyDbDalInstance } from "../../../../prisma/queries/dalSingletons"
import { getProjectCircularityData } from "../misc/getProjectCircularityData"

describe("createCompletePassportForProjectVariant", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProject = {
    id: 456,
    name: "Test Project",
    description: "Test Project Description",
    is_reference: false,
    owner_id: 1,
    access_group_id: 1,
    created: new Date(),
    modified: null,
    benchmark_version_id: null,
    constr_catalog_id: null,
    project_nr: "TEST-123",
    life_time: 50,
    phase_id: 1,
    process_db_id: 1,
    protected: false,
    public: false,
    benchmark_disabled: false,
    benchmark_version_to_compute: null,
    din277_version: null,
    process_dbs: {
      name: "Test DB",
    },
    project_variants_project_variants_project_idToprojects: [
      {
        name: "Test Variant",
        description: "Test variant description",
        project_id: 456,
        id: 123,
        created: new Date(),
        modified: null,
        phase_id: 1,
      },
    ],
  }

  const mockCircularityData = [
    {
      element_uuid: "element-1",
      element_name: "Element 1",
      din_code: "123",
      unit: "kg",
      quantity: 2,
      layers: [
        {
          layer_position: 1,
          process_name: "Test Process 1",
          mass: 10,
          volume: 5,
          oekobaudat_process_uuid: "test-uuid-1",
          process_category_ref_num: "1.1",
          tBaustoffProductData: {
            name: "Test Product 1",
          },
          disturbingSubstanceSelections: [],
          eolBuilt: { points: 1 },
          dismantlingPoints: 2,
          circularityIndex: 0.5,
          dismantlingPotentialClassId: "A",
          eolUnbuiltSpecificScenarioProofText: "Proof text",
        },
      ],
    },
    {
      element_uuid: "element-2",
      element_name: "Element 2",
      din_code: "456",
      unit: "m²",
      quantity: 3,
      layers: [
        {
          layer_position: 1,
          process_name: "Test Process 2",
          mass: 20,
          volume: 10,
          oekobaudat_process_uuid: "test-uuid-2",
          process_category_ref_num: "2.1",
          tBaustoffProductData: {
            name: "Test Product 2",
          },
          disturbingSubstanceSelections: [],
          eolBuilt: { points: 2 },
          dismantlingPoints: 3,
          circularityIndex: 0.7,
          dismantlingPotentialClassId: "B",
          eolUnbuiltSpecificScenarioProofText: "Proof text 2",
        },
      ],
    },
  ]

  const mockPassportData = {
    id: 123,
    name: "Test Variant",
    description: "Test variant description",
    project_id: 456,
    phase_id: 1,
    created: new Date("2020-01-01"),
    modified: null,
    projects_project_variants_project_idToprojects: {
      name: "Test Project",
      project_nr: "TEST-123",
      description: "Test project description",
      life_time: 50,
    },
    project_locations: {
      street: "Test Street",
      postcode: "12345",
      city: "Test City",
      country: "Test Country",
    },
    project_constructions: {
      property_size: { toNumber: () => 1000 },
      net_floor_space: { toNumber: () => 800 },
      gross_floor_space: 900,
      is_extant_building: false,
      living_space: null,
      net_room_space_heated: null,
      floor_space: null,
    },
  }

  it("should create a complete passport successfully", async () => {
    // Arrange
    const projectVariantId = 123
    const projectId = 456

    jest.spyOn(legacyDbDalInstance, "getProjectWithVaraitnsAndProcessDbById").mockResolvedValue(mockProject)
    ;(getProjectCircularityData as jest.Mock).mockResolvedValue(mockCircularityData)
    jest
      .spyOn(legacyDbDalInstance, "getPassportRelevantDataForProjectVariantFromLegacyDb")
      .mockResolvedValue(mockPassportData)
    jest.spyOn(dbDalInstance, "createNewPassportForProjectVariantId")

    // Act
    const result = await createCompletePassportForProjectVariant(projectVariantId, projectId)

    // Assert
    expect(legacyDbDalInstance.getProjectWithVaraitnsAndProcessDbById).toHaveBeenCalledWith(projectId)
    expect(getProjectCircularityData).toHaveBeenCalledWith(projectVariantId, projectId)
    expect(legacyDbDalInstance.getPassportRelevantDataForProjectVariantFromLegacyDb).toHaveBeenCalledWith(
      projectVariantId
    )
    expect(dbDalInstance.createNewPassportForProjectVariantId).toHaveBeenCalled()
    expect(result).toBeDefined()
    expect(result.uuid).toBe("test-uuid")
    expect(result.projectName).toBe("Test Variant")
  })

  it("should throw an error when project is not found", async () => {
    // Arrange
    const projectVariantId = 123
    const projectId = 456

    jest.spyOn(legacyDbDalInstance, "getProjectWithVaraitnsAndProcessDbById").mockResolvedValue(null)

    // Act & Assert
    await expect(createCompletePassportForProjectVariant(projectVariantId, projectId)).rejects.toThrow(
      "Project not found!"
    )
    expect(getProjectCircularityData).not.toHaveBeenCalled()
  })

  it("should handle null fields in passport data", async () => {
    // Arrange
    const projectVariantId = 123
    const projectId = 456

    // Mock null fields in passport data
    const incompletePassportData = {
      ...mockPassportData,
      project_locations: null,
      project_constructions: null,
      created: new Date("2020-01-01"),
    }

    jest.spyOn(legacyDbDalInstance, "getProjectWithVaraitnsAndProcessDbById").mockResolvedValue(mockProject)
    ;(getProjectCircularityData as jest.Mock).mockResolvedValue(mockCircularityData)
    jest
      .spyOn(legacyDbDalInstance, "getPassportRelevantDataForProjectVariantFromLegacyDb")
      .mockResolvedValue(incompletePassportData)
    jest.spyOn(dbDalInstance, "createNewPassportForProjectVariantId")

    // Act
    const result = await createCompletePassportForProjectVariant(projectVariantId, projectId)

    // Assert
    expect(result).toBeDefined()
    expect(result.buildingBaseData.address).toBe("undefined, undefined undefined (undefined)")
    expect(result.buildingBaseData.buildingCompletionYear).toBe(2020)
  })
})
