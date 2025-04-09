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
import { circularityToolPages } from "tests/constants"
import { getAuthUserFile, resetDb, seedDb } from "tests/utils"
import { users } from "./constants"
import { fillOutAllCircularityDetails } from "./utils"

test.describe("Circularity tool", () => {
  const projectId = 1

  const getComponentsPageUrl = (variantId: number, componentUuid: string) =>
    circularityToolPages.componentPage
      .replace("<projectId>", projectId.toString())
      .replace("<variantId>", variantId.toString())
      .replace("<componentId>", componentUuid)

  const componentUuid1 = "32af2f0b-d7d8-4fb1-8354-1e9736d4f513"
  const componentUuid2 = "1b9ead66-2911-4b60-983b-0eeb118d6837"
  const componentUuid3 = "17517962-b544-4433-b4bc-49aa101814ab"
  const componentUuid4 = "d34f62e8-cfa9-42b5-9944-583652aecf34"
  const componentUuid5 = "c74c2dc0-04b9-4f68-af43-5450ba04ea1e"
  const componentUuid6 = "e05939a3-370a-4d8a-b8e5-a0633055806d"
  const componentUuid7 = "6568c2fd-9105-4bfa-a85c-a5f8d19aff7b"
  const componentUuid8 = "8c4cc20d-79de-4586-a927-3cb518b3c64a"

  const componentPageUrl1 = getComponentsPageUrl(1, componentUuid1)
  const componentPageUrl2 = getComponentsPageUrl(1, componentUuid2)
  const componentPageUrl3 = getComponentsPageUrl(1, componentUuid3)
  const componentPageUrl4 = getComponentsPageUrl(1, componentUuid4)
  const componentPageUrl5 = getComponentsPageUrl(1, componentUuid5)
  const componentPageUrl6 = getComponentsPageUrl(1, componentUuid6)
  const componentPageUrl7 = getComponentsPageUrl(1, componentUuid7)
  const componentPageUrl8 = getComponentsPageUrl(1, componentUuid8)

  const getOverviewPageUrl = (variantId: number) => {
    return circularityToolPages.overviewPage
      .replace("<projectId>", projectId.toString())
      .replace("<variantId>", variantId.toString())
  }

  const getCatalogPageUrl = (variantId: number) => {
    return circularityToolPages.catalogPage
      .replace("<projectId>", projectId.toString())
      .replace("<variantId>", variantId.toString())
  }

  test.use({ storageState: getAuthUserFile(users.projectOwnerUser.username) })

  test.describe("Component Page", () => {
    test.beforeAll(async () => {
      await resetDb()
      await seedDb()
    })

    test.describe("Component Page 4", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(componentPageUrl4)
      })

      test("displays volume for other material with m3 unit correctly", async ({ page }) => {
        await expect(
          page.locator("[data-testid=component-layer__div__17]").locator("[data-testid=volume-value__dd]")
        ).toHaveText("10 m3")
      })
    })
    test.describe("Component Page 1", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(componentPageUrl1)
      })

      test("displays component overview correctly", async ({ page }) => {
        await expect(page.locator("[data-testid=description-item__dd__number-installed]")).toHaveText("1")
        await expect(page.locator("[data-testid=description-item__dd__ref-unit]")).toHaveText("m2")
      })

      test("displays material basic information (mass) correctly", async ({ page }) => {
        await expect(
          page.locator("[data-testid=component-layer__div__5]").locator("[data-testid=mass-value__dd]")
        ).toHaveText("720 kg")
      })
      test('if the tBaustoff field is set, the Circularity Potential - Unbuilt - "EOL Total points" has the correct value', async ({
        page,
      }) => {
        // First click on the accordion to open it
        await page
          .locator("[data-testid=component-layer__div__7]")
          .locator("[data-testid=accordion__button__7]")
          .click()

        // Then click on the edit button to open the tBaustoff selector
        await page
          .locator("[data-testid=component-layer__div__7]")
          .locator("[data-testid=edit-button__button__tbaustoff-selector]")
          .click()

        // Wait for dropdown to be visible
        await page.locator("[data-testid=select-material-button__select]").waitFor()

        // Select "Kunststoffprofil SBR" from the dropdown
        // First try by value if you know it, or by visible text otherwise
        await page
          .locator("[data-testid=select-material-button__select]")
          .selectOption({ label: "Kunststoffprofil SBR" })

        // Click the save button
        await page.locator("[data-testid=select-material-save-button__button]").click()

        // Verify the expected results
        await expect(
          page.locator("[data-testid=component-layer__div__7]").locator("[data-testid=tbaustoff-product-name__span]")
        ).toHaveText("Kunststoffprofil SBR")
        await expect(page.locator("[data-testid=eol-unbuilt-points-value__dd]")).toHaveText("-20")
      })
      test('if the user clicks  on an "S3" pollutant and on a class "I" rebuild potential, the circularity index field has the correct value', async ({
        page,
      }) => {
        await page
          .locator("[data-testid=component-layer__div__7]")
          .locator("[data-testid=accordion__button__7]")
          .click()
        await page
          .locator("[data-testid=component-layer__div__7]")
          .locator("[data-testid=disturbing-substance-class__button__S3]")
          .click()
        await expect(
          page.locator("[data-testid=component-layer__div__7]").locator("[data-testid=eol-built-points-value__dd]")
        ).toHaveText("-40")
      })
    })
  })
  test.describe("Overview Page", () => {
    test.beforeAll(async () => {
      await resetDb()
      await seedDb()
    })

    test("if there is at least one incomplete material, the overview page shows the empty state", async ({ page }) => {
      const overviewPageUrl = getOverviewPageUrl(1)

      await page.goto(overviewPageUrl)
      await expect(page.locator("[data-testid=building-overview-empty-state__h3__heading]")).toBeVisible()
    })
    test('if there are no "incomplete" materials (and minimal 1 completed), the overview page shows a graph', async ({
      page,
    }) => {
      const overviewPageUrl = getOverviewPageUrl(1)

      await fillOutAllCircularityDetails(
        page,
        componentPageUrl1,
        componentPageUrl2,
        componentPageUrl3,
        componentPageUrl4,
        componentPageUrl5,
        componentPageUrl6,
        componentPageUrl7,
        componentPageUrl8,
        overviewPageUrl
      )

      await page.goto(overviewPageUrl)
      await expect(page.locator("[data-testid=circularity-index-total-number__points-div]")).toHaveText(/29/)
    })
    test("if there are no components in variant, the overview and the catalog page should display a no components message", async ({
      page,
    }) => {
      const overviewPageUrl = getOverviewPageUrl(2)
      const catalogPageUrl = getCatalogPageUrl(2)

      await page.goto(overviewPageUrl)
      await expect(page.locator("[data-testid=no-components-message__h3__heading]")).toBeVisible()

      await page.goto(catalogPageUrl)
      await expect(page.locator("[data-testid=no-components-message__h3__heading]")).toBeVisible()
    })
  })
  test.describe("Passports Page", () => {
    test.beforeEach(async ({ page }) => {
      const overviewPageUrl = getOverviewPageUrl(1)

      await resetDb()
      await seedDb()

      await fillOutAllCircularityDetails(
        page,
        componentPageUrl1,
        componentPageUrl2,
        componentPageUrl3,
        componentPageUrl4,
        componentPageUrl5,
        componentPageUrl6,
        componentPageUrl7,
        componentPageUrl8,
        overviewPageUrl
      )
    })

    test("creates passport and displays values correctly", async ({ page }) => {
      const passportsPage = circularityToolPages.passportsPage
        .replace("<projectId>", projectId.toString())
        .replace("<variantId>", "1")

      await page.goto(passportsPage)
      await page.locator("[data-testid=project-passports__create-passport-button]").click()

      await expect(page.locator("[data-testid=project-passports__passport-link]")).toBeVisible()

      await page.locator("[data-testid=project-passports__passport-link]").click()
      await page.waitForURL(/\/grp/, { timeout: 5000 })

      await expect(page.locator("[data-testid=total-building-mass-value__dd]")).toHaveText(/50[.,]8 kg/)
      await expect(page.locator("[data-testid=nrf-value__dd]")).toHaveText(/100 m2/)

      const passportUrl = page.url()
      const passportComponent2Url = `${passportUrl}/catalog/components/${componentUuid2}`
      await page.goto(passportComponent2Url)

      await expect(page.locator("[data-testid=mass-value__dd]")).toHaveText(/50[.,]84 kg/)
      await expect(page.locator("[data-testid=material-class-description-value__dd]")).toHaveText(
        "Brettschichtholz - Sonderformen (Durchschnitt DE)"
      )

      await page.click("[data-testid=tabs__tab-button__circularity]")
      await expect(page.locator("[data-testid=circularity-index-value__dd]")).toHaveText(/29/)
    })
  })
})
