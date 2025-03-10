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
import { EolClasses } from "lib/domain-logic/circularity/utils/circularityMappings"
import {
  DismantlingPotentialClassId,
  DisturbingSubstanceSelection,
  TBs_ProductDefinitionEOLCategoryScenario,
  UserEnrichedProductData,
} from "prisma/generated/client"

export type ElcaProjectComponentLayerEolData = {
  eolUnbuiltRealScenario: TBs_ProductDefinitionEOLCategoryScenario
  eolUnbuiltRealPoints: number
  eolUnbuiltRealClassName: EolClasses
  eolUnbuiltPotentialScenario: TBs_ProductDefinitionEOLCategoryScenario
  eolUnbuiltPotentialPoints: number
  eolUnbuiltPotentialClassName: EolClasses
  // TODO (M): Check if this is actually needed at this point (maybe better calculated on the fly?)
  eolUnbuiltTotalPoints: number
  eolUnbuiltTotalClassName: EolClasses
}

export type TBaustoffProductData = {
  tBaustoffProductId: number
  name: string
  // TODO (L): can this actually be optional/nullable at this point?
  eolData?: ElcaProjectComponentLayerEolData
}

export type UserEnrichedProductDataWithDisturbingSubstanceSelection = UserEnrichedProductData & {
  selectedDisturbingSubstances: DisturbingSubstanceSelection[]
}

// TODO (M): rename this to product
// and use our namings also for the properites.
// Old ecla legacy names should only be used within the SQL queries and they should already
// on query level be mapped/renamed to our namings.
export type ElcaProjectComponentRow = {
  component_id: number
  element_uuid: string
  is_layer: boolean
  layer_position: number
  process_name: string
  // lb_nr: number
  // process_ref_unit: string
  oekobaudat_process_uuid: string | undefined
  pdb_name: string | undefined
  pdb_version: string | undefined | null
  oekobaudat_process_db_uuid: string | undefined
  element_name: string
  unit: string | null
  productUnit: string | null
  productQuantity: number | null
  quantity: number
  layer_size: number | null
  layer_area_ratio: number | null
  layer_length: number | null
  layer_width: number | null
  layer_area_ratio: number | null
  process_config_density: number | null
  process_config_id: number | null
  process_config_name: string
  process_category_node_id: number
  process_category_ref_num: string | null
}

export type EnrichedElcaElementComponent = ElcaProjectComponentRow & {
  mass: number | null
  volume: number | null
  isExcluded: boolean
  isLayer: boolean
  tBaustoffProductSelectedByUser?: boolean
  tBaustoffProductData?: TBaustoffProductData | null
  dismantlingPotentialClassId?: DismantlingPotentialClassId | null
  eolUnbuiltSpecificScenario?: TBs_ProductDefinitionEOLCategoryScenario | null
  eolUnbuiltSpecificScenarioProofText: string | null | undefined
  disturbingSubstanceSelections: DisturbingSubstanceSelection[]
  disturbingEolScenarioForS4: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
}

export type ElcaElementWithComponents<T extends EnrichedElcaElementComponent> = {
  element_uuid: string
  element_type_name: string
  element_name: string
  din_code: number
  layers: T[]
  unit: string
  quantity: number
}

export type DisturbingSubstanceSelectionWithNullabelId = Omit<DisturbingSubstanceSelection, "id"> & {
  id: number | null
}
