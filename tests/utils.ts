import { chromium } from "@playwright/test"

export const getAuthUserFile = (username: string) => `playwright/.auth/${username}.json`

export const authenticateAs = async (baseUrl: string, username: string, password: string, alias?: string) => {
  const browser = await chromium.launch()

  const page = await browser.newPage()

  const signInUrl = `${baseUrl}/auth/signin`

  await page.goto(signInUrl)

  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)

  await page.click('button[type="submit"]')

  await page.waitForURL(/\/projects/, { timeout: 5000 })

  const userFile = getAuthUserFile(alias || username)

  await page.context().storageState({ path: userFile })
  await browser.close()
}
