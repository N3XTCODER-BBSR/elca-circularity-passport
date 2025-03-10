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
import crypto from "crypto"
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
      auth_key: "$1$6a7aabf1$tHpd7.FjG03D18kbREnsa1", // hashed "password1!"
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
 * @returns newly created product
 */
export const createProductWithComponent = async (productId: number, componentId: number) => {
  return prismaLegacySuperUser.elca_elements.create({
    data: {
      id: productId,
      element_type_node_id: 246, // must match a real elca_element_types.node_id
      name: "My new element",
      element_components: {
        create: [
          {
            id: componentId,
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
  // create random number from 1000 to 2000
  const elcaElementComponentId = Math.floor(Math.random() * 1000) + 1000

  return prisma.disturbingSubstanceSelection.create({
    data: {
      userEnrichedProductData: {
        create: {
          elcaElementComponentId: elcaElementComponentId,
          tBaustoffProductSelectedByUser: true,
        },
      },
    },
  })
}

export const deleteDisturbingSubstanceSelectionWithDependenciesIfExist = async (
  id: number,
  elcaElementComponentId: number
) => {
  return prisma.$transaction(async (tx) => {
    const existingDisturbingSubstance = await tx.disturbingSubstanceSelection.findUnique({
      where: { id },
    })
    if (existingDisturbingSubstance) {
      await tx.disturbingSubstanceSelection.delete({
        where: { id },
      })
    }

    const existingUserEnrichedProductData = await tx.userEnrichedProductData.findUnique({
      where: { elcaElementComponentId },
    })
    if (existingUserEnrichedProductData) {
      await tx.userEnrichedProductData.delete({
        where: { elcaElementComponentId },
      })
    }
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

export const createProject = async (projectId: number, accessGroupId: number, ownerId: number) => {
  return prismaLegacySuperUser.projects.create({
    data: {
      id: projectId,
      process_db_id: 1,
      access_group_id: accessGroupId,
      name: "random name",
      life_time: 50,
      owner_id: ownerId,
    },
  })
}

export const createAccessGroup = async (groupId: number) => {
  return prismaLegacySuperUser.groups.create({
    data: {
      id: groupId,
      name: "random name",
    },
  })
}

export const createProjectAccessToken = async (projectId: number, userId: number, canEdit: boolean) => {
  return prismaLegacySuperUser.project_access_tokens.create({
    data: {
      project_id: projectId,
      user_id: userId,
      token: crypto.randomUUID(),
      user_email: "random email",
      can_edit: canEdit,
      is_confirmed: true,
    },
  })
}

export const deleteProjectAccessTokenIfExists = async (projectId: number, userId: number) => {
  const token = await prismaLegacySuperUser.project_access_tokens.findFirst({
    where: {
      project_id: projectId,
      user_id: userId,
    },
  })

  if (token) {
    await prismaLegacySuperUser.project_access_tokens.delete({
      where: {
        token: token.token,
      },
    })
  }
}

export const setProjectAccessTokenToEditTrue = async (projectId: number, userId: number) => {
  return prismaLegacySuperUser.project_access_tokens.update({
    where: {
      project_id_user_id: {
        project_id: projectId,
        user_id: userId,
      },
    },
    data: {
      can_edit: true,
    },
  })
}

export const createGroupMember = async (userId: number, groupId: number) => {
  return prismaLegacySuperUser.group_members.create({
    data: {
      group_id: groupId,
      user_id: userId,
    },
  })
}

export const deleteGroupMemberIfExists = async (userId: number, groupId: number) => {
  return prismaLegacySuperUser.$transaction(async (tx) => {
    const groupMember = await tx.group_members.findUnique({
      where: {
        group_id_user_id: {
          group_id: groupId,
          user_id: userId,
        },
      },
    })

    if (groupMember) {
      await tx.group_members.delete({
        where: {
          group_id_user_id: {
            group_id: groupId,
            user_id: userId,
          },
        },
      })
    }
  })
}

export const addElementToAccessGroup = async (componentId: number, groupId: number) => {
  return prismaLegacySuperUser.elca_elements.update({
    where: { id: componentId },
    data: {
      access_group_id: groupId,
    },
  })
}

export const deleteProjectIfExists = async (projectId: number) => {
  return prismaLegacySuperUser.$transaction(async (tx) => {
    const project = await tx.projects.findUnique({ where: { id: projectId } })

    if (project) {
      await prismaLegacySuperUser.projects.delete({
        where: { id: projectId },
      })
    }
  })
}

export const deleteAccessGroupIfExists = async (groupId: number) => {
  return prismaLegacySuperUser.$transaction(async (tx) => {
    const group = await prismaLegacySuperUser.groups.findUnique({ where: { id: groupId } })
    if (group) {
      await prismaLegacySuperUser.groups.delete({ where: { id: groupId } })
    }
  })
}
