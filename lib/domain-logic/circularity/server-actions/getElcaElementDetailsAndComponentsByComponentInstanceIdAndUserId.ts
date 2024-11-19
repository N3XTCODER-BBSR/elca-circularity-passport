import _ from "lodash"
import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
} from "lib/domain-logic/types/domain-types"
import { query } from "lib/elca-legacy-db"
import { prisma } from "prisma/prismaClient"
import { calculateEolDataByEolCateogryData } from "./utils/calculateEolDataByEolCateogryData"
import { Prisma, TBs_OekobaudatMapping, UserEnrichedProductData } from "../../../../prisma/generated/client"
import { ensureUserHasProjectAccess } from "lib/is-authorized"

export const getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId = async (
  projectId: string,
  componentInstanceId: string,
  userId: string
): Promise<ElcaElementWithComponents[]> => {
  await ensureUserHasProjectAccess(Number(userId), Number(projectId))

  const projectComponents = await fetchElcaProjectComponentsByInstanceIdAndUserId(componentInstanceId, userId)

  const componentIds = Array.from(new Set(projectComponents.map((c) => c.component_id)))
  const oekobaudatProcessUuids = Array.from(new Set(projectComponents.map((c) => c.oekobaudat_process_uuid)))

  const [userDefinedTBaustoffDataList, tBaustoffMappingEntries] = await Promise.all([
    getUserDefinedTBaustoffData(componentIds),
    getTBaustoffMappingEntries(oekobaudatProcessUuids),
  ])

  const userDefinedTBaustoffDataMap = createMap(userDefinedTBaustoffDataList, (entry) => entry.elcaElementComponentId)
  const tBaustoffMappingEntriesMap = createMap(tBaustoffMappingEntries, (entry) => entry.oebd_processUuid)

  const tBaustoffProductIds = getUniqueTBaustoffProductIds(userDefinedTBaustoffDataList, tBaustoffMappingEntries)

  const tBaustoffProductsList = await getTBaustoffProducts(tBaustoffProductIds)
  const tBaustoffProductMap = createMap(tBaustoffProductsList, (product) => product.id)

  const projectComponentsWithLayers = processProjectComponents(
    projectComponents,
    userDefinedTBaustoffDataMap,
    tBaustoffMappingEntriesMap,
    tBaustoffProductMap
  )

  return projectComponentsWithLayers
}

async function getTBaustoffProducts(tBaustoffProductIds: number[]): Promise<
  Prisma.TBs_ProductDefinitionGetPayload<{
    include: { tBs_ProductDefinitionEOLCategory: true }
  }>[]
> {
  return prisma.tBs_ProductDefinition.findMany({
    where: {
      id: {
        in: tBaustoffProductIds,
      },
    },
    include: {
      tBs_ProductDefinitionEOLCategory: true,
    },
  })
}

async function fetchElcaProjectComponentsByInstanceIdAndUserId(
  componentInstanceId: string,
  userId: string
): Promise<ElcaProjectComponentRow[]> {
  // TODO: ideally also add project-variant id/uuid here to ensure correctness
  const result = await query(
    `
    select
      element.access_group_id as access_group_id,
      element.uuid AS element_uuid,
      element_component.id AS component_id,
      element_component.layer_position AS layer_position,
      process.name AS process_name,
      process.ref_value AS process_ref_value,
      process.ref_unit AS process_ref_unit,
      process.uuid as oekobaudat_process_uuid,
      process_db.name AS pdb_name,
      process_db.version AS pdb_version,
      process_db.uuid AS oekobaudat_process_db_uuid,
      element.name AS element_name,
      element_type.name AS element_type_name,
      element_type.din_code AS din_code,
      element.ref_unit AS unit,
      element_component.id as element_component_id,
      element_component.quantity AS quantity,
      element_component.layer_size AS layer_size,
      element_component.layer_length AS layer_length,
      element_component.layer_width AS layer_width,
      process_config.density AS process_config_density,
      process_config.name AS process_config_name
    FROM elca.elements element
    JOIN elca.project_variants project_variant ON project_variant.id = element.project_variant_id
    JOIN elca.projects project ON project.current_variant_id = project_variant.id
    JOIN elca.element_types element_type ON element_type.node_id = element.element_type_node_id
    JOIN elca.element_components element_component ON element.id = element_component.element_id
    JOIN elca.process_configs process_config ON process_config.id = element_component.process_config_id
    JOIN elca.process_life_cycle_assignments process_life_cycle_assignment ON process_life_cycle_assignment.process_config_id = process_config.id
    JOIN elca.processes process ON process_life_cycle_assignment.process_id = process.id
    JOIN elca.life_cycles life_cycle ON life_cycle.ident = process.life_cycle_ident
    JOIN elca.process_dbs process_db ON process_db.id = process.process_db_id AND process_db.id = project.process_db_id
    -- join public."groups" groups on groups.id = element.access_group_id 
    --join public.group_members group_member on group_member.group_id = groups.id 
    WHERE element.uuid = $1 AND life_cycle.phase = 'prod' and project.owner_id = $2 --and group_member.user_id = $2
    ORDER BY element_uuid, layer_position, component_id, oekobaudat_process_uuid
  `,
    [componentInstanceId, userId]
  )

  return result.rows as ElcaProjectComponentRow[]
}

async function getUserDefinedTBaustoffData(componentIds: number[]): Promise<UserEnrichedProductData[]> {
  return prisma.userEnrichedProductData.findMany({
    where: {
      elcaElementComponentId: {
        in: componentIds,
      },
    },
  })
}

async function getTBaustoffMappingEntries(oekobaudatProcessUuids: string[]): Promise<TBs_OekobaudatMapping[]> {
  return prisma.tBs_OekobaudatMapping.findMany({
    where: {
      oebd_processUuid: {
        in: oekobaudatProcessUuids,
      },
    },
  })
}

function createMap<T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>()
  list.forEach((item) => {
    const key = keyGetter(item)
    map.set(key, item)
  })
  return map
}

function getUniqueTBaustoffProductIds(
  userDefinedList: UserEnrichedProductData[],
  mappingEntries: TBs_OekobaudatMapping[]
): number[] {
  const userDefinedIds = userDefinedList
    .map((entry) => entry.tBaustoffProductDefinitionId)
    .filter((id): id is number => id != null)

  const mappingEntryIds = mappingEntries.map((entry) => entry.tBs_productId).filter((id): id is number => id != null)

  return Array.from(new Set([...userDefinedIds, ...mappingEntryIds]))
}

function getTBaustoffProductData(
  componentId: number,
  oekobaudatProcessUuid: string,
  userDefinedMap: Map<number, UserEnrichedProductData>,
  mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  productMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >
): TBaustoffProductData | undefined {
  const userDefinedData = userDefinedMap.get(componentId)
  let productId = userDefinedData?.tBaustoffProductDefinitionId

  if (productId == null) {
    const mappingEntry = mappingEntriesMap.get(oekobaudatProcessUuid)
    productId = mappingEntry?.tBs_productId
  }

  if (productId != null) {
    const product = productMap.get(productId)
    if (!product) {
      console.error("tBaustoffProduct is null")
      return undefined
    }

    const eolCategory = product.tBs_ProductDefinitionEOLCategory
    const eolData = calculateEolDataByEolCateogryData(eolCategory)
    const tBaustoffProductData: TBaustoffProductData = { name: product.name, eolData, tBaustoffProductId: product.id }
    return tBaustoffProductData
  }

  return undefined
}

// TODO: 'process' doesn't seem to be the best name for this function
// it's more specifically about mapping/grouping/filtering
function processProjectComponents(
  projectComponents: ElcaProjectComponentRow[],
  userDefinedMap: Map<number, UserEnrichedProductData>,
  mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  productMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >
): ElcaElementWithComponents[] {
  return (
    _(projectComponents)
      // TODO: check why this is needed
      .groupBy("element_uuid")
      .map((components, elementUuid) => {
        const { element_name, element_type_name, din_code, unit } = components[0]!

        const layers = processLayers(components, userDefinedMap, mappingEntriesMap, productMap)

        return {
          element_uuid: elementUuid,
          element_name,
          element_type_name,
          din_code,
          unit,
          layers,
        } as ElcaElementWithComponents
      })
      .value()
  )
}

// TODO: 'process' doesn't seem to be the best name for this function
// it's more specifically about mapping/filtering
function processLayers(
  components: ElcaProjectComponentRow[],
  userDefinedMap: Map<number, UserEnrichedProductData>,
  mappingEntriesMap: Map<string, TBs_OekobaudatMapping>,
  productMap: Map<
    number,
    Prisma.TBs_ProductDefinitionGetPayload<{
      include: { tBs_ProductDefinitionEOLCategory: true }
    }>
  >
): EnrichedElcaElementComponent[] {
  return components
    .filter(({ component_id }) => component_id != null)
    .map((component) => {
      const productData = getTBaustoffProductData(
        component.component_id,
        component.oekobaudat_process_uuid,
        userDefinedMap,
        mappingEntriesMap,
        productMap
      )

      const userDefinedComponentData = userDefinedMap.get(component.component_id)

      const enrichedElcaElementComponent: EnrichedElcaElementComponent = {
        ...component,
        tBaustoffProductData: productData,
        dismantlingPotentialClassId: userDefinedComponentData?.dismantlingPotentialClassId,
        tBaustoffProductSelectedByUser: userDefinedComponentData?.tBaustoffProductSelectedByUser,
        eolUnbuiltSpecificScenario: userDefinedComponentData?.specificEolUnbuiltTotalScenario,
        eolUnbuiltSpecificScenarioProofText: userDefinedComponentData?.specificEolUnbuiltTotalScenarioProofText,
      }

      return enrichedElcaElementComponent
    })
    .sort((a, b) => a.layer_position - b.layer_position)
}
