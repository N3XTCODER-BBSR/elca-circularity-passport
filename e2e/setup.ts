import { chromium, FullConfig } from "@playwright/test"
import {
  createGroupMember,
  createProjectAccessToken,
  createUser,
  deleteGroupMemberIfExists,
  deleteProjectAccessTokenIfExists,
  deleteUserIfExists,
} from "prisma/queries/utils"
import { accessGroupId, getAuthUserFile, projectId, users } from "./utils"

const authenticateAs = async (config: FullConfig, username: string, password: string) => {
  const { baseURL } = config.projects[0]!.use

  const browser = await chromium.launch()

  const page = await browser.newPage()

  const signInUrl = `${baseURL}/auth/signin`

  await page.goto(signInUrl)

  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)

  await page.click('button[type="submit"]')

  await page.waitForURL(/\/projects/, { timeout: 5000 })

  const userFile = getAuthUserFile(username)

  await page.context().storageState({ path: userFile })
  await browser.close()
}

const globalSetup = async (config: FullConfig) => {
  const password = "password1!"

  console.log("Global Setup Running...")

  // users.projectOwnerUser
  await authenticateAs(config, users.projectOwnerUser.username, password)

  // users.unAuthorizedUser
  await deleteUserIfExists(users.unAuthorizedUser.userId)
  await createUser(users.unAuthorizedUser.userId, users.unAuthorizedUser.username)
  await authenticateAs(config, users.unAuthorizedUser.username, password)

  // users.readOnlyTokenUser
  await deleteUserIfExists(users.readOnlyTokenUser.userId)
  await createUser(users.readOnlyTokenUser.userId, users.readOnlyTokenUser.username)
  await deleteProjectAccessTokenIfExists(projectId, users.readOnlyTokenUser.userId)
  await createProjectAccessToken(projectId, users.readOnlyTokenUser.userId, false)
  await authenticateAs(config, users.readOnlyTokenUser.username, password)

  // users.editTokenUser
  await deleteUserIfExists(users.editTokenUser.userId)
  await createUser(users.editTokenUser.userId, users.editTokenUser.username)
  await deleteProjectAccessTokenIfExists(projectId, users.editTokenUser.userId)
  await createProjectAccessToken(projectId, users.editTokenUser.userId, true)
  await authenticateAs(config, users.editTokenUser.username, password)

  // users.groupMemberUser
  await deleteUserIfExists(users.groupMemberUser.userId)
  await createUser(users.groupMemberUser.userId, users.groupMemberUser.username)
  await deleteGroupMemberIfExists(users.groupMemberUser.userId, accessGroupId)
  await createGroupMember(users.groupMemberUser.userId, accessGroupId)
  await authenticateAs(config, users.groupMemberUser.username, password)

  console.log("Global Setup finished.")
}

export default globalSetup
