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
export const createUser = async (userId: number, userName: string, hashedPassword: string) => {
  return prismaLegacySuperUser.users.create({
    data: {
      id: userId,
      auth_name: userName,
      auth_key: hashedPassword,
      auth_method: 3,
      group_id: 1,
    },
  })
}
