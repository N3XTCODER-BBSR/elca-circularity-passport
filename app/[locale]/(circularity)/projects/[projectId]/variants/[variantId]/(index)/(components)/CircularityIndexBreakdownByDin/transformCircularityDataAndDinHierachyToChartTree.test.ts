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
// transformCircularityDataAndDinHierachyToChartTree.test.ts

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { DisturbingSubstanceSelection } from "prisma/generated/client"
import { ChartDataInternalNode, ChartDataLeaf } from "./ChartAndBreadCrumbComponent"
import { transformCircularityDataAndDinHierachyToChartTree } from "./transformCircularityDataAndDinHierachyToChartTree"

/**
 * Helper to create a mock layer object for testing.
 * We allow partial overrides to set things like mass, circularityIndex, etc.
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

// Example test data with multiple DIN codes
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
    const root = transformCircularityDataAndDinHierachyToChartTree(
      singleCategoryData,
      "mass",
      "Single Category Project",
      true
    )
    expect(root.label).toBe("Single Category Project")
    expect(root.isLeaf).toBe(false)
    const children = (root as ChartDataInternalNode).children
    expect(children.length).toBe(1)
    // Because skipRootNode flattened the structure, the child is not a "intermediate" node but effectively the next level
    const leaf = children[0] as ChartDataLeaf
    expect(leaf.label).toBe("340: Innenwände") // From the real din276Hierarchy data
    // We expect the dimensionalValue = quantity(4) * mass(80) = 320
    expect(leaf.dimensionalValue).toBe(320)
    expect(leaf.metricValue).toBe(0.8)
  })

  test("handles scenario with no matching DIN codes (empty after filtering)", () => {
    const noMatchData = circularityData.filter((d) => d.din_code === 9999) // A DIN code that doesn't exist
    const root = transformCircularityDataAndDinHierachyToChartTree(noMatchData, "mass", "No Matches", true)
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
    const root = transformCircularityDataAndDinHierachyToChartTree(modifiedData, "mass", "Null Circularity", false)
    // Expect zero metric because null is treated as 0
    expect(root.metricValue).toBe(0)
  })

  test("handles layers with zero mass", () => {
    const zeroMassData = circularityData.map((d) => ({
      ...d,
      layers: d.layers.map((l) => ({ ...l, mass: 0 })),
    }))
    const root = transformCircularityDataAndDinHierachyToChartTree(zeroMassData, "mass", "Zero Mass Project", false)
    // Expect no meaningful average if all masses are zero
    expect(root.metricValue).toBe(0)
    expect(root.dimensionalValue).toBe(0)
  })

  test("handles multiple top-level categories with skipRootNode=true (no flattening)", () => {
    const root = transformCircularityDataAndDinHierachyToChartTree(
      circularityData,
      "mass",
      "Multiple Categories Project",
      true
    )
    // Expect multiple top-level categories, so no flattening:
    expect(root.label).toBe("Multiple Categories Project")
    const children = (root as ChartDataInternalNode).children
    expect(children.length).toBeGreaterThan(1)
  })

  test("handles a scenario where all layers have the same circularityIndex", () => {
    const uniformIndexData = circularityData.map((d) => ({
      ...d,
      layers: d.layers.map((l) => ({ ...l, circularityIndex: 0.7 })),
      quantity: 2,
    }))
    const root = transformCircularityDataAndDinHierachyToChartTree(
      uniformIndexData,
      "mass",
      "Uniform Circularity",
      false
    )
    // If all are the same, the metricValue at top should match 0.7
    expect(root.metricValue).toBeCloseTo(0.7)
    const children = (root as ChartDataInternalNode).children
    for (const child of children) {
      expect(child.metricValue).toBeCloseTo(0.7)
    }
  })

  /**
   * TEST to ensure we don't get duplicates when multiple layers refer to the *same* element.
   * We create an element with multiple layers, all having the same element_uuid, and confirm
   * that there's exactly ONE leaf node in the final tree for that element.
   */
  test("merges multiple layers for the same element into a single leaf node (no duplicates)", () => {
    const multiLayerElement = {
      element_uuid: "dbdec081-20c9-4432-b47c-29f5c7b170eb",
      element_name: "Composite Outer Wall",
      element_type_name: "Tragende Außenwände",
      din_code: 331, // e.g. "Tragende Außenwände"
      quantity: 1,
      unit: "m2",
      layers: [
        createMockLayer({ element_name: "Layer 1", din_code: 331, mass: 10, circularityIndex: 0.9 }),
        createMockLayer({ element_name: "Layer 2", din_code: 331, mass: 20, circularityIndex: 0.5 }),
        createMockLayer({ element_name: "Layer 3", din_code: 331, mass: 15, circularityIndex: 0.75 }),
      ],
    }

    // We add this multi-layer element to our test data (plus at least one other item).
    const customData = [
      multiLayerElement,
      {
        element_uuid: "another-element-uuid",
        element_name: "Some Other Element",
        element_type_name: "Tragende Außenwände",
        din_code: 331,
        quantity: 2,
        unit: "m2",
        layers: [createMockLayer({ element_name: "Something else", din_code: 331, mass: 10, circularityIndex: 0.5 })],
      },
    ]

    const root = transformCircularityDataAndDinHierachyToChartTree(customData, "mass", "DupCheck Project", false)
    expect(root.label).toBe("DupCheck Project")

    // We'll gather all leaves from the entire tree
    function gatherLeaves(node: ChartDataInternalNode): ChartDataLeaf[] {
      const result: ChartDataLeaf[] = []
      for (const child of node.children) {
        if (child.isLeaf) {
          result.push(child)
        } else {
          result.push(...gatherLeaves(child))
        }
      }
      return result
    }

    // We know root is an internal node, so let's collect all leaf nodes
    const leaves = gatherLeaves(root as ChartDataInternalNode)

    // We expect to find exactly ONE leaf that has resourceId == "dbdec081-20c9-4432-b47c-29f5c7b170eb"
    const matchingLeaves = leaves.filter((leaf) => leaf.resourceId === "dbdec081-20c9-4432-b47c-29f5c7b170eb")
    expect(matchingLeaves.length).toBe(1)

    // That single leaf should have aggregated mass = 10 + 20 + 15 = 45,
    // weighted average CI = (10*0.9 + 20*0.5 + 15*0.75) / 45
    // => = (9 + 10 + 11.25) / 45 = 30.25 / 45 ≈ 0.6722
    const leaf = matchingLeaves[0]
    expect(leaf.dimensionalValue).toBe(45)
    expect(leaf.metricValue).toBeCloseTo(0.6722, 4)
  })
})
