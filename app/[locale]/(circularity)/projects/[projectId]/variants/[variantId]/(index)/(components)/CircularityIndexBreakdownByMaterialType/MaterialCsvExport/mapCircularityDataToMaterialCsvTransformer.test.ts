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
import {
  CalculateCircularityDataForLayerReturnType,
  SpecificOrTotal,
} from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { DismantlingPotentialClassId, DisturbingSubstanceSelection } from "prisma/generated/client"
import { mapCircularityDataToMaterialCsvTransformer } from "./mapCircularityDataToMaterialCsvTransformer"

/**
 * Helper to create a mock layer object for testing.
 */
function createMockLayer(
  overrides: Partial<CalculateCircularityDataForLayerReturnType> = {}
): CalculateCircularityDataForLayerReturnType {
  return {
    component_id: 1,
    element_uuid: "mock-element-uuid",
    layer_position: 0,
    is_layer: true,
    process_name: "mock-process",
    oekobaudat_process_uuid: undefined,
    pdb_name: undefined,
    pdb_version: null,
    oekobaudat_process_db_uuid: undefined,
    element_name: "Mock Layer",
    unit: "m2",
    quantity: 1,
    layer_size: 0.1,
    layer_length: null,
    layer_width: null,
    process_config_density: null,
    process_config_name: "mock-config",
    process_category_node_id: 999,
    process_config_id: null,
    process_category_ref_num: null,

    mass: 100,
    volume: 0.5,
    isExcluded: false,
    tBaustoffProductSelectedByUser: false,
    tBaustoffProductData: { name: "Test Material", tBaustoffProductId: 123 },
    dismantlingPotentialClassId: DismantlingPotentialClassId.II,
    eolUnbuiltSpecificScenario: null,
    eolUnbuiltSpecificScenarioProofText: null,
    disturbingSubstanceSelections: [] as DisturbingSubstanceSelection[],
    disturbingEolScenarioForS4: null,

    circularityIndex: 0.75,
    dismantlingPoints: 1,
    disturbingSubstances: {
      noDisturbingSubstancesOrOnlyNullClassesSelected: true,
      hasS4DisturbingSubstance: false,
    },
    eolUnbuilt: { points: 3, className: "Class A", specificOrTotal: SpecificOrTotal.Specific },
    eolBuilt: { points: 2, className: "Class B" },
    layer_area_ratio: 0.8,
    ...overrides,
  } as CalculateCircularityDataForLayerReturnType
}

// Create mock test data
const mockCircularityData = [
  {
    element_uuid: "element-1",
    element_name: "Wall Component",
    element_type_name: "Wall",
    din_code: 331,
    quantity: 2,
    unit: "m2",
    layers: [
      createMockLayer({
        element_name: "Wall Layer 1",
        process_name: "Concrete",
        mass: 150,
        circularityIndex: 0.8,
      }),
      createMockLayer({
        element_name: "Wall Layer 2",
        process_name: "Insulation",
        mass: 50,
        circularityIndex: 0.6,
      }),
    ],
  },
  {
    element_uuid: "element-2",
    element_name: "Floor Component",
    element_type_name: "Floor",
    din_code: 350,
    quantity: 5,
    unit: "m2",
    layers: [
      createMockLayer({
        element_name: "Floor Layer",
        process_name: "Wood",
        mass: 80,
        circularityIndex: 0.9,
      }),
    ],
  },
]

// Mock translations for testing
const mockTranslations = {
  processName: "Process Name",
  buildingComponent: "Component Name",
  amount: "Amount",
  unit: "Unit",
  tBaustoffMaterial: "Material",
  thickness: "Thickness",
  share: "Share",
  volumePerUnit: "Volume per Unit",
  massPerUnit: "Mass per Unit",
  circularityIndex: "Circularity Index",
  eolClassBuilt: "EOL Class Built",
  eolPointsBuilt: "EOL Points Built",
  eolClassUnbuilt: "EOL Class Unbuilt",
  eolPointsUnbuilt: "EOL Points Unbuilt",
  rebuildClass: "Rebuild Class",
  rebuildPoints: "Rebuild Points",
  componentId: "Component ID",
  elementUuid: "Element UUID",
}

describe("circularityDataToCsvTransformer", () => {
  describe("mapCircularityDataToCsv", () => {
    test("transforms circularity data to CSV format with translated headers", () => {
      const csv = mapCircularityDataToMaterialCsvTransformer(mockCircularityData, mockTranslations)

      // Check that CSV contains header row with translated field names
      expect(
        csv.startsWith(
          "Process Name,Component Name,Amount,Unit,Material,Thickness,Share,Volume per Unit,Mass per Unit,Circularity Index"
        )
      ).toBeTruthy()

      // Check that CSV contains the expected number of rows (header + 3 data rows)
      const rows = csv.split("\n")
      expect(rows.length).toBe(4) // 1 header row + 3 data rows

      // Check that specific data values are present in the CSV
      expect(csv).toContain("Concrete,Wall Component")
      expect(csv).toContain("Insulation,Wall Component")
      expect(csv).toContain("Wood,Floor Component")
    })

    test("handles empty circularity data", () => {
      const emptyData: typeof mockCircularityData = []
      const csv = mapCircularityDataToMaterialCsvTransformer(emptyData, mockTranslations)

      // Should return an empty string for empty data
      expect(csv).toBe("")
    })

    test("handles circularity data with no layers", () => {
      const dataWithNoLayers: typeof mockCircularityData = [
        {
          element_uuid: "element-1",
          element_name: "Wall Component",
          element_type_name: "Wall",
          din_code: 331,
          quantity: 2,
          unit: "m2",
          layers: [],
        },
      ]

      const csv = mapCircularityDataToMaterialCsvTransformer(dataWithNoLayers, mockTranslations)

      // Should return an empty string when there are no layers
      expect(csv).toBe("")
    })

    test("properly escapes values containing commas", () => {
      const dataWithCommas: typeof mockCircularityData = [
        {
          element_uuid: "element-1",
          element_name: "Wall, with comma",
          element_type_name: "Wall",
          din_code: 331,
          quantity: 2,
          unit: "m2",
          layers: [
            createMockLayer({
              element_name: "Layer, with comma",
              process_name: "Material, with comma",
              mass: 150,
              circularityIndex: 0.8,
            }),
          ],
        },
      ]

      const csv = mapCircularityDataToMaterialCsvTransformer(dataWithCommas, mockTranslations)

      // Check that values with commas are properly quoted
      expect(csv).toContain('"Material, with comma"')
      expect(csv).toContain('"Wall, with comma"')
    })

    test("uses fallback for missing translations", () => {
      // Create a partial translation map missing some keys
      const partialTranslations = {
        processName: "Process Name",
        buildingComponent: "Component Name",
        // Other translations missing
      }

      const csv = mapCircularityDataToMaterialCsvTransformer(mockCircularityData, partialTranslations)

      // Should use the original key names for missing translations
      expect(csv).toContain("Process Name,Component Name,amount,unit")
    })
  })
})
