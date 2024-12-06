import { prismaLegacy } from "prisma/prismaClient"

export const getElcaComponentDataByLayerIdAndUserId = async (layerId: number) => {
  const data = await prismaLegacy.elca_element_components.findFirst({
    where: {
      id: layerId,
      // Ensure we only get processes with the given life_cycle_ident
      process_configs: {
        process_life_cycle_assignments: {
          some: {
            processes: {
              life_cycle_ident: "A1-3",
            },
          },
        },
      },
      // TODO: Add user permission check here by relating to project.owner_id if needed
    },
    include: {
      elements: {
        include: {
          element_types: true,
          project_variants: {
            include: {
              // This relation gives us the associated project:
              projects_project_variants_project_idToprojects: {
                include: {
                  process_dbs: true,
                },
              },
            },
          },
        },
      },
      process_configs: {
        include: {
          process_life_cycle_assignments: {
            include: {
              processes: {
                include: {
                  life_cycles: true,
                  process_dbs: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!data) {
    throw new Error(`Expected exactly one element, but found 0`)
  }

  // Find the specific process that has life_cycle_ident = 'A1-3'
  const assignment = data.process_configs.process_life_cycle_assignments.find(
    (a) => a.processes?.life_cycle_ident === "A1-3"
  )

  if (!assignment) {
    throw new Error(`No process with life_cycle_ident='A1-3' found for layerId=${layerId}`)
  }

  const process = assignment.processes
  const processDb = process.process_dbs

  // Flattening the nested structure into a single object that matches the `want` shape
  const result = {
    life_cycle_ident: process.life_cycle_ident,
    component_id: data.id,
    layer_position: data.layer_position,
    process_name: process.name,
    process_ref_value: Number(process.ref_value),
    process_ref_unit: process.ref_unit,
    oekobaudat_process_uuid: process.uuid,
    oekobaudat_process_db_uuid: processDb?.uuid || null,
    element_component_id: data.id,
    quantity: data.quantity ? Number(data.quantity) : null,
    layer_size: data.layer_size ? Number(data.layer_size) : null,
    layer_length: data.layer_length ? Number(data.layer_length) : null,
    layer_width: data.layer_width ? Number(data.layer_width) : null,
    process_config_density: data.process_configs.density ? Number(data.process_configs.density) : null,
    process_config_name: data.process_configs.name,
  }

  return result
}

export const getElcaProjectComponentsByInstanceIdAndUserId = async (componentInstanceId: string, userId: number) => {
  const elements = await prismaLegacy.elca_elements.findMany({
    where: {
      uuid: componentInstanceId,
      element_components: {
        some: {
          process_configs: {
            process_life_cycle_assignments: {
              some: {
                processes: {
                  life_cycles: {
                    phase: "prod",
                  },
                },
              },
            },
          },
        },
      },
      project_variants: {
        projects_projects_current_variant_idToproject_variants: {
          some: {
            owner_id: userId,
          },
        },
      },
    },
    include: {
      project_variants: {
        include: {
          projects_projects_current_variant_idToproject_variants: {
            include: {
              process_dbs: true,
            },
          },
        },
      },
      element_types: true,
      element_components: {
        include: {
          process_configs: {
            include: {
              process_life_cycle_assignments: {
                include: {
                  processes: {
                    include: {
                      life_cycles: true,
                      process_dbs: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  return elements.flatMap((element) => {
    return element.element_components.map((ec) => {
      const pc = ec.process_configs
      const assignments = pc.process_life_cycle_assignments
      // Assuming each component/process_config has at least one relevant process:
      const processes = assignments.flatMap((a) => a.processes)
      const process = processes[0] // If multiple processes apply, adjust your logic here
      const pdb = process?.process_dbs

      return {
        access_group_id: element.access_group_id,
        element_uuid: element.uuid,
        component_id: ec.id,
        layer_position: ec.layer_position,
        process_name: pc.name,
        process_ref_value: process?.ref_value ? Number(process.ref_value) : null,
        process_ref_unit: process?.ref_unit,
        oekobaudat_process_uuid: process?.uuid,
        pdb_name: pdb?.name,
        pdb_version: pdb?.version,
        oekobaudat_process_db_uuid: pdb?.uuid,
        element_name: element.name,
        element_type_name: element.element_types.name,
        din_code: element.element_types.din_code,
        unit: element.ref_unit,
        element_component_id: ec.id,
        quantity: Number(ec.quantity),
        layer_size: ec.layer_size ? Number(ec.layer_size) : null,
        layer_length: ec.layer_length ? Number(ec.layer_length) : null,
        layer_width: ec.layer_width ? Number(ec.layer_width) : null,
        process_config_density: pc.density ? Number(pc.density) : null,
        process_config_name: pc.name,
      }
    })
  })
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
  return await prismaLegacy.projects.findMany({
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

export const isUserAuthorizedToElementComponent = async (userId: number, elementComponentId: number) => {
  return await prismaLegacy.elca_element_components.findFirst({
    where: {
      id: elementComponentId,
      OR: [
        // Element is public
        {
          elements: {
            is_public: true,
          },
        },
        // User is authorized via project
        {
          elements: {
            project_variants: {
              projects_project_variants_project_idToprojects: {
                OR: getProjectAuthorizationConditions(userId),
              },
            },
          },
        },
      ],
    },
    select: { id: true },
  })
}

export const isUserAuthorizedToProject = async (userId: number, projectId: number) => {
  return await prismaLegacy.projects.findFirst({
    where: {
      id: projectId,
      OR: getProjectAuthorizationConditions(userId),
    },
    select: { id: true },
  })
}

const getProjectAuthorizationConditions = (userId: number) => [
  // User is the owner of the project
  { owner_id: userId },
  // User is a member of the project's access group
  {
    groups: {
      group_members: {
        some: {
          user_id: userId,
        },
      },
    },
  },
  // User has a confirmed access token for the project
  {
    project_access_tokens: {
      some: {
        user_id: userId,
        is_confirmed: true,
        can_edit: true,
      },
    },
  },
]
