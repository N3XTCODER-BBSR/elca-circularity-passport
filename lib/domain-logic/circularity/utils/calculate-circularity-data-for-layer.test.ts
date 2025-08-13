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

import calculateCircularityDataForLayer, {
  CalculateCircularityDataForLayerReturnType,
} from "./calculate-circularity-data-for-layer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { DismantlingPotentialClassId, DisturbingSubstanceClassId } from "prisma/generated/client"

// Mock the dismantling potential class mapping
const dismantlingPotentialClassIdMapping = {
  I: { points: 100 },
  II: { points: 75 },
  III: { points: 50 },
  IV: { points: 25 },
} as const

// Mock the calculateEolBuiltData function
jest.mock("./calculateEolBuiltPoints", () => ({
  __esModule: true,
  default: jest.fn(() => ({ points: 80, className: "B" })),
}))

describe("calculateCircularityDataForLayer", () => {
  const mockLayerData: EnrichedElcaElementComponent = {
    component_id: 1,
    element_uuid: "test-uuid",
    is_layer: true,
    layer_position: 1,
    process_name: "Test Process",
    oekobaudat_process_uuid: "test-uuid",
    pdb_name: "Test PDB",
    pdb_version: "2024-Q4",
    oekobaudat_process_db_uuid: "test-db-uuid",
    element_name: "Test Element",
    unit: "m²",
    productUnit: "m²",
    productQuantity: 10,
    quantity: 10,
    layer_size: 0.1,
    layer_length: 10,
    layer_width: 10,
    layer_area_ratio: 1,
    process_config_density: 1000,
    process_config_id: 1,
    process_config_name: "Test Config",
    process_category_node_id: 1,
    process_category_ref_num: "1.1",
    mass: 100,
    volume: 0.1,
    isExcluded: false,
    isLayer: true,
    tBaustoffProductSelectedByUser: false,
    eolUnbuiltSpecificScenarioProofText: null,
    disturbingSubstanceSelections: [],
    disturbingEolScenarioForS4: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("should use stored technology factor from database when available", () => {
    const layerDataWithEolData = {
      ...mockLayerData,
      tBaustoffProductData: {
        tBaustoffProductId: 1,
        name: "Test Product",
        eolData: {
          eolUnbuiltRealScenario: "RC+" as any,
          eolUnbuiltRealPoints: 100,
          eolUnbuiltRealClassName: "B" as any,
          eolUnbuiltPotentialScenario: "CL+" as any,
          eolUnbuiltPotentialPoints: 75,
          eolUnbuiltPotentialClassName: "C" as any,
          eolUnbuiltTotalPoints: 87.5,
          eolUnbuiltTotalClassName: "B" as any,
          technologyFactor: 0.75, // Valid technology factor
        },
      },
    }

    const result = calculateCircularityDataForLayer(layerDataWithEolData)

    expect(result.technologyFactor).toBe(0.75)
  })

  test("should return null technology factor when no EOL data is available", () => {
    const result = calculateCircularityDataForLayer(mockLayerData)

    expect(result.technologyFactor).toBeNull()
  })

  test("should handle dismantling potential class correctly", () => {
    const layerDataWithDismantling = {
      ...mockLayerData,
      dismantlingPotentialClassId: DismantlingPotentialClassId.II,
    }

    const result = calculateCircularityDataForLayer(layerDataWithDismantling)

    expect(result.dismantlingPoints).toBe(75)
  })

  test("should handle disturbing substances correctly", () => {
    const layerDataWithDisturbingSubstances = {
      ...mockLayerData,
      disturbingSubstanceSelections: [
        {
          id: 1,
          userEnrichedProductDataElcaElementComponentId: 1,
          disturbingSubstanceClassId: DisturbingSubstanceClassId.S1,
          disturbingSubstanceName: "Test Substance",
        },
      ],
    }

    const result = calculateCircularityDataForLayer(layerDataWithDisturbingSubstances)

    expect(result.disturbingSubstances.noDisturbingSubstancesOrOnlyNullClassesSelected).toBe(false)
    expect(result.disturbingSubstances.hasS4DisturbingSubstance).toBe(false)
  })
})
