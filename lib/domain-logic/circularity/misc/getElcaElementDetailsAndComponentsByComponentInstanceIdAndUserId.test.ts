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

describe("getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId", () => {
  it("should return the elca element details and components by component instance id and user id", async () => {
    const elementBaseData = {
      uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
      din_code: 321,
      element_name: "Fundament 1",
      element_type_name: "Baugrundverbesserung",
      unit: "m2",
      quantity: 1,
    }

    const elementComponents = [
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

    const excludedProductIdsSet = new Set<number>([])

    const userDefinedTBaustoffDataMap = new Map()
    userDefinedTBaustoffDataMap.set(5, {
      elcaElementComponentId: 5,
      tBaustoffProductDefinitionId: 3,
      tBaustoffProductSelectedByUser: true,
      specificEolUnbuiltTotalScenario: null,
      specificEolUnbuiltTotalScenarioProofText: null,
      dismantlingPotentialClassId: "II",
      disturbingEolScenarioForS4: null,
      specificEolBuiltTotalScenario: null,
      specificEolBuiltTotalScenarioProofText: null,
      selectedDisturbingSubstances: [
        {
          id: 1,
          userEnrichedProductDataElcaElementComponentId: 5,
          disturbingSubstanceClassId: "S2",
          disturbingSubstanceName: null,
        },
      ],
    })

    const tBaustoffMappingEntriesMap = new Map()
    tBaustoffMappingEntriesMap.set("1b69b3a2-3164-436b-a934-ed7d926f5f53", {
      oebd_processUuid: "1b69b3a2-3164-436b-a934-ed7d926f5f53",
      oebd_versionUuid: "448d1096-2017-4901-a560-f652a83c737e",
      tBs_productId: 171,
    })

    const tBaustoffProductMap = new Map()
    tBaustoffProductMap.set(3, {
      id: 3,
      tBs_version: "2024-Q4",
      name: "Aluminiumblech",
      tBs_ProductDefinitionEOLCategoryId: 2,
      tBs_ProductDefinitionEOLCategory: {
        id: 2,
        name: "Alu unbeschichtet od. eloxiert (Sz. Knetleg zu Guss)",
        eolScenarioUnbuiltReal: "RC_PLUS",
        eolScenarioUnbuiltPotential: "CL_PLUS",
        technologyFactor: 0.75,
      },
    })
    tBaustoffProductMap.set(171, {
      id: 171,
      tBs_version: "2024-Q4",
      name: "Kunststoffprofil SBR",
      tBs_ProductDefinitionEOLCategoryId: 86,
      tBs_ProductDefinitionEOLCategory: {
        id: 86,
        name: "KSTProfil",
        eolScenarioUnbuiltReal: "EV_MINUS",
        eolScenarioUnbuiltPotential: "EV_MINUS",
        technologyFactor: 0,
      },
    })

    const productMassMap = new Map()
    productMassMap.set(5, 720)
    productMassMap.set(6, 253)
    productMassMap.set(7, 120.8)

    const result = await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
      elementBaseData,
      elementComponents,
      excludedProductIdsSet,
      userDefinedTBaustoffDataMap,
      tBaustoffMappingEntriesMap,
      tBaustoffProductMap,
      productMassMap
    )

    const expectedResult = {
      din_code: 321,
      element_name: "Fundament 1",
      element_type_name: "Baugrundverbesserung",
      element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
      layers: [
        {
          access_group_id: 3,
          component_id: 5,
          dismantlingPotentialClassId: "II",
          disturbingEolScenarioForS4: null,
          disturbingSubstanceSelections: [
            {
              disturbingSubstanceClassId: "S2",
              disturbingSubstanceName: null,
              id: 1,
              userEnrichedProductDataElcaElementComponentId: 5,
            },
          ],
          element_component_id: 5,
          element_name: "Fundament 1",
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          eolUnbuiltSpecificScenario: null,
          eolUnbuiltSpecificScenarioProofText: null,
          isExcluded: false,
          isLayer: true,
          is_layer: true,
          layer_area_ratio: 1,
          layer_length: 1,
          layer_position: 1,
          layer_size: 0.3,
          layer_width: 1,
          mass: 720,
          oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
          oekobaudat_process_uuid: "b6096c9c-1248-4ce1-9c2d-f4a48aade80f",
          pdb_name: "copy of OBD_2023_I for import in eLCA",
          pdb_version: "v1",
          process_category_node_id: 617,
          process_category_ref_num: "1.04",
          process_config_density: null,
          process_config_id: 45,
          process_config_name: "Beton der Druckfestigkeitsklasse C 30/37",
          process_name: "Beton der Druckfestigkeitsklasse C 30/37",
          productQuantity: 1,
          productUnit: "m3",
          quantity: 1,
          tBaustoffProductData: {
            eolData: {
              eolUnbuiltPotentialClassName: "B",
              eolUnbuiltPotentialPoints: 100,
              eolUnbuiltPotentialScenario: "CL_PLUS",
              eolUnbuiltRealClassName: "C",
              eolUnbuiltRealPoints: 80,
              eolUnbuiltRealScenario: "RC_PLUS",
              eolUnbuiltTotalClassName: "C",
              eolUnbuiltTotalPoints: 95,
            },
            name: "Aluminiumblech",
            tBaustoffProductId: 3,
          },
          tBaustoffProductSelectedByUser: true,
          unit: "m2",
          volume: 0.3,
        },
        {
          access_group_id: 3,
          component_id: 6,
          dismantlingPotentialClassId: undefined,
          disturbingEolScenarioForS4: undefined,
          disturbingSubstanceSelections: [],
          element_component_id: 6,
          element_name: "Fundament 1",
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          eolUnbuiltSpecificScenario: undefined,
          eolUnbuiltSpecificScenarioProofText: undefined,
          isExcluded: false,
          isLayer: true,
          is_layer: true,
          layer_area_ratio: 0.23,
          layer_length: 1,
          layer_position: 2,
          layer_size: 0.5,
          layer_width: 1,
          mass: 253,
          oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
          oekobaudat_process_uuid: "bb51d66a-b04b-4ec7-8947-185e9697e671",
          pdb_name: "copy of OBD_2023_I for import in eLCA",
          pdb_version: "v1",
          process_category_node_id: 616,
          process_category_ref_num: "1.03",
          process_config_density: null,
          process_config_id: 377,
          process_config_name: "Keramische Fassadenplatte TONALITY®",
          process_name: "Keramische Fassadenplatte TONALITY®",
          productQuantity: 1,
          productUnit: "m3",
          quantity: 1,
          tBaustoffProductData: undefined,
          tBaustoffProductSelectedByUser: undefined,
          unit: "m2",
          volume: 0.115,
        },
        {
          access_group_id: 3,
          component_id: 7,
          dismantlingPotentialClassId: undefined,
          disturbingEolScenarioForS4: undefined,
          disturbingSubstanceSelections: [],
          element_component_id: 7,
          element_name: "Fundament 1",
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          eolUnbuiltSpecificScenario: undefined,
          eolUnbuiltSpecificScenarioProofText: undefined,
          isExcluded: false,
          isLayer: true,
          is_layer: true,
          layer_area_ratio: 1,
          layer_length: 1,
          layer_position: 3,
          layer_size: 0.302,
          layer_width: 1,
          mass: 120.8,
          oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
          oekobaudat_process_uuid: "1b69b3a2-3164-436b-a934-ed7d926f5f53",
          pdb_name: "copy of OBD_2023_I for import in eLCA",
          pdb_version: "v1",
          process_category_node_id: 664,
          process_category_ref_num: "6.04",
          process_config_density: null,
          process_config_id: 410,
          process_config_name: "Kunststoffprofil SBR",
          process_name: "Kunststoffprofil SBR",
          productQuantity: 1,
          productUnit: "m3",
          quantity: 1,
          tBaustoffProductData: {
            eolData: {
              eolUnbuiltPotentialClassName: "F",
              eolUnbuiltPotentialPoints: -20,
              eolUnbuiltPotentialScenario: "EV_MINUS",
              eolUnbuiltRealClassName: "F",
              eolUnbuiltRealPoints: -20,
              eolUnbuiltRealScenario: "EV_MINUS",
              eolUnbuiltTotalClassName: "F",
              eolUnbuiltTotalPoints: -20,
            },
            name: "Kunststoffprofil SBR",
            tBaustoffProductId: 171,
          },
          tBaustoffProductSelectedByUser: undefined,
          unit: "m2",
          volume: 0.302,
        },
      ],
      quantity: 1,
      unit: "m2",
    }

    expect(result).toEqual(expectedResult)
  })
})
