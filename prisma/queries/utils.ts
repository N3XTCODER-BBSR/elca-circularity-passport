import { prismaLegacySuperUser } from "prisma/prismaClient"

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
