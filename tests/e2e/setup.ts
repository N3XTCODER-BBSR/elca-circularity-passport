import { FullConfig } from "@playwright/test"
import {
  createGroupMember,
  createProjectAccessToken,
  createUser,
  deleteGroupMemberIfExists,
  deleteProjectAccessTokenIfExists,
  deleteUserIfExists,
} from "prisma/queries/testUtils"
import { authenticateAs } from "tests/utils"
import { accessGroupId, projectId, users } from "./constants"

const globalSetup = async (config: FullConfig) => {
  const password = "password1!"

  console.log("Global Setup Running...")

  // users.projectOwnerUser
  await authenticateAs(config.projects[0]!.use.baseURL!, users.projectOwnerUser.username, password)

  // users.unAuthorizedUser
  await deleteUserIfExists(users.unAuthorizedUser.userId)
  await createUser(users.unAuthorizedUser.userId, users.unAuthorizedUser.username)
  await authenticateAs(config.projects[0]!.use.baseURL!, users.unAuthorizedUser.username, password)

  // users.readOnlyTokenUser
  await deleteUserIfExists(users.readOnlyTokenUser.userId)
  await createUser(users.readOnlyTokenUser.userId, users.readOnlyTokenUser.username)
  await deleteProjectAccessTokenIfExists(projectId, users.readOnlyTokenUser.userId)
  await createProjectAccessToken(projectId, users.readOnlyTokenUser.userId, false)
  await authenticateAs(config.projects[0]!.use.baseURL!, users.readOnlyTokenUser.username, password)

  // users.editTokenUser
  await deleteUserIfExists(users.editTokenUser.userId)
  await createUser(users.editTokenUser.userId, users.editTokenUser.username)
  await deleteProjectAccessTokenIfExists(projectId, users.editTokenUser.userId)
  await createProjectAccessToken(projectId, users.editTokenUser.userId, true)
  await authenticateAs(config.projects[0]!.use.baseURL!, users.editTokenUser.username, password)

  // users.groupMemberUser
  await deleteUserIfExists(users.groupMemberUser.userId)
  await createUser(users.groupMemberUser.userId, users.groupMemberUser.username)
  await deleteGroupMemberIfExists(users.groupMemberUser.userId, accessGroupId)
  await createGroupMember(users.groupMemberUser.userId, accessGroupId)
  await authenticateAs(config.projects[0]!.use.baseURL!, users.groupMemberUser.username, password)

  console.log("Global Setup finished.")
}

export default globalSetup
