import { prisma, prismaLegacySuperUser } from "prisma/prismaClient"

/**
 * delete user with the given id if it exists
 */
export const deleteUserIfExists = async (userId: number) => {
  const user = await prismaLegacySuperUser.users.findUnique({ where: { id: userId } })
  if (user) {
    await prismaLegacySuperUser.users.delete({ where: { id: userId } })
  }
}

/**
 * create a user with the given username and password that doesn't have any projects
 * @returns newly created user
 */
export const createUser = async (userId: number, userName: string) => {
  return prismaLegacySuperUser.users.create({
    data: {
      id: userId,
      auth_name: userName,
      auth_key: "$1$6a7aabf1$tHpd7.FjG03D18kbREnsa1", // test password1!
      auth_method: 3,
      group_id: 1,
    },
  })
}

/**
 * create a project variant with the given id and project id
 * @returns newly created project variant
 */
export const createVariant = async (variantId: number, projectId: number) => {
  return prismaLegacySuperUser.elca_project_variants.create({
    data: {
      phase_id: 9,
      id: variantId,
      project_id: projectId,
      name: "test variant",
    },
  })
}

/**
 * delete project variant with the given id if it exists
 */
export const deleteVariantIfExists = async (variantId: number) => {
  const variant = await prismaLegacySuperUser.elca_project_variants.findUnique({ where: { id: variantId } })
  if (variant) {
    await prismaLegacySuperUser.elca_project_variants.delete({ where: { id: variantId } })
  }
}

/**
 * create a project with the given id
 * @returns newly created project
 */
export const createProductWithComponent = async (id: number, componentId: number) => {
  return prismaLegacySuperUser.elca_elements.create({
    data: {
      id: componentId,
      element_type_node_id: 246, // must match a real elca_element_types.node_id
      name: "My new element",
      element_components: {
        create: [
          {
            id,
            process_config_id: 123, // must match a real process_configs.id
            process_conversion_id: 456, // must match a real process_conversions.id
            life_time: 50,
            is_layer: false,
          },
        ],
      },
    },
  })
}

export const createTBsProductDefinition = async (id: number) => {
  return await prisma.tBs_ProductDefinition.create({
    data: {
      id,
      tBs_version: "2024-Q4",
      name: "Acetyliertes Holz",
    },
  })
}

export const createDisturbingSubstanceSelectionWithDependencies = async () => {
  return prisma.disturbingSubstanceSelection.create({
    data: {
      userEnrichedProductData: {
        create: {
          elcaElementComponentId: 9999,
          tBaustoffProductSelectedByUser: true,
        },
      },
    },
  })
}

export async function createUserEnrichedProductData(
  elcaElementComponentId: number,
  tBaustoffProductSelectedByUser: boolean
) {
  return prisma.userEnrichedProductData.create({
    data: {
      elcaElementComponentId,
      tBaustoffProductSelectedByUser,
    },
  })
}

export const deleteProductIfExists = async (id: number) => {
  const product = await prismaLegacySuperUser.elca_elements.findUnique({ where: { id } })
  if (product) {
    await prismaLegacySuperUser.elca_elements.delete({ where: { id } })
  }
}

export const deleteComponentIfExists = async (id: number) => {
  const component = await prismaLegacySuperUser.elca_element_components.findUnique({ where: { id } })
  if (component) {
    await prismaLegacySuperUser.elca_element_components.delete({ where: { id } })
  }
}
