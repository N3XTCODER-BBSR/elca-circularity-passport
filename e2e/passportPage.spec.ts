import { expect, test } from "@playwright/test"

test("should display central building information when opening passport page with existing passportId", async ({
  page,
}) => {
  const username = "username"
  const password = "password"
  await page.goto(`http://${username}:${password}@localhost:3000/42d42e5b-5340-4657`)

  // enter username and password for basic htaccess authentication here

  const header = await page.$("h1")
  const headerText = await header?.innerText()

  expect(headerText).toBe("Ressourcenpass für Gebäude")
})

test("should display central building information when opening passport page with existing passportId", async ({
  page,
}) => {
  const username = "username"
  const password = "password"
  await page.goto(`http://${username}:${password}@localhost:3000/42d42e5b-5340-4657`)

  const header = await page.$("h1")
  const headerText = await header?.innerText()

  expect(headerText).toBe("Ressourcenpass für Gebäude")
})
