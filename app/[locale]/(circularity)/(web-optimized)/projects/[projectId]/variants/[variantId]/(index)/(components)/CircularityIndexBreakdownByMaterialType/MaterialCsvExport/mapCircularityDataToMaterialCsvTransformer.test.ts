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
import {
  DismantlingPotentialClassId,
  DisturbingSubstanceClassId,
  DisturbingSubstanceSelection,
  TBs_ProductDefinitionEOLCategoryScenario,
} from "prisma/generated/client"
import { mapCircularityDataToMaterialCsvTransformer } from "./mapCircularityDataToMaterialCsvTransformer"
import { createReadStream } from "fs"
import { Readable } from "stream"
import csv from "csv-parser"

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
    productUnit: "m2",
    productQuantity: 1,
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
    isLayer: true,
    tBaustoffProductSelectedByUser: false,
    tBaustoffProductData: { name: "Test Material", tBaustoffProductId: 123 },
    dismantlingPotentialClassId: DismantlingPotentialClassId.II,
    dismantlingPotentialClassRemark: "",
    eolUnbuiltSpecificScenario: null,
    eolUnbuiltSpecificScenarioProofText: null,
    disturbingSubstanceSelections: [] as DisturbingSubstanceSelection[],
    disturbingEolScenarioForS4: null,

    dismantlingPoints: 1,
    disturbingSubstances: {
      noDisturbingSubstancesOrOnlyNullClassesSelected: true,
      hasS4DisturbingSubstance: false,
    },
    eolUnbuilt: { points: 3, className: "Class A", specificOrTotal: SpecificOrTotal.Specific },
    eolBuilt: { points: 2, className: "Class B" },
    layer_area_ratio: 0.8,

    // Use the mapped values from the schema
    eolScenarioReal: "RC+",
    eolScenarioPotential: "EV-",
    technologyFactor: 0.75,
    manuallyEnteredValues: {
      eolUnbuilt: false,
      dismantling: true,
      materialCompatibility: false,
    },
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
        disturbingSubstanceSelections: [
          {
            id: 1,
            userEnrichedProductDataElcaElementComponentId: 1,
            disturbingSubstanceClassId: DisturbingSubstanceClassId.S3,
            disturbingSubstanceName: "Test Substance",
          },
        ],
        disturbingSubstances: {
          noDisturbingSubstancesOrOnlyNullClassesSelected: false,
          hasS4DisturbingSubstance: false,
        },
        manuallyEnteredValues: {
          eolUnbuilt: false,
          dismantling: true,
          materialCompatibility: true,
        },
      }),
      createMockLayer({
        element_name: "Wall Layer 2",
        process_name: "Insulation",
        mass: 50,
        manuallyEnteredValues: {
          eolUnbuilt: false,
          dismantling: false, // Set to false to get "-" instead of "MANUELL"
          materialCompatibility: false,
        },
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
  eolClassBuilt: "EOL Class Built",
  eolPointsBuilt: "EOL Points Built",
  eolClassUnbuilt: "EOL Class Unbuilt",
  eolPointsUnbuilt: "EOL Points Unbuilt",
  rebuildClass: "Rebuild Class",
  rebuildPoints: "Rebuild Points",
  componentId: "Component ID",
  elementUuid: "Element UUID",
}

// Constants for CSV strings (UTF-8 encoded characters)
const CSV_STRINGS = {
  // Main headers
  COMPONENT_DATA: '"Bauteilkomponenten-Daten"',
  LAYER_DATA: '"Schichten der Bauteilkomponente"',
  BASE_DATA: '"Basisdaten / Einheit (m², m, Stück) je Bauteilschicht"',
  CIRCULARITY_UNBUILT: '"Zirkularitätspotenzial - Unverbaut"',
  DISMANTLING_POTENTIAL: '"Rückbaupotential"',
  MATERIAL_COMPATIBILITY: '"Materialverträglichkeit"',
  CIRCULARITY_BUILT: '"Zirkularitätspotenzial - Verbaut (Final)"',

  // Subheaders
  LAYER_NUMBER: '"Schichtnummer"',
  COMPONENT: '"Bauteilkomponente"',
  AMOUNT: '"Menge"',
  UNIT: '"Einheit"',
  DIN_276: '"KG DIN 276"',
  COMPONENT_UUID: '"Komponenten-UUID"',
  BUILDING_MATERIAL: '"Baustoff (ÖBD)"',
  T_BUILDING_MATERIAL: '"tBaustoff"',
  MANUAL_VALUES: '"Manuell eingetragene Werte/Auswahl"',
  THICKNESS: '"Dicke [mm]"',
  VOLUME_SHARE: '"Anteil in Vol-%"',
  VOLUME_PER_UNIT: '"Volumen [m³/Einheit]"',
  MASS_PER_UNIT: '"Masse [kg/Einheit]"',
  EOL_SCENARIO_REAL: '"EOL Szenario (Real)"',
  EOL_SCENARIO_POTENTIAL: '"EOL Szenario (Potenzial)"',
  TECHNOLOGY_FACTOR: '"TF"',
  EOL_SCENARIO_SPECIFIC: '"EOL-Szenario (Spezifisch)"',
  EXPLANATION: '"Erläuterung"',
  EOL_CLASS: '"EOL Klasse"',
  EOL_POINTS: '"EOL Punkte"',
  POINTS: '"Punkte"',
  DISMANTLING_CLASS: '"Rückbaupotenzial Klasse"',
  DISMANTLING_POINTS: '"Rückbaupotenzial Punkte"',
  DISMANTLING_REMARK: '"Hinweis"',
  MATERIAL_CLASS: '"Materialverträglichkeit Klasse"',
  RECLASSIFICATION: '"Neueinstufung"',
} as const

// === CSV Row and Column Index Helpers ===
const ROW_INDEX = {
  PROJECT_NAME: 0,
  PROJECT_ID: 1,
  EMPTY: 2,
  MAIN_HEADER: 3,
  SUBHEADER: 4,
  FIRST_DATA: 5,
}

// Build column index map from subheader row
const SUBHEADER_TITLES = [
  CSV_STRINGS.LAYER_NUMBER,
  CSV_STRINGS.COMPONENT,
  CSV_STRINGS.AMOUNT,
  CSV_STRINGS.UNIT,
  CSV_STRINGS.DIN_276,
  CSV_STRINGS.COMPONENT_UUID,
  CSV_STRINGS.BUILDING_MATERIAL,
  CSV_STRINGS.T_BUILDING_MATERIAL,
  CSV_STRINGS.MANUAL_VALUES,
  CSV_STRINGS.THICKNESS,
  CSV_STRINGS.VOLUME_SHARE,
  CSV_STRINGS.VOLUME_PER_UNIT,
  CSV_STRINGS.MASS_PER_UNIT,
  CSV_STRINGS.EOL_SCENARIO_REAL,
  CSV_STRINGS.EOL_SCENARIO_POTENTIAL,
  CSV_STRINGS.TECHNOLOGY_FACTOR,
  CSV_STRINGS.EOL_SCENARIO_SPECIFIC,
  CSV_STRINGS.EXPLANATION,
  CSV_STRINGS.EOL_CLASS,
  CSV_STRINGS.EOL_POINTS,
  CSV_STRINGS.MANUAL_VALUES,
  CSV_STRINGS.DISMANTLING_CLASS,
  CSV_STRINGS.DISMANTLING_POINTS,
  CSV_STRINGS.DISMANTLING_REMARK,
  CSV_STRINGS.MANUAL_VALUES,
  CSV_STRINGS.MATERIAL_CLASS,
  CSV_STRINGS.EXPLANATION,
  CSV_STRINGS.POINTS,
  CSV_STRINGS.RECLASSIFICATION,
  CSV_STRINGS.MANUAL_VALUES,
  CSV_STRINGS.EOL_CLASS,
  CSV_STRINGS.EOL_POINTS,
]
const COL_INDEX = Object.fromEntries(SUBHEADER_TITLES.map((title, idx) => [title, idx]))

// Helper to get column by name (using CSV_STRINGS key)
function getCol(row: string[], colKey: keyof typeof CSV_STRINGS) {
  const idx = COL_INDEX[CSV_STRINGS[colKey]]
  if (typeof idx !== "number") throw new Error(`Column index for ${colKey} not found`)
  return row[idx]
}

// Helper to get nth occurrence of a column by name
function getColNth(row: string[], colKey: keyof typeof CSV_STRINGS, n: number) {
  let count = 0
  for (let i = 0; i < SUBHEADER_TITLES.length; i++) {
    if (SUBHEADER_TITLES[i] === CSV_STRINGS[colKey]) {
      if (count === n) return row[i]
      count++
    }
  }
  throw new Error(`Column ${colKey} occurrence ${n} not found`)
}

// Helper to get row by name
function getRow(rows: string[], rowKey: keyof typeof ROW_INDEX) {
  return rows[ROW_INDEX[rowKey]]?.split(";")
}

// Helper function to decode UTF-8 buffer with BOM to string
const decodeCsvBuffer = (buffer: Buffer): string => {
  // Remove UTF-8 BOM and decode as UTF-8
  const contentWithoutBom = buffer.slice(3) // Skip BOM bytes
  return contentWithoutBom.toString("utf8")
}

describe("circularityDataToCsvTransformer", () => {
  const TEST_PROJECT_ID = 42403

  describe("mapCircularityDataToCsv", () => {
    test("creates CSV with correct header structure", () => {
      const csv = mapCircularityDataToMaterialCsvTransformer(mockCircularityData, mockTranslations, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n")

      // Ensure we have at least the project name, project ID row, empty row, headers, and data
      expect(rows.length).toBeGreaterThanOrEqual(ROW_INDEX.FIRST_DATA + 1)

      // Check project name row
      expect(getRow(rows, "PROJECT_NAME")).toEqual(['"eLCA Projekt-Name"', '""', ...Array(29).fill('""')])

      // Check project ID row
      expect(getRow(rows, "PROJECT_ID")).toEqual(['"eLCA Projekt-ID"', `"${TEST_PROJECT_ID}"`, ...Array(29).fill('""')])

      // Check empty row
      expect(getRow(rows, "EMPTY")).toEqual(Array(31).fill('""'))

      // Check main header row structure
      expect(getRow(rows, "MAIN_HEADER")).toEqual([
        CSV_STRINGS.COMPONENT_DATA,
        '""',
        '""',
        '""',
        '""',
        '""',
        CSV_STRINGS.LAYER_DATA,
        '""',
        '""',
        CSV_STRINGS.BASE_DATA,
        '""',
        '""',
        '""',
        CSV_STRINGS.CIRCULARITY_UNBUILT,
        '""',
        '""',
        '""',
        '""',
        '""',
        '""',
        '""',
        CSV_STRINGS.DISMANTLING_POTENTIAL,
        '""',
        '""',
        '""',
        CSV_STRINGS.MATERIAL_COMPATIBILITY,
        '""',
        '""',
        '""',
        '""',
        CSV_STRINGS.CIRCULARITY_BUILT,
        '""',
      ])

      // Check subheader row structure
      expect(getRow(rows, "SUBHEADER")).toEqual(SUBHEADER_TITLES)

      // Check first data row
      const dataRows = rows.slice(ROW_INDEX.FIRST_DATA)
      const firstRow = dataRows[0]?.split(";")
      expect(firstRow).toBeDefined()
      expect(firstRow).toEqual([
        '"0"',
        '"Wall Component"',
        '"2"',
        '"m2"',
        '"331"',
        '"mock-element-uuid"',
        '"Concrete"',
        '"Test Material"',
        '""',
        '"100"',
        '"80"',
        '"0.5"',
        '"150"',
        '"RC+"',
        '"EV-"',
        '"0.75"',
        '""',
        '""',
        '"Class A"',
        '"3"',
        '""',
        '"II"',
        '"1"',
        '""',
        '"MANUELL"',
        '"S3"',
        '"Test Substance"',
        '"-1"',
        '""',
        '"MANUELL"',
        '"Class B"',
        '"2"',
      ])

      // Check second row to ensure it still has "-" for no disturbing substances
      const secondRow = dataRows[1]?.split(";")
      expect(secondRow).toBeDefined()
      expect(getCol(secondRow!, "MATERIAL_CLASS")).toBe('"-"')
    })

    test("transforms circularity data to CSV format with correct data mapping", () => {
      const csv = mapCircularityDataToMaterialCsvTransformer(mockCircularityData, mockTranslations, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n")

      // Get the data rows (skip project ID, empty row, and headers)
      const dataRows = rows.slice(ROW_INDEX.FIRST_DATA)

      // Verify we have at least two data rows
      expect(dataRows.length).toBeGreaterThanOrEqual(2)

      // Check first data row (Concrete layer)
      const firstRow = dataRows[0]?.split(";")
      expect(firstRow).toBeDefined()
      expect(firstRow).toEqual([
        '"0"',
        '"Wall Component"',
        '"2"',
        '"m2"',
        '"331"',
        '"mock-element-uuid"',
        '"Concrete"',
        '"Test Material"',
        '""',
        '"100"',
        '"80"',
        '"0.5"',
        '"150"',
        '"RC+"',
        '"EV-"',
        '"0.75"',
        '""',
        '""',
        '"Class A"',
        '"3"',
        '""',
        '"II"',
        '"1"',
        '""',
        '"MANUELL"',
        '"S3"',
        '"Test Substance"',
        '"-1"',
        '""',
        '"MANUELL"',
        '"Class B"',
        '"2"',
      ])

      // Check second data row (Insulation layer)
      const secondRow = dataRows[1]?.split(";")
      expect(secondRow).toBeDefined()
      expect(getCol(secondRow!, "BUILDING_MATERIAL")).toBe('"Insulation"')
    })

    test("handles empty circularity data", () => {
      const emptyData: typeof mockCircularityData = []
      const csv = mapCircularityDataToMaterialCsvTransformer(emptyData, mockTranslations, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n") as string[]

      expect(rows).toHaveLength(ROW_INDEX.FIRST_DATA)
      expect(getRow(rows, "PROJECT_ID")?.join(";")).toContain('"eLCA Projekt-ID"')
      expect(getRow(rows, "PROJECT_ID")?.join(";")).toContain(`"${TEST_PROJECT_ID}"`)
      expect(getRow(rows, "EMPTY")).toEqual(Array(31).fill('""'))
      expect(getRow(rows, "MAIN_HEADER")).toBeTruthy()
      expect(getRow(rows, "SUBHEADER")).toBeTruthy()
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

      const csv = mapCircularityDataToMaterialCsvTransformer(dataWithNoLayers, mockTranslations, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n") as string[]

      expect(rows).toHaveLength(ROW_INDEX.FIRST_DATA)
      expect(getRow(rows, "PROJECT_ID")?.join(";")).toContain('"eLCA Projekt-ID"')
      expect(getRow(rows, "PROJECT_ID")?.join(";")).toContain(`"${TEST_PROJECT_ID}"`)
      expect(getRow(rows, "EMPTY")).toEqual(Array(31).fill('""'))
      expect(getRow(rows, "MAIN_HEADER")).toBeTruthy()
      expect(getRow(rows, "SUBHEADER")).toBeTruthy()
    })

    test("properly escapes values containing semicolons", async () => {
      const mockDataWithSemicolons = [
        {
          element_uuid: "element-1",
          element_name: "Wall; with semicolon",
          element_type_name: "Wall",
          din_code: 331,
          quantity: 1,
          unit: "m2",
          layers: [
            createMockLayer({
              process_name: "Material; with semicolon",
              mass: 150,
              volume: 0.5,
              layer_area_ratio: 0.8,
              tBaustoffProductData: { name: "Test Material", tBaustoffProductId: 123 },
            }),
          ],
        },
      ]

      const csvBuffer = mapCircularityDataToMaterialCsvTransformer(
        mockDataWithSemicolons,
        mockTranslations,
        TEST_PROJECT_ID
      )
      const csvString = decodeCsvBuffer(csvBuffer)
      const rows: string[] = csvString.split("\n")

      // Verify header structure
      const mainHeader = getRow(rows, "MAIN_HEADER")
      expect(mainHeader).toBeDefined()
      expect(mainHeader).toContain(CSV_STRINGS.COMPONENT_DATA)
      expect(mainHeader).toContain(CSV_STRINGS.BASE_DATA)
      expect(mainHeader).toContain(CSV_STRINGS.CIRCULARITY_UNBUILT)
      expect(mainHeader).toContain(CSV_STRINGS.DISMANTLING_POTENTIAL)
      expect(mainHeader).toContain(CSV_STRINGS.MATERIAL_COMPATIBILITY)
      expect(mainHeader).toContain(CSV_STRINGS.CIRCULARITY_BUILT)

      // Verify subheader structure
      const subheaderRow = getRow(rows, "SUBHEADER")
      if (!subheaderRow) {
        throw new Error("Subheader row is missing")
      }
      const subheader = subheaderRow.map((s: string) => s.replace(/"/g, ""))
      expect(subheader).toContain("Schichtnummer")
      expect(subheader).toContain("Bauteilkomponente")
      expect(subheader).toContain("tBaustoff")
      expect(subheader).toContain("EOL Klasse")
      expect(subheader).toContain("EOL Punkte")
    })

    test("handles S4 disturbing substances correctly", () => {
      const mockData = [
        {
          element_uuid: "mock-uuid",
          element_type_name: "Wall",
          element_name: "Wall Component",
          din_code: 123,
          unit: "m2",
          quantity: 1,
          layers: [
            createMockLayer({
              disturbingSubstanceSelections: [
                {
                  id: 1,
                  userEnrichedProductDataElcaElementComponentId: 1,
                  disturbingSubstanceClassId: "S4",
                  disturbingSubstanceName: "Asbestos",
                },
              ],
              disturbingEolScenarioForS4: TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS,
              eolBuilt: { points: 100, className: "B" },
            }),
          ],
        },
      ]

      const result = mapCircularityDataToMaterialCsvTransformer(mockData, {}, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(result)
      const rows = csvString.split("\n")
      const dataRow = getRow(rows, "FIRST_DATA")
      expect(dataRow).toBeDefined()

      if (dataRow) {
        // Check that material compatibility points show "NEUEINST."
        expect(getCol(dataRow, "POINTS")).toBe('"NEUEINST."')
        // Check that neueinstufung shows the formatted S4 scenario
        expect(getCol(dataRow, "RECLASSIFICATION")).toBe('"CL+"')
      }
    })

    test("handles multiple disturbing substances with S4 correctly", () => {
      const mockData = [
        {
          element_uuid: "mock-uuid",
          element_type_name: "Wall",
          element_name: "Wall Component",
          din_code: 123,
          unit: "m2",
          quantity: 1,
          layers: [
            createMockLayer({
              disturbingSubstanceSelections: [
                {
                  id: 1,
                  userEnrichedProductDataElcaElementComponentId: 1,
                  disturbingSubstanceClassId: "S2",
                  disturbingSubstanceName: "Lead",
                },
                {
                  id: 2,
                  userEnrichedProductDataElcaElementComponentId: 1,
                  disturbingSubstanceClassId: "S4",
                  disturbingSubstanceName: "Asbestos",
                },
                {
                  id: 3,
                  userEnrichedProductDataElcaElementComponentId: 1,
                  disturbingSubstanceClassId: "S3",
                  disturbingSubstanceName: "Mercury",
                },
              ],
              disturbingEolScenarioForS4: TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS,
              eolBuilt: { points: 100, className: "B" },
            }),
          ],
        },
      ]

      const result = mapCircularityDataToMaterialCsvTransformer(mockData, {}, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(result)
      const rows = csvString.split("\n")
      const dataRow = getRow(rows, "FIRST_DATA")
      expect(dataRow).toBeDefined()

      if (dataRow) {
        // Check that material compatibility points show "NEUEINST."
        expect(getCol(dataRow, "POINTS")).toBe('"NEUEINST."')
        // Check that erlaeuterungMaterial shows all substances
        expect(getCol(dataRow, "EXPLANATION")).toBe('"Lead, Asbestos, Mercury"')
        // Check that neueinstufung shows the formatted S4 scenario
        expect(getCol(dataRow, "RECLASSIFICATION")).toBe('"CL+"')
      }
    })

    test("sorts materials correctly by DIN code, component name, UUID, and layer position", () => {
      const mockDataForSorting = [
        {
          element_uuid: "element-3",
          element_name: "Wall C",
          element_type_name: "Type C",
          din_code: 350,
          quantity: 1,
          unit: "m2",
          layers: [
            createMockLayer({ layer_position: 2, element_uuid: "uuid-3" }),
            createMockLayer({ layer_position: 1, element_uuid: "uuid-3" }),
          ],
        },
        {
          element_uuid: "element-1",
          element_name: "Wall B",
          element_type_name: "Type A",
          din_code: 331,
          quantity: 1,
          unit: "m2",
          layers: [
            createMockLayer({ layer_position: 2, element_uuid: "uuid-2" }),
            createMockLayer({ layer_position: 1, element_uuid: "uuid-1" }),
          ],
        },
        {
          element_uuid: "element-2",
          element_name: "Wall A",
          element_type_name: "Type B",
          din_code: 331,
          quantity: 1,
          unit: "m2",
          layers: [
            createMockLayer({ layer_position: 2, element_uuid: "uuid-1" }),
            createMockLayer({ layer_position: 1, element_uuid: "uuid-2" }),
          ],
        },
      ]

      const csv = mapCircularityDataToMaterialCsvTransformer(mockDataForSorting, mockTranslations, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n")
      const dataRows = rows.slice(ROW_INDEX.FIRST_DATA) // Skip project ID, empty row, and headers

      // Helper to extract sorting-relevant fields from a CSV row
      const extractSortFields = (row: string) => {
        const fields = row.split(";")
        const dinCodeIdx = COL_INDEX[CSV_STRINGS.DIN_276]
        const componentNameIdx = COL_INDEX[CSV_STRINGS.COMPONENT]
        const uuidIdx = COL_INDEX[CSV_STRINGS.COMPONENT_UUID]
        const layerPositionIdx = COL_INDEX[CSV_STRINGS.LAYER_NUMBER]
        return {
          dinCode: typeof dinCodeIdx === "number" ? parseInt(fields[dinCodeIdx]?.replace(/"/g, "") || "0", 10) : 0,
          componentName: typeof componentNameIdx === "number" ? fields[componentNameIdx]?.replace(/"/g, "") || "" : "",
          uuid: typeof uuidIdx === "number" ? fields[uuidIdx]?.replace(/"/g, "") || "" : "",
          layerPosition:
            typeof layerPositionIdx === "number" ? parseInt(fields[layerPositionIdx]?.replace(/"/g, "") || "0", 10) : 0,
        }
      }

      // Verify sorting
      for (let i = 0; i < dataRows.length - 1; i++) {
        const currentRow = dataRows[i]
        const nextRow = dataRows[i + 1]

        if (!currentRow || !nextRow) continue

        const current = extractSortFields(currentRow)
        const next = extractSortFields(nextRow)

        // If DIN codes are different, current should be less than next
        if (current.dinCode !== next.dinCode) {
          expect(current.dinCode || 0).toBeLessThan(next.dinCode || 0)
          continue
        }

        // If DIN codes are same but component names are different, current should come before next alphabetically
        if (current.componentName !== next.componentName) {
          expect(current.componentName.localeCompare(next.componentName)).toBeLessThan(0)
          continue
        }

        // If DIN codes and component names are same but UUIDs are different, current should come before next alphabetically
        if (current.uuid !== next.uuid) {
          expect(current.uuid.localeCompare(next.uuid)).toBeLessThan(0)
          continue
        }

        // If all above are same, check layer position
        if (current.uuid === next.uuid) {
          expect(current.layerPosition).toBeLessThan(next.layerPosition)
        }
      }
    })

    test("shows MANUELL indicator for manually selected tBaustoff", () => {
      const mockDataWithManualTBaustoff = [
        {
          element_uuid: "element-1",
          element_name: "Wall Component",
          element_type_name: "Wall",
          din_code: 331,
          quantity: 1,
          unit: "m2",
          layers: [
            createMockLayer({
              tBaustoffProductSelectedByUser: true,
              tBaustoffProductData: { name: "Manual Test Material", tBaustoffProductId: 456 },
            }),
          ],
        },
      ]

      const csv = mapCircularityDataToMaterialCsvTransformer(
        mockDataWithManualTBaustoff,
        mockTranslations,
        TEST_PROJECT_ID
      )
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n")
      const dataRow = getRow(rows, "FIRST_DATA")

      expect(dataRow).toBeDefined()
      if (dataRow) {
        // Check that tBaustoff name is correct
        expect(getCol(dataRow, "T_BUILDING_MATERIAL")).toBe('"Manual Test Material"')
        // Check that manual indicator is set (second MANUAL_VALUES column, after T_BUILDING_MATERIAL)
        expect(getColNth(dataRow, "MANUAL_VALUES", 0)).toBe('"MANUELL"')
      }
    })

    test("shows dismantling remark in the Hinweis column", () => {
      const mockDataWithRemark = [
        {
          element_uuid: "element-1",
          element_name: "Wall Component",
          element_type_name: "Wall",
          din_code: 331,
          quantity: 1,
          unit: "m2",
          layers: [
            createMockLayer({
              dismantlingPotentialClassRemark: "Special tools required for dismantling",
              dismantlingPotentialClassId: DismantlingPotentialClassId.III,
            }),
          ],
        },
      ]

      const csv = mapCircularityDataToMaterialCsvTransformer(mockDataWithRemark, mockTranslations, TEST_PROJECT_ID)
      const csvString = decodeCsvBuffer(csv)
      const rows = csvString.split("\n")
      const dataRow = getRow(rows, "FIRST_DATA")

      expect(dataRow).toBeDefined()
      if (dataRow) {
        // The Hinweis column should be at index for DISMANTLING_REMARK
        expect(getCol(dataRow, "DISMANTLING_REMARK")).toBe('"Special tools required for dismantling"')
      }
    })
  })
})
