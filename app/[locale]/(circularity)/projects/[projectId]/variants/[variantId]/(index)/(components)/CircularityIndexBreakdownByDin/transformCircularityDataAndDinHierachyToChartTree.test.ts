// transformCircularityDataAndDinHierachyToChartTree.test.ts

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { DisturbingSubstanceSelection } from "prisma/generated/client"
import { ChartDataInternalNode, ChartDataLeaf } from "./ChartAndBreadCrumbComponent"
import { transformCircularityDataAndDinHierachyToChartTree } from "./transformCircularityDataAndDinHierachyToChartTree"

// Define a helper function to create a mock layer
function createMockLayer(
  overrides: Partial<CalculateCircularityDataForLayerReturnType> = {}
): CalculateCircularityDataForLayerReturnType {
  return {
    component_id: 1,
    element_uuid: "mock-element-uuid",
    layer_position: 0,
    process_name: "mock-process",
    oekobaudat_process_uuid: undefined,
    pdb_name: undefined,
    pdb_version: null,
    oekobaudat_process_db_uuid: undefined,
    element_name: "Mock Layer",
    element_type_name: "Mock Element Type",
    din_code: 321,
    unit: "m2",
    quantity: 1,
    layer_size: null,
    layer_length: null,
    layer_width: null,
    process_config_density: null,
    process_config_name: "mock-config",
    process_category_node_id: 999,
    process_config_id: null,
    process_category_ref_num: null,

    mass: 100,
    volume: null,
    isExcluded: false,
    tBaustoffProductSelectedByUser: false,
    tBaustoffProductData: undefined,
    dismantlingPotentialClassId: null,
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
    eolUnbuilt: null,
    eolBuilt: { points: 2, className: "someClass" },
    ...overrides,
  }
}

const circularityData = [
  {
    element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
    element_name: "Fundament 1",
    element_type_name: "Baugrundverbesserung",
    din_code: 321,
    quantity: 2,
    unit: "m2",
    layers: [
      createMockLayer({ element_name: "Fundament Layer A", mass: 100, circularityIndex: 0.75 }),
      createMockLayer({ element_name: "Fundament Layer B", mass: 50, circularityIndex: 0.9 }),
      createMockLayer({ element_name: "Fundament Layer C", mass: 50, circularityIndex: 0.6 }),
    ],
  },
  {
    element_uuid: "1b9ead66-2911-4b60-983b-0eeb118d6837",
    element_name: "Aussenwand Test 1",
    element_type_name: "Außenstützen",
    din_code: 333,
    quantity: 3,
    unit: "m2",
    layers: [
      createMockLayer({ element_name: "Außenstütze Layer A", din_code: 333, mass: 200, circularityIndex: 0.5 }),
      createMockLayer({ element_name: "Außenstütze Layer B", din_code: 333, mass: 100, circularityIndex: 0.4 }),
    ],
  },
  {
    element_uuid: "8c4e5bae-c5f6-4fdf-b869-b3431a4497d8",
    element_name: "Test",
    element_type_name: "Tragende Innenwände",
    din_code: 341,
    quantity: 4,
    unit: "Stück",
    layers: [createMockLayer({ element_name: "Innenwand Layer A", din_code: 341, mass: 80, circularityIndex: 0.8 })],
  },
  {
    element_uuid: "17517962-b544-4433-b4bc-49aa101814ab",
    element_name: "Aussenwand Test 2",
    element_type_name: "Außentüren und -fenster",
    din_code: 334,
    quantity: 5,
    unit: "m2",
    layers: [
      createMockLayer({ element_name: "Außentür Layer A", din_code: 334, mass: 120, circularityIndex: 0.7 }),
      createMockLayer({ element_name: "Außentür Layer B", din_code: 334, mass: 80, circularityIndex: 0.9 }),
    ],
  },
]

describe("transformCircularityDataAndDinHierachyToChartTree", () => {
  test("skipRootNode=true flattens single top-level node", () => {
    // Filter so we only have DIN code 341 (Tragende Innenwände)
    const singleCategoryData = circularityData.filter((d) => d.din_code === 341)
    const root = transformCircularityDataAndDinHierachyToChartTree(singleCategoryData, "Single Category Project", true)
    expect(root.label).toBe("Single Category Project")
    expect(root.isLeaf).toBe(false)
    const children = (root as ChartDataInternalNode).children
    expect(children.length).toBe(1)
    const leaf = children[0] as ChartDataLeaf
    expect(leaf.label).toBe("340: Innenwände")
    expect(leaf.metricValue).toBe(0.8)
    expect(leaf.dimensionalValue).toBe(320) // expect 4 * 80 (quantity * mass)
  })
  test("handles scenario with no matching DIN codes (empty after filtering)", () => {
    const noMatchData = circularityData.filter((d) => d.din_code === 9999) // A DIN code that doesn't exist
    const root = transformCircularityDataAndDinHierachyToChartTree(noMatchData, "No Matches", true)
    expect(root.label).toBe("No Matches")
    expect(root.isLeaf).toBe(false)
    expect((root as ChartDataInternalNode).children.length).toBe(0)
    expect(root.metricValue).toBe(0)
    expect(root.dimensionalValue).toBe(0)
  })

  test("handles layers with circularityIndex = null", () => {
    const modifiedData = circularityData.map((d) => ({
      ...d,
      layers: d.layers.map((l) => ({ ...l, circularityIndex: null })),
    }))
    const root = transformCircularityDataAndDinHierachyToChartTree(modifiedData, "Null Circularity", false)
    // Expect zero metric because null treated as 0
    expect(root.metricValue).toBe(0)
  })

  test("handles layers with zero mass", () => {
    const zeroMassData = circularityData.map((d) => ({
      ...d,
      layers: d.layers.map((l) => ({ ...l, mass: 0 })),
    }))
    const root = transformCircularityDataAndDinHierachyToChartTree(zeroMassData, "Zero Mass Project", false)
    // Expect no meaningful averages if all masses are zero; metric likely 0
    expect(root.metricValue).toBe(0)
    expect(root.dimensionalValue).toBe(0)
  })

  test("handles multiple top-level categories with skipRootNode=true (no flattening)", () => {
    const root = transformCircularityDataAndDinHierachyToChartTree(circularityData, "Multiple Categories Project", true)
    // Expect multiple top-level categories, so no flattening:
    const children = (root as ChartDataInternalNode).children
    expect(children.length).toBeGreaterThan(1)
    expect(root.label).toBe("Multiple Categories Project")
  })

  test("handles a scenario where all layers have the same circularityIndex", () => {
    const uniformIndexData = circularityData.map((d) => ({
      ...d,
      layers: d.layers.map((l) => ({ ...l, circularityIndex: 0.7 })),
      quantity: 2,
    }))
    const root = transformCircularityDataAndDinHierachyToChartTree(uniformIndexData, "Uniform Circularity", false)
    // If all are the same, the metricValue at top should match 0.7
    expect(root.metricValue).toBeCloseTo(0.7)
    const children = (root as ChartDataInternalNode).children
    for (const child of children) {
      expect(child.metricValue).toBeCloseTo(0.7)
    }
  })
})
