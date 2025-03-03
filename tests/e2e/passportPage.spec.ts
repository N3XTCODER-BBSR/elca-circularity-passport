/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { expect, test } from "@playwright/test"

test("should display not found message when opening passport page with non-existing passportId", async ({ page }) => {
  await page.goto(`/grp/000`)

  const header = await page.$("h1")
  const headerText = await header?.innerText()

  expect(headerText).toBe("Passport not found")
})

// TODO (M): fix test. should use existing uuid, which is randomly set with each db seed
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
