import { expect, test } from "@playwright/test"
import { createUser, deleteUserIfExists } from "./utils"

const username = "testuser2"
const password = "password1!"
const userId = 1000
const hashedPassword = "$1$6a7aabf1$tHpd7.FjG03D18kbREnsa1" // hashed password1!

test.describe("Authorization", () => {
  test.beforeEach(async ({ page }) => {
    await deleteUserIfExists(userId)
    await createUser(userId, username, hashedPassword)

    await page.goto("http://localhost:3000/auth/signin")

    await page.fill('input[name="username"]', username)
    await page.fill('input[name="password"]', password)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/[a-z]{2}\/projects/)
  })

  test.afterEach(async ({ page }) => {
    await page.goto("http://localhost:3000/en/projects")
    await page.getByTestId("profile-dropdown-button").click()
    await page.getByTestId("logout-button").click()

    await expect(page).toHaveURL(/\/auth\/signin/)

    await deleteUserIfExists(userId)
  })

  test("should not be able to access project page that user is not authorized to", async ({ page }) => {
    await page.goto("http://localhost:3000/en/projects/1")

    expect(page.locator("text=Unauthorized")).toBeTruthy()
  })

  test("should not be able to access catalog page that user is not authorized to", async ({ page }) => {
    await page.goto("http://localhost:3000/en/projects/1/catalog")

    expect(page.locator("text=Unauthorized")).toBeTruthy()
  })

  test("should not be able to access component page that user is not authorized to", async ({ page }) => {
    await page.goto("http://localhost:3000/en/projects/1/catalog/components/32af2f0b-d7d8-4fb1-8354-1e9736d4f513")

    expect(page.locator("text=Unauthorized")).toBeTruthy()
  })

  // TODO: create project programmatically (database function) that user is owner of and test access to it
})
