import { prismaLegacy } from "prisma/prismaClient"

/**
 * delete user with the given id if it exists
 */
export const deleteUserIfExists = async (userId: number) => {
  const user = await prismaLegacy.users.findUnique({ where: { id: userId } })
  if (user) {
    await prismaLegacy.users.delete({ where: { id: userId } })
  }
}

/**
 * create a user with the given username and password that doesn't have any projects
 * @returns newly created user
 */
export const createUser = async (userId: number, userName: string, hashedPassword: string) => {
  return prismaLegacy.users.create({
    data: {
      id: userId,
      auth_name: userName,
      auth_key: hashedPassword,
      auth_method: 3,
      group_id: 1,
    },
  })
}
