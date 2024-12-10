import { expect, test } from "@playwright/test"

test("should display not found message when opening passport page with non-existing passportId", async ({ page }) => {
  await page.goto(`/grp/000`)

  const header = await page.$("h1")
  const headerText = await header?.innerText()

  expect(headerText).toBe("Passport not found")
})

// TODO: fix test. should use existing uuid, which is randomly set with each db seed
// test("should display central building information when opening passport page with existing passportId", async ({
//   page,
// }) => {
//   const username = "username"
//   const password = "password"
//   await page.goto(`http://${username}:${password}@localhost:3005/grp`)

//   const header = await page.$("h1")
//   const headerText = await header?.innerText()

//   expect(headerText).toBe("Ressourcenpass für Gebäude")
// })
