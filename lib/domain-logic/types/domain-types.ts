import { DismantlingPotentialClassId, TBs_ProductDefinitionEOLCategoryScenario } from "@prisma/client"
import { EolClasses } from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"

export type ElcaProjectInfo = {
  id: number
  project_name: string
  created_at: Date
  created_by_user_name: string
}

export type ElcaProjectComponentLayerEolData = {
  eolUnbuiltRealScenario: TBs_ProductDefinitionEOLCategoryScenario
  eolUnbuiltRealPoints: number
  eolUnbuiltRealClassName: EolClasses
  eolUnbuiltPotentialScenario: TBs_ProductDefinitionEOLCategoryScenario
  eolUnbuiltPotentialPoints: number
  eolUnbuiltPotentialClassName: EolClasses
  // TODO: Check if this is actually needed at this point (maybe better calculated on the fly?)
  eolUnbuiltTotalPoints: number
  eolUnbuiltTotalClassName: EolClasses
}

export type TBaustoffProductData = {
  tBaustoffProductId: number
  name: string
  // TODO: can this actually be optional/nullabel at this point?
  eolData?: ElcaProjectComponentLayerEolData
}

// TODO: rename this to product
// and use our namings also for the properites.
// Old ecla legacy names should only be used within the SQL queries and they should already
// on query level be mapped/renamed to our namings.
export type ElcaProjectComponentRow = {
  component_id: number
  element_uuid: string
  layer_position: number
  process_name: string
  process_ref_value: number
  process_ref_unit: string
  oekobaudat_process_uuid: string
  pdb_name: string
  pdb_version: string
  oekobaudat_process_db_uuid: string
  element_name: string
  element_type_name: string
  din_code: string
  unit: string
  quantity: number
  layer_size: number
  layer_length: number
  layer_width: number
  process_config_density: number
  process_config_name: string
}

export type EnrichedElcaElementComponent = ElcaProjectComponentRow & {
  tBaustoffProductSelectedByUser?: boolean
  tBaustoffProductData?: TBaustoffProductData | null
  dismantlingPotentialClassId?: DismantlingPotentialClassId | null
  eolUnbuiltSpecificScenario?: TBs_ProductDefinitionEOLCategoryScenario | null
  eolUnbuiltSpecificScenarioProofText: string | null | undefined
}

export type ElcaElementWithComponents = {
  element_uuid: string
  element_type_name: string
  element_name: string
  din_code: string
  layers: EnrichedElcaElementComponent[]
  unit: string
}
