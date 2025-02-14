import { costGroupyDinNumbersToInclude } from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { Prisma } from "prisma/generated/client-legacy"
import { prismaLegacy } from "prisma/prismaClient"

// HINT: functions that access data that has authorization requirements specific to projects
// should have as a parameter the projectId and verify in the where clause of the db query
// that the resource is related to that specific project. Additionally, the ensureUserAuthorizationToProject
// function should be called before the query to ensure that the user has access to the project.

export type Project = Prisma.projectsGetPayload<{
  select: {
    id: true
    name: true
    created: true
  }
}>

export type ProjectWithUserName = Prisma.projectsGetPayload<{
  select: {
    id: true
    name: true
    created: true
    users: {
      select: {
        auth_name: true
      }
    }
  }
}>

// export type ElcaVariantComponent = {
//   access_group_id: number | null
//   element_uuid: string
//   component_id: number
//   layer_position: number
//   process_name: string
//   oekobaudat_process_uuid: string | null | undefined
//   pdb_name: string | null | undefined
//   pdb_version: string | null | undefined
//   oekobaudat_process_db_uuid: string | null | undefined
//   element_name: string
//   unit: string | null | undefined
//   element_component_id: number
//   quantity: number
//   layer_size: number | null
//   layer_length: number | null
//   layer_width: number | null
//   process_config_density: number | null
//   process_config_id: number | null
//   process_config_name: string
//   process_category_node_id: number | null
//   process_category_ref_num: string | null
// }

export type ElcaVariantElementBaseData = {
  uuid: string
  din_code: number | null
  element_name: string
  element_type_name: string
  unit: string | null
  quantity: number
}

export class LegacyDbDal {
  getElcaComponentDataByLayerId = async (layerId: number, variantId: number, projectId: number) => {
    const data = await prismaLegacy.elca_element_components.findFirstOrThrow({
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
        elements: {
          project_variant_id: variantId, // added because element_component.element.project_variant_id can be null
          project_variants: {
            project_id: projectId,
          },
        },
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
      // process_ref_unit: process.ref_unit,
      oekobaudat_process_uuid: process.uuid,
      oekobaudat_process_db_uuid: processDb?.uuid || null,
      element_component_id: data.id,
      quantity: data.quantity ? Number(data.quantity) : null,
      layer_size: data.layer_size ? Number(data.layer_size) : null,
      layer_length: data.layer_length ? Number(data.layer_length) : null,
      layer_width: data.layer_width ? Number(data.layer_width) : null,
      process_config_density: data.process_configs.density ? Number(data.process_configs.density) : null,
      process_config_id: data.process_configs.id,
      process_config_name: data.process_configs.name,
    }

    return result
  }

  getElcaVariantComponentsByInstanceId = async (
    componentInstanceId: string,
    variantId: number,
    projectId: number
  ): Promise<ElcaProjectComponentRow[]> => {
    const elements = await prismaLegacy.elca_elements.findMany({
      where: {
        uuid: componentInstanceId,
        element_types: {
          din_code: {
            in: costGroupyDinNumbersToInclude,
          },
        },
        project_variant_id: variantId, // added because element.project_variant_id can be null
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
          project_id: projectId,
        },
      },
      include: {
        element_components: {
          include: {
            process_configs: {
              select: {
                name: true,
                density: true,
                id: true,
                process_category_node_id: true,
                process_categories: true,
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
          // TODO (XL): Check whether this is proper handling of null values in DB
          layer_position: ec.layer_position || -1,
          process_name: pc.name,
          oekobaudat_process_uuid: process?.uuid,
          pdb_name: pdb?.name,
          pdb_version: pdb?.version,
          oekobaudat_process_db_uuid: pdb?.uuid,
          element_name: element.name,
          unit: element.ref_unit,
          element_component_id: ec.id,
          quantity: Number(element.quantity),
          layer_size: ec.layer_size ? Number(ec.layer_size) : null,
          layer_length: ec.layer_length ? Number(ec.layer_length) : null,
          layer_width: ec.layer_width ? Number(ec.layer_width) : null,
          process_config_density: pc.density ? Number(pc.density) : null,
          process_config_id: pc.id ? Number(pc.id) : null,
          process_config_name: pc.name,
          process_category_node_id: pc.process_category_node_id,
          process_category_ref_num: pc.process_categories.ref_num,
        }
      })
    })
  }

  FOOgetElcaComponentsWithElementsForProjectAndVariantId = async (variantId: number, projectId: number) => {
    return await prismaLegacy.elca_elements.findMany({
      where: {
        project_variant_id: variantId,
        project_variants: {
          project_id: projectId,
        },
        element_types: {
          din_code: {
            in: costGroupyDinNumbersToInclude,
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
        element_types: {
          select: {
            name: true,
            din_code: true,
          },
        },
        element_components: {
          include: {
            process_configs: {
              select: {
                name: true,
                density: true,
                id: true,
                process_category_node_id: true,
                process_categories: true,
                process_life_cycle_assignments: {
                  // TODO: check if this is correct
                  where: {
                    processes: {
                      life_cycles: {
                        ident: "A1-3",
                      },
                    },
                  },
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
  }

  getElcaVariantElementBaseDataByUuid = async (
    componentInstanceUuid: string,
    variantId: number,
    projectId: number
  ): Promise<ElcaVariantElementBaseData> => {
    const element = await prismaLegacy.elca_elements.findFirstOrThrow({
      where: {
        uuid: componentInstanceUuid,
        element_types: {
          din_code: {
            in: costGroupyDinNumbersToInclude,
          },
        },
        project_variant_id: variantId, // added because element.project_variant_id can be null
        project_variants: {
          project_id: projectId,
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
        element_types: {
          select: {
            name: true,
            din_code: true,
          },
        },
        element_components: {
          include: {
            process_configs: {
              select: {
                name: true,
                density: true,
                id: true,
                process_category_node_id: true,
                process_categories: true,
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

    return {
      uuid: element.uuid,
      din_code: element.element_types.din_code,
      element_name: element.name,
      element_type_name: element.element_types.name,
      unit: element.ref_unit,
      quantity: Number(element.quantity),
    }
  }

  findUsersByAuthName = async (authName: string) => {
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
  getComponentsByVariantId = async (variantId: number, projectId: number) => {
    return await prismaLegacy.elca_elements.findMany({
      where: {
        element_types: {
          din_code: {
            in: costGroupyDinNumbersToInclude,
          },
        },
        project_variant_id: variantId,
        project_variants: {
          project_id: projectId,
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

  getProjectById = async (id: number) => {
    return await prismaLegacy.projects.findUnique({
      where: {
        id,
      },
    })
  }

  getProjectDataWithVariants = async (projectId: number) => {
    return await prismaLegacy.projects.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        project_variants_project_variants_project_idToprojects: {
          select: {
            id: true,
            name: true,
            created: true,
          },
        },
      },
    })
  }

  getProjectsByOwnerId = async (userId: number) => {
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
        project_variants_project_variants_project_idToprojects: {
          select: {
            id: true,
            name: true,
            created: true,
          },
        },
      },
    })
  }

  getDataForMassCalculationByProductId = async (productId: number) => {
    return prismaLegacy.elca_element_components.findUnique({
      where: {
        id: productId,
      },
      include: {
        // Include related process_configs and their attributes
        process_configs: {
          include: {
            process_config_attributes: true,
          },
        },
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

  isUserAuthorizedToElementComponent = async (userId: number, elementComponentId: number) => {
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
                  OR: this.getProjectAuthorizationConditions(userId),
                },
              },
            },
          },
        ],
      },
      select: { id: true },
    })
  }

  isUserAuthorizedToElementByUuid = async (userId: number, elementUuid: string) => {
    return await prismaLegacy.elca_elements.findFirst({
      where: {
        uuid: elementUuid,
        OR: [
          // Element is public
          {
            is_public: true,
          },
          // User is authorized via project
          {
            project_variants: {
              projects_project_variants_project_idToprojects: {
                OR: this.getProjectAuthorizationConditions(userId),
              },
            },
          },
        ],
      },
      select: { id: true },
    })
  }

  isUserAuthorizedToProject = async (userId: number, projectId: number) => {
    return await prismaLegacy.projects.findFirst({
      where: {
        id: projectId,
        OR: this.getProjectAuthorizationConditions(userId),
      },
      select: { id: true },
    })
  }

  private getProjectAuthorizationConditions = (userId: number) => [
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

  getPassportRelevantDataForProjectVariantFromLegacyDb = async (projectVariantId: number) => {
    return await prismaLegacy.elca_project_variants.findUnique({
      where: {
        id: projectVariantId,
      },
      include: {
        project_locations: true,
        projects_project_variants_project_idToprojects: {
          select: {
            name: true,
            project_nr: true,
            description: true,
            life_time: true,
          },
        },
        project_constructions: {
          select: {
            gross_floor_space: true,
            net_floor_space: true,
            floor_space: true,
            property_size: true,
            is_extant_building: true,
            living_space: true,
            net_room_space_heated: true,
          },
        },
      },
    })
  }

  getAllProcessCategories = async () => await prismaLegacy.process_categories.findMany()

  getProjectWithVaraitnsAndProcessDbById = (projectId: number) =>
    prismaLegacy.projects.findUnique({
      where: { id: projectId },
      include: {
        project_variants_project_variants_project_idToprojects: true,
        process_dbs: {
          select: {
            name: true,
          },
        },
      },
    })

  getProcessConversionAuditRecords = (processConfigId: number, inUnit: string, outUnit: string) => {
    return prismaLegacy.process_conversion_audit.findMany({
      where: {
        process_config_id: processConfigId,
        in_unit: inUnit,
        out_unit: outUnit,
      },
      orderBy: { modified: "desc" },
    })
  }

  getElementComponentWithDetails = (elementComponentId: number) => {
    return prismaLegacy.elca_element_components.findUnique({
      where: { id: elementComponentId },
      include: {
        process_conversions: {
          include: {
            process_conversion_versions: {
              orderBy: { created: "desc" },
              take: 1,
            },
          },
        },
        process_configs: true,
      },
    })
  }

  getProductById = (productId: number) => {
    return prismaLegacy.elca_element_components.findUnique({
      where: { id: productId },
    })
  }
}

export const getVariantById = async (id: number) => {
  return await prismaLegacy.elca_project_variants.findUnique({
    where: {
      id,
    },
  })
}
