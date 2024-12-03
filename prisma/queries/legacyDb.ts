import { ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { prismaLegacy } from "prisma/prismaClient"

export const getElcaComponentDataByLayerIdAndUserId = async (layerId: number, userId: string) => {
  // TODO: ideally also add project-variant id/uuid here to ensure correctness

  // TODO: IMPORTANT: add user permission check here

  const result = await prismaLegacy.$queryRaw<ElcaProjectComponentRow[]>`
  select
      process.life_cycle_ident,
      element_component.id AS component_id,
      element_component.layer_position AS layer_position,
      process.name AS process_name,
      process.ref_value::FLOAT AS process_ref_value,
      process.ref_unit AS process_ref_unit,
      process.uuid as oekobaudat_process_uuid,
--      process_db.name AS pdb_name,
--      process_db.version AS pdb_version,
      process_db.uuid AS oekobaudat_process_db_uuid,
      element_component.id as element_component_id,
      element_component.quantity::FLOAT AS quantity,
      element_component.layer_size::FLOAT AS layer_size,
      element_component.layer_length::FLOAT AS layer_length,
      element_component.layer_width::FLOAT AS layer_width,
      process_config.density::FLOAT AS process_config_density,
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

  if (result.length !== 1) {
    throw new Error(`Expected exactly one element, but found ${length}`)
  }

  return result[0]!
}

export const findUsersByAuthName = async (authName: string) => {
  return await prismaLegacy.users.findMany({
    where: {
      auth_name: authName,
    },
    select: {
      id: true,
      auth_name: true,
      auth_key: true,
    },
  })
}

export const getElcaProjectComponentsByInstanceIdAndUserId = async (componentInstanceId: string, userId: string) => {
  // TODO: ideally also add project-variant id/uuid here to ensure correctness
  return await prismaLegacy.$queryRaw<ElcaProjectComponentRow[]>`
  select
      element.access_group_id as access_group_id,
      element.uuid AS element_uuid,
      element_component.id AS component_id,
      element_component.layer_position AS layer_position,
      process.name AS process_name,
      process.ref_value::FLOAT AS process_ref_value,
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
      element_component.quantity::FLOAT AS quantity,
      element_component.layer_size::FLOAT AS layer_size,
      element_component.layer_length::FLOAT AS layer_length,
      element_component.layer_width::FLOAT AS layer_width,
      process_config.density::FLOAT AS process_config_density,
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
    WHERE element.uuid = ${componentInstanceId}::uuid AND life_cycle.phase = 'prod' and project.owner_id = ${userId}::integer --and group_member.user_id = ${userId}
    ORDER BY element_uuid, layer_position, component_id, oekobaudat_process_uuid
  `
}

export const getElcaProjectElementsByProjectIdAndUserId = async (projectId: number, userId: number) => {
  return await prismaLegacy.elca_elements.findMany({
    where: {
      project_variants: {
        projects_project_variants_project_idToprojects: {
          id: projectId,
          owner_id: userId,
        },
      },
    },
    select: {
      uuid: true,
      name: true,
      project_variant_id: true,
      element_types: {
        select: {
          din_code: true,
        },
      },
    },
  })
}

export const getProjectsByIdAndOwnerId = async (id: number, userId: number) => {
  return await prismaLegacy.projects.findMany({
    where: {
      id,
      owner_id: userId,
    },
    select: {
      id: true,
      name: true,
    },
  })
}

export const getProjectsByOwnerId = async (userId: number) => {
  return prismaLegacy.projects.findMany({
    where: {
      owner_id: userId,
    },
    select: {
      id: true,
      name: true,
      created: true,
      users: {
        select: {
          auth_name: true,
        },
      },
    },
  })
}

export const getDataForMassCalculationByProductId = async (productId: number) => {
  return prismaLegacy.elca_element_components.findUnique({
    where: {
      id: productId,
    },
    include: {
      // Include related process_configs
      process_configs: true,
      // Include related process_conversions and their versions
      process_conversions: {
        include: {
          process_conversion_versions: {
            orderBy: {
              created: "desc", // You may adjust this to select the appropriate version
            },
            take: 1, // Get the most recent version
          },
        },
      },
    },
  })
}
