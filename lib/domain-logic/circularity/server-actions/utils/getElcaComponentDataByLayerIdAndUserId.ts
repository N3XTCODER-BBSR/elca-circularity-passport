import {
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { Prisma, TBs_OekobaudatMapping } from "prisma/generated/client"
import { prisma, prismaLegacy } from "prisma/prismaClient"

import { calculateEolDataByEolCateogryData } from "../../utils/calculateEolDataByEolCateogryData"

export const getElcaComponentDataByLayerIdAndUserId = async (layerId: number, userId: string) => {
  const projectComponent = await fetchElcaComponentDataByLayerIdAndUserId(layerId, userId)

  const [userDefinedData, mappingEntry] = await Promise.all([
    getUserDefinedTBaustoffDataForComponentId(layerId),
    getTBaustoffMappingEntry(projectComponent.oekobaudat_process_uuid, projectComponent.oekobaudat_process_db_uuid),
  ])

  const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappingEntry?.tBs_productId

  let product = null
  if (productId != null) {
    product = await getTBaustoffProduct(productId)
  }

  const enrichedComponent = processProjectComponent(projectComponent, userDefinedData, mappingEntry, product)

  return enrichedComponent
}

async function fetchElcaComponentDataByLayerIdAndUserId(
  layerId: number,
  userId: string
): Promise<ElcaProjectComponentRow> {
  // TODO: ideally also add project-variant id/uuid here to ensure correctness

  // TODO: IMPORTANT: add user permission check here

  const result = await prismaLegacy.$queryRaw<ElcaProjectComponentRow[]>`
  select
      process.life_cycle_ident,
      element_component.id AS component_id,
      element_component.layer_position AS layer_position,
      process.name AS process_name,
      process.ref_value AS process_ref_value,
      process.ref_unit AS process_ref_unit,
      process.uuid as oekobaudat_process_uuid,
--      process_db.name AS pdb_name,
--      process_db.version AS pdb_version,
      process_db.uuid AS oekobaudat_process_db_uuid,
      element_component.id as element_component_id,
      element_component.quantity AS quantity,
      element_component.layer_size AS layer_size,
      element_component.layer_length AS layer_length,
      element_component.layer_width AS layer_width,
      process_config.density AS process_config_density,
      process_config.name AS process_config_name
    FROM elca.element_components element_component
    join elca.elements element on element.id = element_component.element_id 
    join elca.project_variants project_variant on project_variant.id = element.project_variant_id  
    join elca.projects project on project.id = project_variant.project_id 
    JOIN elca.process_configs process_config ON process_config.id = element_component.process_config_id
    JOIN elca.process_life_cycle_assignments process_life_cycle_assignment ON process_life_cycle_assignment.process_config_id = process_config.id
    JOIN elca.processes process ON process_life_cycle_assignment.process_id = process.id
    JOIN elca.life_cycles life_cycle ON life_cycle.ident = process.life_cycle_ident
    JOIN elca.process_dbs process_db ON process_db.id = process.process_db_id AND process_db.id = project.process_db_id
    -- join public."groups" groups on groups.id = element.access_group_id 
    --join public.group_members group_member on group_member.group_id = groups.id 
    WHERE element_component.id = ${layerId} and process.life_cycle_ident = 'A1-3'
    -- TODO: IMPORTANT ADD USER PERMISSION CHECK HERE
    `

  if (length !== 1) {
    throw new Error(`Expected exactly one element, but found ${length}`)
  }

  return result[0]!
}

async function getUserDefinedTBaustoffDataForComponentId(
  componentId: number
): Promise<UserEnrichedProductDataWithDisturbingSubstanceSelection | null> {
  return prisma.userEnrichedProductData.findUnique({
    where: {
      elcaElementComponentId: componentId,
    },
    include: {
      selectedDisturbingSubstances: true,
    },
  })
}

async function getTBaustoffMappingEntry(
  oekobaudatProcessUuid: string,
  oekobaudatProcessDbUuid: string
): Promise<TBs_OekobaudatMapping | null> {
  return prisma.tBs_OekobaudatMapping.findUnique({
    where: {
      oebd_processUuid_oebd_versionUuid: {
        oebd_processUuid: oekobaudatProcessUuid,
        // TODO: IMPORTANT: Fix this! At the moment, when setting oekobaudatProcessDbUuid
        // instead of the static uuid value,
        // the page is behaving strange:
        // this page is initially showing an tBaustoff assignment, even though there is no match in the db yet.
        // Then, when clicking e.g. a value for Rückbaupotential, the page is showing the correct state,
        //  at least for the tBaustoff Baustoff selection (null is the correct value in that case).

        // TODO: after it's fixed, also ensure that the matching logic still works for cases where there should be a match
        // oekobaudatVersionUuid: oekobaudatProcessDbUuid,
        oebd_versionUuid: "448d1096-2017-4901-a560-f652a83c737e",
      },
    },
  })
}

async function getTBaustoffProduct(tBaustoffProductId: number): Promise<Prisma.TBs_ProductDefinitionGetPayload<{
  include: { tBs_ProductDefinitionEOLCategory: true }
}> | null> {
  return prisma.tBs_ProductDefinition.findUnique({
    where: {
      id: tBaustoffProductId,
    },
    include: {
      tBs_ProductDefinitionEOLCategory: true,
    },
  })
}

function processProjectComponent(
  projectComponent: ElcaProjectComponentRow,
  userDefinedData: UserEnrichedProductDataWithDisturbingSubstanceSelection | null,
  mappingEntry: TBs_OekobaudatMapping | null,
  product: Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }> | null
): EnrichedElcaElementComponent {
  const componentRow: ElcaProjectComponentRow = projectComponent

  const productData = getTBaustoffProductData(
    componentRow.component_id,
    componentRow.oekobaudat_process_uuid,
    userDefinedData,
    mappingEntry,
    product
  )

  const enrichedComponent: EnrichedElcaElementComponent = {
    ...componentRow,
    tBaustoffProductData: productData,
    tBaustoffProductSelectedByUser: userDefinedData?.tBaustoffProductSelectedByUser,
    dismantlingPotentialClassId: userDefinedData?.dismantlingPotentialClassId,
    eolUnbuiltSpecificScenario: userDefinedData?.specificEolUnbuiltTotalScenario,
    eolUnbuiltSpecificScenarioProofText: userDefinedData?.specificEolUnbuiltTotalScenarioProofText,
    disturbingSubstanceSelections: userDefinedData?.selectedDisturbingSubstances ?? [],
    disturbingEolScenarioForS4: userDefinedData?.disturbingEolScenarioForS4,
  }

  return enrichedComponent
}

function getTBaustoffProductData(
  // TODO: check: do we need the underscored params still?
  _componentId: number,
  _oekobaudatProcessUuid: string,
  userDefinedData: UserEnrichedProductDataWithDisturbingSubstanceSelection | null,
  mappingEntry: TBs_OekobaudatMapping | null,
  product: Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }> | null
): TBaustoffProductData | undefined {
  const productId = userDefinedData?.tBaustoffProductDefinitionId ?? mappingEntry?.tBs_productId

  if (productId != null && product != null) {
    const eolCategory = product.tBs_ProductDefinitionEOLCategory
    const eolData = calculateEolDataByEolCateogryData(eolCategory)
    const tBaustoffProductData: TBaustoffProductData = { name: product.name, eolData, tBaustoffProductId: product.id }
    return tBaustoffProductData
  }

  return undefined
}
