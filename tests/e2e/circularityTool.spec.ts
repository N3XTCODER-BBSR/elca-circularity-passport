import { expect, Page, test } from "@playwright/test"
import { circularityToolPages } from "tests/constants"
import { getAuthUserFile, resetDb } from "tests/utils"
import { users } from "./constants"

test.describe("Circularity tool", () => {
  const variantId = 1
  const projectId = 1

  const getComponentsPageUrl = (componentUuid: string) =>
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

  const componentPageUrl1 = getComponentsPageUrl(componentUuid1)
  const componentPageUrl2 = getComponentsPageUrl(componentUuid2)
  const componentPageUrl3 = getComponentsPageUrl(componentUuid3)
  const componentPageUrl4 = getComponentsPageUrl(componentUuid4)
  const componentPageUrl5 = getComponentsPageUrl(componentUuid5)
  const componentPageUrl6 = getComponentsPageUrl(componentUuid6)
  const componentPageUrl7 = getComponentsPageUrl(componentUuid7)
  const componentPageUrl8 = getComponentsPageUrl(componentUuid8)

  const overviewPageUrl = circularityToolPages.overviewPage
    .replace("<projectId>", projectId.toString())
    .replace("<variantId>", variantId.toString())

  test.use({ storageState: getAuthUserFile(users.projectOwnerUser.username) })

  test.describe("Component Page", () => {
    test.beforeAll(async () => {
      await resetDb()
    })

    test.beforeEach(async ({ page }) => {
      const componentUuid = "32af2f0b-d7d8-4fb1-8354-1e9736d4f513"

      const componentPageUrl = getComponentsPageUrl(componentUuid)

      await page.goto(componentPageUrl)
    })

    test("displays component overview correctly", async ({ page }) => {
      await expect(page.locator("[data-testid=component-page-overview__dd__number-installed]")).toHaveText("1")
      await expect(page.locator("[data-testid=component-page-overview__dd__ref-unit]")).toHaveText("m2")
    })

    test.describe("Component Layer 5", () => {
      test("displays material basic information (mass) correctly", async ({ page }) => {
        await expect(
          page.locator("[data-testid=component-layer__div__5]").locator("[data-testid=mass-value__dd]")
        ).toHaveText("720 kg")
      })
    })
    test.describe("Component Layer 7", () => {
      test('if the tBaustoff field is set, the Circularity Potential - Unbuilt - "EOL Total points" has the correct value', async ({
        page,
      }) => {
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
    })

    test("if there is at least one incomplete material, the overview page shows the empty state", async ({ page }) => {
      await page.goto(overviewPageUrl)
      await expect(page.locator("[data-testid=building-overview-empty-state__h3__heading]")).toBeVisible()
    })
    test('if there are no "incomplete" materials (and minimal 1 completed), the overview page shows a graph', async ({
      page,
    }) => {
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
  })
  test.describe("Passports Page", () => {
    test.beforeEach(async ({ page }) => {
      await resetDb()

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
        .replace("<variantId>", variantId.toString())

      await page.goto(passportsPage)
      await page.locator("[data-testid=project-passports__create-passport-button]").click()

      await page.waitForLoadState("networkidle")

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

const fillOutAllCircularityDetails = async (
  page: Page,
  componentPageUrl1: string,
  componentPageUrl2: string,
  componentPageUrl3: string,
  componentPageUrl4: string,
  componentPageUrl5: string,
  componentPageUrl6: string,
  componentPageUrl7: string,
  componentPageUrl8: string,
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
  await page.goto(componentPageUrl8)
  await page.locator("[data-testid=toggle__switch__25]").click()
  await page.locator("[data-testid=toggle__switch__26]").click()

  await page.waitForLoadState("networkidle")
  await page.goto(overviewPageUrl)
  await expect(page.locator("[data-testid=circularity-index-total-number__points-div]")).toHaveText(/4.72/)

  await page.waitForLoadState("networkidle")
  await page.goto(componentPageUrl1)
  await page.locator("[data-testid=toggle__switch__7]").click()

  await page.waitForLoadState("networkidle")
}
