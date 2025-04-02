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
import { DismantlingPotentialClassId } from "prisma/generated/client"
import { resetDb } from "tests/utils"
import { preloadCircularityData } from "./preloadCircularityData"
import { upsertUserEnrichedProductDataByLayerId } from "../dismantling/updateDismantlingData"
import { addOrUpdateDisturbingSubstance } from "../disturbingSubstances/manageDisturbingSubstances"
import { updateProductTBaustoffAndRemoveDisturbingSubstances } from "../products/manageProductData"
import { toggleExcludedProduct } from "../products/manageProductExclusion"

const components = [
  {
    access_group_id: 3,
    element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
    component_id: 5,
    layer_position: 1,
    is_layer: true,
    process_name: "Beton der Druckfestigkeitsklasse C 30/37",
    oekobaudat_process_uuid: "b6096c9c-1248-4ce1-9c2d-f4a48aade80f",
    pdb_name: "copy of OBD_2023_I for import in eLCA",
    pdb_version: "v1",
    oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
    element_name: "Fundament 1",
    unit: "m2",
    productUnit: "m3",
    productQuantity: 1,
    element_component_id: 5,
    quantity: 1,
    layer_size: 0.3,
    layer_length: 1,
    layer_width: 1,
    layer_area_ratio: 1,
    process_config_density: null,
    process_config_id: 45,
    process_config_name: "Beton der Druckfestigkeitsklasse C 30/37",
    process_category_node_id: 617,
    process_category_ref_num: "1.04",
  },
  {
    access_group_id: 3,
    element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
    component_id: 6,
    layer_position: 2,
    is_layer: true,
    process_name: "Keramische Fassadenplatte TONALITY®",
    oekobaudat_process_uuid: "bb51d66a-b04b-4ec7-8947-185e9697e671",
    pdb_name: "copy of OBD_2023_I for import in eLCA",
    pdb_version: "v1",
    oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
    element_name: "Fundament 1",
    unit: "m2",
    productUnit: "m3",
    productQuantity: 1,
    element_component_id: 6,
    quantity: 1,
    layer_size: 0.5,
    layer_length: 1,
    layer_width: 1,
    layer_area_ratio: 0.23,
    process_config_density: null,
    process_config_id: 377,
    process_config_name: "Keramische Fassadenplatte TONALITY®",
    process_category_node_id: 616,
    process_category_ref_num: "1.03",
  },
  {
    access_group_id: 3,
    element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
    component_id: 7,
    layer_position: 3,
    is_layer: true,
    process_name: "Kunststoffprofil SBR",
    oekobaudat_process_uuid: "1b69b3a2-3164-436b-a934-ed7d926f5f53",
    pdb_name: "copy of OBD_2023_I for import in eLCA",
    pdb_version: "v1",
    oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
    element_name: "Fundament 1",
    unit: "m2",
    productUnit: "m3",
    productQuantity: 1,
    element_component_id: 7,
    quantity: 1,
    layer_size: 0.302,
    layer_length: 1,
    layer_width: 1,
    layer_area_ratio: 1,
    process_config_density: null,
    process_config_id: 410,
    process_config_name: "Kunststoffprofil SBR",
    process_category_node_id: 664,
    process_category_ref_num: "6.04",
  },
]

describe("preloadCircularityData", () => {
  beforeEach(async () => {
    await resetDb()
  })
  afterEach(async () => {
    await resetDb()
  })

  it("should preload the circularity data", async () => {
    const result = await preloadCircularityData(components)

    expect(result.excludedProductIdsSet.size).toBe(0)
    expect(result.userEnrichedMap.size).toBe(0)
    expect(result.tBaustoffMappingEntriesMap.size).toBe(1)
    expect(result.tBaustoffProductMap.size).toBe(1)
    expect(result.productMassMap.size).toBe(3)
  })

  it("should preload the circularity data with user enriched data", async () => {
    await updateProductTBaustoffAndRemoveDisturbingSubstances(5, 3)
    await upsertUserEnrichedProductDataByLayerId(5, DismantlingPotentialClassId.II)
    await addOrUpdateDisturbingSubstance(5, 1, 1, {
      id: null,
      userEnrichedProductDataElcaElementComponentId: 5,
      disturbingSubstanceClassId: DisturbingSubstanceClassId.S2,
      disturbingSubstanceName: "",
    })

    const result = await preloadCircularityData(components)

    expect(result.excludedProductIdsSet.size).toBe(0)
    expect(result.userEnrichedMap.size).toBe(1)
    expect(result.tBaustoffMappingEntriesMap.size).toBe(1)
    expect(result.tBaustoffProductMap.size).toBe(2)
    expect(result.productMassMap.size).toBe(3)
  })
  it("should preload the circularity data with excluded products", async () => {
    await toggleExcludedProduct(5)

    const result = await preloadCircularityData(components)

    expect(result.excludedProductIdsSet.size).toBe(1)
    expect(result.userEnrichedMap.size).toBe(0)
    expect(result.tBaustoffMappingEntriesMap.size).toBe(1)
    expect(result.tBaustoffProductMap.size).toBe(1)
    expect(result.productMassMap.size).toBe(3)
  })
})
