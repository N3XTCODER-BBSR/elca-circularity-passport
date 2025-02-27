import { expect, Page } from "@playwright/test"
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

export const createAndAuthenticateUsers = async (baseUrl: string, password = "password1!") => {
  // users.projectOwnerUser
  await authenticateAs(baseUrl, users.projectOwnerUser.username, password)

  // users.unAuthorizedUser
  await deleteUserIfExists(users.unAuthorizedUser.userId)
  await createUser(users.unAuthorizedUser.userId, users.unAuthorizedUser.username)
  await authenticateAs(baseUrl, users.unAuthorizedUser.username, password)

  // users.readOnlyTokenUser
  await deleteUserIfExists(users.readOnlyTokenUser.userId)
  await createUser(users.readOnlyTokenUser.userId, users.readOnlyTokenUser.username)
  await deleteProjectAccessTokenIfExists(projectId, users.readOnlyTokenUser.userId)
  await createProjectAccessToken(projectId, users.readOnlyTokenUser.userId, false)
  await authenticateAs(baseUrl, users.readOnlyTokenUser.username, password)

  // users.editTokenUser
  await deleteUserIfExists(users.editTokenUser.userId)
  await createUser(users.editTokenUser.userId, users.editTokenUser.username)
  await deleteProjectAccessTokenIfExists(projectId, users.editTokenUser.userId)
  await createProjectAccessToken(projectId, users.editTokenUser.userId, true)
  await authenticateAs(baseUrl, users.editTokenUser.username, password)

  // users.groupMemberUser
  await deleteUserIfExists(users.groupMemberUser.userId)
  await createUser(users.groupMemberUser.userId, users.groupMemberUser.username)
  await deleteGroupMemberIfExists(users.groupMemberUser.userId, accessGroupId)
  await createGroupMember(users.groupMemberUser.userId, accessGroupId)
  await authenticateAs(baseUrl, users.groupMemberUser.username, password)
}

export const fillOutAllCircularityDetails = async (
  page: Page,
  componentPageUrl1: string,
  componentPageUrl2: string,
  componentPageUrl3: string,
  componentPageUrl4: string,
  componentPageUrl5: string,
  componentPageUrl6: string,
  componentPageUrl7: string,
  overviewPageUrl: string
) => {
  await page.goto(componentPageUrl1)
  await page.locator("[data-testid=toggle__switch__5]").click()
  await page.locator("[data-testid=toggle__switch__6]").click()

  await page.locator("[data-testid=component-layer__div__7]").locator("[data-testid=accordion__button__7]").click()
  await page
    .locator("[data-testid=component-layer__div__7]")
    .locator("[data-testid=disturbing-substance-class__button__S3]")
    .click()

  await page
    .locator("[data-testid=component-layer__div__7]")
    .locator("[data-testid=circularity-details-rebuild-class-button__button__75]")
    .click()

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl2)
  await page.locator("[data-testid=toggle__switch__13]").click()
  await page.locator("[data-testid=accordion__button__14]").click()
  await page
    .locator("[data-testid=component-layer__div__14]")
    .locator("[data-testid=edit-button__button__tbaustoff-selector]")
    .click()
  await page.locator("[data-testid=select-material-button__select]").selectOption({ value: "1" })

  await page.locator("[data-testid=select-material-save-button__button]").click()

  await page
    .locator("[data-testid=component-layer__div__14]")
    .locator("data-testid=circularity-details-rebuild-class-button__button__50")
    .click()

  await page
    .locator("[data-testid=component-layer__div__14]")
    .locator("data-testid=disturbing-substance-class__button__S1")
    .click()

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl3)
  await page.locator("[data-testid=toggle__switch__15]").click()
  await page.locator("[data-testid=toggle__switch__16]").click()

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl4)
  await page.locator("[data-testid=toggle__switch__17]").click()
  await page.locator("[data-testid=toggle__switch__18]").click()
  await page.locator("[data-testid=toggle__switch__19]").click()
  await page.locator("[data-testid=toggle__switch__20]").click()
  await page.locator("[data-testid=toggle__switch__21]").click()

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl5)
  await page.locator("[data-testid=toggle__switch__22]").click()

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl6)
  await page.locator("[data-testid=toggle__switch__23]").click()

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl7)
  await page.locator("[data-testid=toggle__switch__24]").click()

  await page.waitForLoadState("networkidle")
  await page.goto(overviewPageUrl)
  await expect(page.locator("[data-testid=circularity-index-total-number__points-div]")).toHaveText(/4.72/)

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl1)
  await page.locator("[data-testid=toggle__switch__7]").click()

  await page.waitForLoadState("networkidle")
}
