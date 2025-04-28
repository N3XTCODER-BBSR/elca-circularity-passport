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
import { EolClasses } from "lib/domain-logic/circularity/utils/circularityMappings"
import { DismantlingPotentialClassId, DisturbingSubstanceSelection } from "prisma/generated/client"
import {
  mapCircularityDataToAggregatedInventoryCsvTransformer,
  processCircularityDataForCsv,
} from "./mapCircularityDataToAggregatedInventoryCsvTransformer"

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
    eolUnbuilt: { points: 3, className: EolClasses.A, specificOrTotal: SpecificOrTotal.Specific },
    eolBuilt: { points: 2, className: EolClasses.B },
    layer_area_ratio: 0.8,
    ...overrides,
  } as CalculateCircularityDataForLayerReturnType
}

// Create mock test data with different materials and EOL classes
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
        volume: 0.6,
        tBaustoffProductData: { name: "Concrete", tBaustoffProductId: 1 },
        eolUnbuilt: { points: 140, className: EolClasses.A, specificOrTotal: SpecificOrTotal.Specific },
      }),
      createMockLayer({
        element_name: "Wall Layer 2",
        process_name: "Insulation",
        mass: 50,
        volume: 0.3,
        tBaustoffProductData: { name: "Insulation", tBaustoffProductId: 2 },
        eolUnbuilt: { points: 80, className: EolClasses.C, specificOrTotal: SpecificOrTotal.Specific },
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
        volume: 0.4,
        tBaustoffProductData: { name: "Wood", tBaustoffProductId: 3 },
        eolUnbuilt: { points: 60, className: EolClasses.D, specificOrTotal: SpecificOrTotal.Specific },
      }),
      createMockLayer({
        element_name: "Floor Layer 2",
        process_name: "Concrete",
        mass: 200,
        volume: 0.8,
        tBaustoffProductData: { name: "Concrete", tBaustoffProductId: 1 },
        eolUnbuilt: { points: 100, className: EolClasses.B, specificOrTotal: SpecificOrTotal.Specific },
      }),
    ],
  },
]

// Mock translations for testing
const mockTranslations = {
  total: "Total",
  volumeSection: "Volume Data (m³)",
  massSection: "Mass Data (kg)",
  percentagePerClass: "% per class",
  aggregatedInventory: "Aggregated Inventory",
}

describe("mapCircularityDataToAggregatedInventoryCsvTransformer", () => {
  describe("processCircularityDataForCsv", () => {
    test("correctly processes circularity data for volume", () => {
      const result = processCircularityDataForCsv(mockCircularityData, "volume")

      // Check that tBaustoffEolData contains entries for all materials
      expect(result.tBaustoffEolData.length).toBe(3) // Concrete, Insulation, Wood

      // Check that the concrete data is aggregated correctly (from multiple layers)
      const concreteData = result.tBaustoffEolData.find((item) => item.tBaustoffName === "Concrete")
      expect(concreteData).toBeDefined()
      expect(concreteData?.eolData[EolClasses.A]).toBe(0.6) // From Wall Layer 1
      expect(concreteData?.eolData[EolClasses.B]).toBe(0.8) // From Floor Layer 2
      expect(concreteData?.total).toBe(1.4) // 0.6 + 0.8

      // Check that all EOL classes except NA are included
      const expectedEolClassesCount = Object.values(EolClasses).filter((eolClass) => eolClass !== EolClasses.NA).length
      expect(result.eolClasses.length).toBe(expectedEolClassesCount)

      // Check that totals are calculated correctly
      expect(result.eolTotals[EolClasses.A]).toBe(0.6) // Only one layer with class A
      expect(result.eolTotals[EolClasses.B]).toBe(0.8) // Only one layer with class B
      expect(result.eolTotals[EolClasses.C]).toBe(0.3) // Only one layer with class C
      expect(result.eolTotals[EolClasses.D]).toBe(0.4) // Only one layer with class D

      // Check grand total
      expect(result.grandTotal).toBe(2.1) // 0.6 + 0.3 + 0.4 + 0.8
    })

    test("correctly processes circularity data for mass", () => {
      const result = processCircularityDataForCsv(mockCircularityData, "mass")

      // Check that tBaustoffEolData contains entries for all materials
      expect(result.tBaustoffEolData.length).toBe(3) // Concrete, Insulation, Wood

      // Check that the concrete data is aggregated correctly (from multiple layers)
      const concreteData = result.tBaustoffEolData.find((item) => item.tBaustoffName === "Concrete")
      expect(concreteData).toBeDefined()
      expect(concreteData?.eolData[EolClasses.A]).toBe(150) // From Wall Layer 1
      expect(concreteData?.eolData[EolClasses.B]).toBe(200) // From Floor Layer 2
      expect(concreteData?.total).toBe(350) // 150 + 200

      // Check that totals are calculated correctly
      expect(result.eolTotals[EolClasses.A]).toBe(150) // Only one layer with class A
      expect(result.eolTotals[EolClasses.B]).toBe(200) // Only one layer with class B
      expect(result.eolTotals[EolClasses.C]).toBe(50) // Only one layer with class C
      expect(result.eolTotals[EolClasses.D]).toBe(80) // Only one layer with class D

      // Check grand total
      expect(result.grandTotal).toBe(480) // 150 + 50 + 80 + 200
    })

    test("handles empty circularity data", () => {
      const result = processCircularityDataForCsv([], "volume")

      expect(result.tBaustoffEolData.length).toBe(0)
      expect(result.grandTotal).toBe(0)
      expect(Object.values(result.eolTotals).every((total) => total === 0)).toBeTruthy()
    })

    test("handles circularity data with no layers", () => {
      const dataWithNoLayers = [
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

      const result = processCircularityDataForCsv(dataWithNoLayers, "volume")

      expect(result.tBaustoffEolData.length).toBe(0)
      expect(result.grandTotal).toBe(0)
      expect(Object.values(result.eolTotals).every((total) => total === 0)).toBeTruthy()
    })

    test("skips layers without tBaustoff data or EOL class", () => {
      const dataWithMissingInfo = [
        {
          element_uuid: "element-1",
          element_name: "Wall Component",
          element_type_name: "Wall",
          din_code: 331,
          quantity: 2,
          unit: "m2",
          layers: [
            createMockLayer({
              tBaustoffProductData: null, // Missing tBaustoff data
              mass: 100,
              volume: 0.5,
            }),
            createMockLayer({
              eolUnbuilt: null, // Missing EOL class
              mass: 200,
              volume: 1.0,
            }),
          ],
        },
      ]

      const result = processCircularityDataForCsv(dataWithMissingInfo, "volume")

      expect(result.tBaustoffEolData.length).toBe(0)
      expect(result.grandTotal).toBe(0)
    })
  })

  describe("mapCircularityDataToAggregatedInventoryCsvTransformer", () => {
    test("transforms circularity data to CSV format with both volume and mass sections", () => {
      const csv = mapCircularityDataToAggregatedInventoryCsvTransformer(mockCircularityData, mockTranslations)

      // Check that CSV contains the main header (now quoted)
      expect(csv.startsWith('"Aggregated Inventory"')).toBeTruthy()

      // Check that CSV contains both volume and mass sections (now quoted)
      expect(csv).toContain('"Volume Data (m³)"')
      expect(csv).toContain('"Mass Data (kg)"')

      // Check that CSV contains the expected number of rows
      const rows = csv.split("\n")
      expect(rows.length).toBeGreaterThan(10) // Header + section headers + data rows + totals

      // Check that specific data values are present in the CSV
      expect(csv).toContain('"Concrete"')
      expect(csv).toContain('"Insulation"')
      expect(csv).toContain('"Wood"')

      // Check that the EOL classes are included as columns
      Object.values(EolClasses).forEach((eolClass) => {
        if (eolClass !== EolClasses.NA) {
          expect(csv).toContain(`"${eolClass}"`)
        }
      })

      // Check that the totals row is present (full label, now quoted)
      expect(csv).toContain('"Total volume (m³) per EOL class"')
      expect(csv).toContain('"Total mass (kg) per EOL class"')

      // Check that the percentage row is present
      expect(csv).toContain('"% per class"')
    })

    test("handles empty circularity data", () => {
      const csv = mapCircularityDataToAggregatedInventoryCsvTransformer([], mockTranslations)

      // Should still create a CSV with headers
      expect(csv).toContain('"Aggregated Inventory"')
      expect(csv).toContain('"Volume Data (m³)"')
      expect(csv).toContain('"Mass Data (kg)"')

      // Check that the CSV contains Total rows (now matching full label)
      const rows = csv.split("\n")

      // Verify that there are Total rows in the output
      const totalRows = rows.filter(
        (row) =>
          row.startsWith('"Total volume (m³) per EOL class"') || row.startsWith('"Total mass (kg) per EOL class"')
      )
      expect(totalRows.length).toBeGreaterThan(0)

      // Verify that the percentage rows exist
      const percentageRows = rows.filter((row) => row.includes('"% per class"'))
      expect(percentageRows.length).toBeGreaterThan(0)
    })

    test("uses fallback for missing translations", () => {
      // Create a partial translation map missing some keys
      const partialTranslations = {
        total: "Total",
        // Other translations missing
      }

      const csv = mapCircularityDataToAggregatedInventoryCsvTransformer(mockCircularityData, partialTranslations)

      // Should use the original key names for missing translations
      expect(csv).toContain('"Volume Data (m³)"')
      expect(csv).toContain('"Mass Data (kg)"')
      expect(csv).toContain('"% per class"')
    })

    test("formats numbers correctly, omitting zeros", () => {
      const csv = mapCircularityDataToAggregatedInventoryCsvTransformer(mockCircularityData, mockTranslations)

      // Check that non-zero values are formatted with 2 decimal places
      expect(csv).toContain('"0.60"') // Volume of concrete in class A
      expect(csv).toContain('"0.80"') // Volume of concrete in class B

      // Check that zero values are represented as quoted empty strings
      const rows = csv.split("\n")
      const rowWithZeros = rows.find((row) => row.includes('"Insulation"') && row.includes('""'))

      expect(rowWithZeros).toBeDefined()
    })
  })
})
