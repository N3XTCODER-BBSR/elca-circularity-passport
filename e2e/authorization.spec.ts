import { expect, test } from "@playwright/test"
import { createUser, deleteUserIfExists } from "prisma/queries/testUtils"

const username = "testuser2"
const password = "password1!"
const userId = 1000

test.describe("Authorization", () => {
  test.beforeEach(async ({ page }) => {
    await deleteUserIfExists(userId)
    await createUser(userId, username)

    await page.goto("/auth/signin")

    await page.fill('input[name="username"]', username)
    await page.fill('input[name="password"]', password)

    await Promise.all([
      page.waitForURL(/\/en\/projects/), // Wait until the URL matches /en/projects
      page.click('button[type="submit"]'),
    ])

    await expect(page).toHaveURL(/\/en\/projects/) // Ensure the URL is as expected
  })

  test.afterEach(async ({ page }) => {
    await page.goto("/en/projects")
    await page.getByTestId("profile-dropdown-button").waitFor()
    await page.getByTestId("profile-dropdown-button").click()
    await page.getByTestId("logout-button").click()

    await expect(page).toHaveURL(/\/auth\/signin/)
  })

  test("should not be able to access project page that user is not authorized to", async ({ page }) => {
    await page.goto("/en/projects/1")

    expect(page.locator("text=Unauthorized")).toBeTruthy()
  })

  test("should not be able to access catalog page that user is not authorized to", async ({ page }) => {
    await page.goto("/en/projects/1/catalog")

    expect(page.locator("text=Unauthorized")).toBeTruthy()
  })

  test("should not be able to access component page that user is not authorized to", async ({ page }) => {
    await page.goto("/en/projects/1/catalog/components/32af2f0b-d7d8-4fb1-8354-1e9736d4f513")

    expect(page.locator("text=Unauthorized")).toBeTruthy()
  })

  // TODO (L): create project programmatically (database function) that user is owner of and test access to it
})
