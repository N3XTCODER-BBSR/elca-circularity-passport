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

import { DisturbingSubstanceClassId } from "prisma/generated/client"
import isLayerIncompleteAndNotExcluded from "./isLayerIncompleteAndNotExcluded"
import { CalculateCircularityDataForLayerReturnType } from "../circularity/utils/calculate-circularity-data-for-layer"

// Build a minimal valid layer object and override per test
const baseLayer = (): CalculateCircularityDataForLayerReturnType => ({
  // EnrichedElcaElementComponent base
  component_id: 1,
  element_uuid: "uuid",
  is_layer: true,
  layer_position: 1,
  process_name: "proc",
  oekobaudat_process_uuid: "p-uuid",
  pdb_name: "pdb",
  pdb_version: "v1",
  oekobaudat_process_db_uuid: "db-uuid",
  element_name: "elem",
  unit: "m2",
  productUnit: "m2",
  productQuantity: 1,
  quantity: 1,
  layer_size: 1,
  layer_length: 1,
  layer_width: 1,
  layer_area_ratio: 1,
  process_config_density: 1,
  process_config_id: 1,
  process_config_name: "cfg",
  process_category_node_id: 1,
  process_category_ref_num: "1",
  mass: 1,
  volume: 1,
  isExcluded: false,
  isLayer: true,
  tBaustoffProductSelectedByUser: false,
  tBaustoffProductData: null,
  dismantlingPotentialClassId: null,
  dismantlingPotentialClassRemark: null,
  eolUnbuiltSpecificScenario: null,
  eolUnbuiltSpecificScenarioProofText: null,
  disturbingSubstanceSelections: [],
  disturbingEolScenarioForS4: null,

  // calculate-circularity-data-for-layer additions
  dismantlingPoints: 10,
  disturbingSubstances: {
    noDisturbingSubstancesOrOnlyNullClassesSelected: true,
    hasS4DisturbingSubstance: false,
  },
  eolUnbuilt: { specificOrTotal: "Total" as any, points: 10, className: "B" },
  eolBuilt: { points: 10, className: "B" },
  eolScenarioReal: null,
  eolScenarioPotential: null,
  technologyFactor: null,
  manuallyEnteredValues: { eolUnbuilt: false, dismantling: false, materialCompatibility: false },
})

describe("isLayerIncompleteAndNotExcluded", () => {
  test("returns false when excluded, even if fields are missing", () => {
    const layer = baseLayer()
    layer.isExcluded = true
    layer.volume = null
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(false)
  })

  test("returns true when volume is null", () => {
    const layer = baseLayer()
    layer.volume = null
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(true)
  })

  test("returns true when dismantlingPoints is null", () => {
    const layer = baseLayer()
    layer.dismantlingPoints = null
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(true)
  })

  test("returns true when eolBuilt.points is null (eolBuilt present)", () => {
    const layer = baseLayer()
    layer.eolBuilt = { points: undefined as unknown as number, className: "B" }
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(true)
  })

  test("returns true when eolBuilt is null", () => {
    const layer = baseLayer()
    layer.eolBuilt = null
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(true)
  })

  test("returns true when any disturbingSubstanceSelection has null class id", () => {
    const layer = baseLayer()
    layer.disturbingSubstanceSelections = [
      {
        id: 1,
        userEnrichedProductDataElcaElementComponentId: 1,
        disturbingSubstanceClassId: null,
        disturbingSubstanceName: null,
      },
    ]
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(true)
  })

  test("returns false when all required fields are present and valid", () => {
    const layer = baseLayer()
    layer.volume = 5
    layer.dismantlingPoints = 20
    layer.eolBuilt = { points: 30, className: "A" }
    layer.disturbingSubstanceSelections = [
      {
        id: 2,
        userEnrichedProductDataElcaElementComponentId: 1,
        disturbingSubstanceClassId: DisturbingSubstanceClassId.S1,
        disturbingSubstanceName: "S1",
      },
    ]
    expect(isLayerIncompleteAndNotExcluded(layer)).toBe(false)
  })
})
