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
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { getProjectCircularityData } from "./getProjectCircularityData"
import { preloadCircularityData } from "./preloadCircularityData"
import calculateCircularityDataForLayer from "../utils/calculate-circularity-data-for-layer"

// Mock the dependencies
// Create mock implementations for all external dependencies
// This allows us to control their behavior and verify interactions during tests

// Create a mock for the legacyDbDalInstance with mock functions for its methods
jest.mock("../../../../prisma/queries/dalSingletons", () => {
  const mockLegacyDbDalInstance = {
    getElcaComponentsWithElementsForProjectAndVariantId: jest.fn(),
    getAllProcessCategories: jest.fn(),
  }
  return {
    legacyDbDalInstance: mockLegacyDbDalInstance,
  }
})

// Mock the preloadCircularityData function to return controlled test data
jest.mock("./preloadCircularityData", () => ({
  preloadCircularityData: jest.fn(),
}))

// Mock the getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId function
jest.mock("./getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId", () => ({
  getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId: jest.fn(),
}))

// Mock the calculateCircularityDataForLayer function with a custom implementation
// that returns predefined circularity data for any layer
jest.mock("../utils/calculate-circularity-data-for-layer", () => {
  const original = jest.requireActual("../utils/calculate-circularity-data-for-layer")
  return {
    __esModule: true,
    ...original,
    default: jest.fn((layer) => ({
      ...layer,
      circularityIndex: 0.8,
      dismantlingPoints: 0.9,
      disturbingSubstances: {
        noDisturbingSubstancesOrOnlyNullClassesSelected: true,
        hasS4DisturbingSubstance: false,
      },
      eolUnbuilt: null,
      eolBuilt: {
        points: 0.7,
        className: "A",
      },
    })),
  }
})

// Get a reference to the mocked legacyDbDalInstance so we can configure and verify it in tests
const mockLegacyDbDalInstance = jest.requireMock("../../../../prisma/queries/dalSingletons").legacyDbDalInstance

describe("getProjectCircularityData", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("should filter out components with no layers", async () => {
    // Mock data setup
    const mockVariantId = 123
    const mockProjectId = 456

    // Mock the elements with components from legacy DB
    const mockElementsWithComponents = [
      {
        uuid: "element-1",
        name: "Element 1",
        ref_unit: "m²",
        quantity: "2",
        element_types: {
          din_code: 123,
          name: "Type 1",
        },
        element_components: [
          {
            id: 1,
            layer_position: 1,
            is_layer: true,
            quantity: "1",
            layer_size: "10",
            layer_length: "10",
            layer_width: "1",
            layer_area_ratio: null,
            process_configs: {
              id: 1,
              name: "Process 1",
              density: "1000",
              process_category_node_id: 1,
              process_categories: {
                ref_num: "1",
              },
              process_life_cycle_assignments: [
                {
                  processes: {
                    uuid: "process-uuid-1",
                    process_dbs: {
                      name: "PDB 1",
                      version: "1.0",
                      uuid: "db-uuid-1",
                    },
                  },
                },
              ],
            },
            process_conversions: {
              in_unit: "m²",
            },
          },
        ],
      },
      {
        uuid: "element-2",
        name: "Element 2",
        ref_unit: "m²",
        quantity: "3",
        element_types: {
          din_code: 456,
          name: "Type 2",
        },
        element_components: [], // This element has no components/layers
      },
      {
        uuid: "element-3",
        name: "Element 3",
        ref_unit: "m²",
        quantity: "1",
        element_types: {
          din_code: 789,
          name: "Type 3",
        },
        element_components: [
          {
            id: 3,
            layer_position: 1,
            is_layer: true,
            quantity: "1",
            layer_size: "5",
            layer_length: "5",
            layer_width: "1",
            layer_area_ratio: null,
            process_configs: {
              id: 3,
              name: "Process 3",
              density: "2000",
              process_category_node_id: 3,
              process_categories: {
                ref_num: "3",
              },
              process_life_cycle_assignments: [
                {
                  processes: {
                    uuid: "process-uuid-3",
                    process_dbs: {
                      name: "PDB 3",
                      version: "1.0",
                      uuid: "db-uuid-3",
                    },
                  },
                },
              ],
            },
            process_conversions: {
              in_unit: "m²",
            },
          },
        ],
      },
    ]

    // Mock the preloaded circularity data
    const mockPreloadedData = {
      excludedProductIdsSet: new Set(),
      userEnrichedMap: new Map(),
      tBaustoffMappingEntriesMap: new Map(),
      tBaustoffProductMap: new Map(),
      productMassMap: new Map(),
    }

    // Mock the element details with products for each element
    const mockElementDetailsWithProducts1 = {
      element_uuid: "element-1",
      element_type_name: "Type 1",
      element_name: "Element 1",
      din_code: 123,
      unit: "m²",
      quantity: 2,
      layers: [
        {
          component_id: 1,
          element_uuid: "element-1",
          is_layer: true,
          layer_position: 1,
          process_name: "Process 1",
          // ... other properties
        },
      ],
    }

    const mockElementDetailsWithProducts2 = {
      element_uuid: "element-2",
      element_type_name: "Type 2",
      element_name: "Element 2",
      din_code: 456,
      unit: "m²",
      quantity: 3,
      layers: [], // This element has no layers
    }

    const mockElementDetailsWithProducts3 = {
      element_uuid: "element-3",
      element_type_name: "Type 3",
      element_name: "Element 3",
      din_code: 789,
      unit: "m²",
      quantity: 1,
      layers: [
        {
          component_id: 3,
          element_uuid: "element-3",
          is_layer: true,
          layer_position: 1,
          process_name: "Process 3",
          // ... other properties
        },
      ],
    }

    // Setup the mocks
    // Configure the mock to return our test data when the function is called
    mockLegacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId.mockResolvedValue(
      mockElementsWithComponents
    )

    // The "as jest.Mock" is a TypeScript type assertion that tells the compiler
    // this function is a Jest mock and has mock methods available.
    ;(preloadCircularityData as jest.Mock).mockResolvedValue(mockPreloadedData)

    // Here we're setting up the mock to return different values on consecutive calls:
    ;(getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId as jest.Mock)
      // First call will return data for element 1
      .mockResolvedValueOnce(mockElementDetailsWithProducts1)
      // Second call will return data for element 2
      .mockResolvedValueOnce(mockElementDetailsWithProducts2)
      // Third call will return data for element 3
      .mockResolvedValueOnce(mockElementDetailsWithProducts3)

    // Call the function
    const result = await getProjectCircularityData(mockVariantId, mockProjectId)

    // Assertions
    expect(result).toHaveLength(2) // Should only include elements 1 and 3, not element 2 (which has no layers)
    expect(result[0]!.element_uuid).toBe("element-1")
    expect(result[1]!.element_uuid).toBe("element-3")

    // Verify element 2 (with no layers) is not included
    const element2Included = result.some((element) => element.element_uuid === "element-2")
    expect(element2Included).toBe(false)

    // Verify the function calls
    expect(mockLegacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId).toHaveBeenCalledWith(
      mockVariantId,
      mockProjectId
    )
    expect(preloadCircularityData).toHaveBeenCalled()
    expect(getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId).toHaveBeenCalledTimes(3)
    expect(calculateCircularityDataForLayer).toHaveBeenCalled()
  })

  test("should return empty array when all components have no layers", async () => {
    // Mock data setup
    const mockVariantId = 123
    const mockProjectId = 456

    // Mock the elements with components from legacy DB
    const mockElementsWithComponents = [
      {
        uuid: "element-1",
        name: "Element 1",
        ref_unit: "m²",
        quantity: "2",
        element_types: {
          din_code: 123,
          name: "Type 1",
        },
        element_components: [], // No components
      },
      {
        uuid: "element-2",
        name: "Element 2",
        ref_unit: "m²",
        quantity: "3",
        element_types: {
          din_code: 456,
          name: "Type 2",
        },
        element_components: [], // No components
      },
    ]

    // Mock the preloaded circularity data
    const mockPreloadedData = {
      excludedProductIdsSet: new Set(),
      userEnrichedMap: new Map(),
      tBaustoffMappingEntriesMap: new Map(),
      tBaustoffProductMap: new Map(),
      productMassMap: new Map(),
    }

    // Mock the element details with products for each element
    const mockElementDetailsWithProducts1 = {
      element_uuid: "element-1",
      element_type_name: "Type 1",
      element_name: "Element 1",
      din_code: 123,
      unit: "m²",
      quantity: 2,
      layers: [], // No layers
    }

    const mockElementDetailsWithProducts2 = {
      element_uuid: "element-2",
      element_type_name: "Type 2",
      element_name: "Element 2",
      din_code: 456,
      unit: "m²",
      quantity: 3,
      layers: [], // No layers
    }

    // Setup the mocks
    // Configure the mock to return our test data when the function is called
    mockLegacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId.mockResolvedValue(
      mockElementsWithComponents
    )

    ;(preloadCircularityData as jest.Mock).mockResolvedValue(mockPreloadedData)

    // Configure the mock to return different values for consecutive calls
    ;(getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId as jest.Mock)
      // First call will return data for element 1 (with no layers)
      .mockResolvedValueOnce(mockElementDetailsWithProducts1)
      // Second call will return data for element 2 (with no layers)
      .mockResolvedValueOnce(mockElementDetailsWithProducts2)

    // Call the function
    const result = await getProjectCircularityData(mockVariantId, mockProjectId)

    // Assertions
    expect(result).toHaveLength(0) // Should return an empty array

    // Verify the function calls
    expect(mockLegacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId).toHaveBeenCalledWith(
      mockVariantId,
      mockProjectId
    )
    expect(preloadCircularityData).toHaveBeenCalled()
    expect(getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId).toHaveBeenCalledTimes(2)
  })

  test("should filter out elements where all layers are excluded", async () => {
    // Mock data setup
    const mockVariantId = 123
    const mockProjectId = 456

    // Mock the elements with components from legacy DB
    const mockElementsWithComponents = [
      {
        uuid: "element-1",
        name: "Element 1",
        ref_unit: "m²",
        quantity: "2",
        element_types: {
          din_code: 123,
          name: "Type 1",
        },
        element_components: [
          {
            id: 1,
            layer_position: 1,
            is_layer: true,
            quantity: "1",
            layer_size: "10",
            layer_length: "10",
            layer_width: "1",
            layer_area_ratio: null,
            process_configs: {
              id: 1,
              name: "Process 1",
              density: "1000",
              process_category_node_id: 1,
              process_categories: {
                ref_num: "1",
              },
              process_life_cycle_assignments: [
                {
                  processes: {
                    uuid: "process-uuid-1",
                    process_dbs: {
                      name: "PDB 1",
                      version: "1.0",
                      uuid: "db-uuid-1",
                    },
                  },
                },
              ],
            },
            process_conversions: {
              in_unit: "m²",
            },
          },
        ],
      },
      {
        uuid: "element-2",
        name: "Element 2",
        ref_unit: "m²",
        quantity: "3",
        element_types: {
          din_code: 456,
          name: "Type 2",
        },
        element_components: [
          {
            id: 2,
            layer_position: 1,
            is_layer: true,
            quantity: "1",
            layer_size: "5",
            layer_length: "5",
            layer_width: "1",
            layer_area_ratio: null,
            process_configs: {
              id: 2,
              name: "Process 2",
              density: "1500",
              process_category_node_id: 2,
              process_categories: {
                ref_num: "2",
              },
              process_life_cycle_assignments: [
                {
                  processes: {
                    uuid: "process-uuid-2",
                    process_dbs: {
                      name: "PDB 2",
                      version: "1.0",
                      uuid: "db-uuid-2",
                    },
                  },
                },
              ],
            },
            process_conversions: {
              in_unit: "m²",
            },
          },
        ],
      },
    ]

    // Mock the preloaded circularity data with element-2's component ID in the excluded set
    const mockPreloadedData = {
      // This is the key part: component ID 2 is in the excluded set
      excludedProductIdsSet: new Set([2]),
      userEnrichedMap: new Map(),
      tBaustoffMappingEntriesMap: new Map(),
      tBaustoffProductMap: new Map(),
      productMassMap: new Map(),
    }

    // Mock the element details with products for each element
    const mockElementDetailsWithProducts1 = {
      element_uuid: "element-1",
      element_type_name: "Type 1",
      element_name: "Element 1",
      din_code: 123,
      unit: "m²",
      quantity: 2,
      layers: [
        {
          component_id: 1,
          element_uuid: "element-1",
          is_layer: true,
          layer_position: 1,
          process_name: "Process 1",
          // ... other properties
        },
      ],
    }

    const mockElementDetailsWithProducts2 = {
      element_uuid: "element-2",
      element_type_name: "Type 2",
      element_name: "Element 2",
      din_code: 456,
      unit: "m²",
      quantity: 3,
      layers: [
        {
          component_id: 2, // This component is in the excluded set
          element_uuid: "element-2",
          is_layer: true,
          layer_position: 1,
          process_name: "Process 2",
          // ... other properties
        },
      ],
    }

    // Setup the mocks
    mockLegacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId.mockResolvedValue(
      mockElementsWithComponents
    )
    ;(preloadCircularityData as jest.Mock).mockResolvedValue(mockPreloadedData)
    ;(getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId as jest.Mock)
      .mockResolvedValueOnce(mockElementDetailsWithProducts1)
      .mockResolvedValueOnce(mockElementDetailsWithProducts2)

    // Call the function
    const result = await getProjectCircularityData(mockVariantId, mockProjectId)

    // Assertions
    expect(result).toHaveLength(1) // Should only include element 1, not element 2 (which has all layers excluded)
    expect(result[0]!.element_uuid).toBe("element-1")

    // Verify element 2 (with excluded layers) is not included
    const element2Included = result.some((element) => element.element_uuid === "element-2")
    expect(element2Included).toBe(false)

    // Verify the function calls
    expect(mockLegacyDbDalInstance.getElcaComponentsWithElementsForProjectAndVariantId).toHaveBeenCalledWith(
      mockVariantId,
      mockProjectId
    )
    expect(preloadCircularityData).toHaveBeenCalled()
    expect(getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId).toHaveBeenCalledTimes(2)
    expect(calculateCircularityDataForLayer).toHaveBeenCalled()
  })
})
