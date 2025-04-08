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
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { EolClasses } from "lib/domain-logic/circularity/utils/circularityMappings"

export const layers: EnrichedElcaElementComponent[] = [
  {
    element_uuid: "d34f62e8-cfa9-42b5-9944-583652aecf34",
    component_id: 30,
    layer_position: 2,
    is_layer: true,
    process_name: "Betonpflastersteine",
    oekobaudat_process_uuid: "e76bcf28-fc7d-408e-a554-6317256cb905",
    element_name: "test non-layer products",
    unit: "m2",
    productUnit: "m3",
    productQuantity: 1,
    quantity: 1,
    layer_size: 0.555,
    layer_length: 1,
    layer_width: 1,
    layer_area_ratio: 1,
    process_config_density: null,
    process_config_id: 55,
    process_config_name: "Betonpflastersteine",
    process_category_node_id: 616,
    process_category_ref_num: "1.03",
    isLayer: true,
    mass: 1304.25,
    volume: 0.555,
    isExcluded: false,
    tBaustoffProductData: {
      name: "Armierung (für Kunstharzspachtel)",
      eolData: {
        eolUnbuiltRealScenario: "EB",
        eolUnbuiltRealPoints: -60,
        eolUnbuiltRealClassName: EolClasses.G,
        eolUnbuiltPotentialScenario: "EB",
        eolUnbuiltPotentialPoints: -60,
        eolUnbuiltPotentialClassName: EolClasses.G,
        eolUnbuiltTotalPoints: -60,
        eolUnbuiltTotalClassName: EolClasses.G,
      },
      tBaustoffProductId: 4,
    },
    dismantlingPotentialClassId: "I",
    tBaustoffProductSelectedByUser: true,
    eolUnbuiltSpecificScenario: null,
    eolUnbuiltSpecificScenarioProofText: null,
    disturbingSubstanceSelections: [
      {
        id: 14,
        userEnrichedProductDataElcaElementComponentId: 30,
        disturbingSubstanceClassId: "S1",
        disturbingSubstanceName: null,
      },
    ],
    disturbingEolScenarioForS4: null,
  },
  {
    element_uuid: "d34f62e8-cfa9-42b5-9944-583652aecf34",
    component_id: 28,
    layer_position: 1,
    is_layer: true,
    process_name: "Blähschiefer",
    oekobaudat_process_uuid: "b76ded67-067b-47f6-b131-a73db86039b0",
    element_name: "test non-layer products",
    unit: "m2",
    productUnit: "m3",
    productQuantity: 1,
    quantity: 1,
    layer_size: 0.5,
    layer_length: 1,
    layer_width: 1,
    layer_area_ratio: 1,
    process_config_density: null,
    process_config_id: 72,
    process_config_name: "Blähschiefer",
    process_category_node_id: 615,
    process_category_ref_num: "1.02",
    isLayer: true,
    mass: 300,
    volume: 0.5,
    isExcluded: false,
    tBaustoffProductData: {
      name: "Blähschiefer",
      eolData: {
        eolUnbuiltRealScenario: "DEP_PLUS",
        eolUnbuiltRealPoints: -20,
        eolUnbuiltRealClassName: EolClasses.F,
        eolUnbuiltPotentialScenario: "RC_PLUS",
        eolUnbuiltPotentialPoints: 80,
        eolUnbuiltPotentialClassName: EolClasses.C,
        eolUnbuiltTotalPoints: 55,
        eolUnbuiltTotalClassName: EolClasses.DE,
      },
      tBaustoffProductId: 373,
    },
    dismantlingPotentialClassId: "I",
    tBaustoffProductSelectedByUser: false,
    eolUnbuiltSpecificScenario: null,
    eolUnbuiltSpecificScenarioProofText: null,
    disturbingSubstanceSelections: [
      {
        id: 3,
        userEnrichedProductDataElcaElementComponentId: 28,
        disturbingSubstanceClassId: "S2",
        disturbingSubstanceName: null,
      },
    ],
    disturbingEolScenarioForS4: null,
  },
]
