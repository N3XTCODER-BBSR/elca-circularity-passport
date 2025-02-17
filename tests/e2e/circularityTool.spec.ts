import { test, expect } from "@playwright/test"
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
    const componentUuid1 = "32af2f0b-d7d8-4fb1-8354-1e9736d4f513"
    const componentUuid2 = "1b9ead66-2911-4b60-983b-0eeb118d6837"
    const componentUuid3 = "17517962-b544-4433-b4bc-49aa101814ab"
    const componentUuid4 = "d34f62e8-cfa9-42b5-9944-583652aecf34"
    const componentUuid5 = "c74c2dc0-04b9-4f68-af43-5450ba04ea1e"
    const componentUuid6 = "e05939a3-370a-4d8a-b8e5-a0633055806d"
    const componentUuid7 = "6568c2fd-9105-4bfa-a85c-a5f8d19aff7b"

    const componentPageUrl1 = getComponentsPageUrl(componentUuid1)
    const componentPageUrl2 = getComponentsPageUrl(componentUuid2)
    const componentPageUrl3 = getComponentsPageUrl(componentUuid3)
    const componentPageUrl4 = getComponentsPageUrl(componentUuid4)
    const componentPageUrl5 = getComponentsPageUrl(componentUuid5)
    const componentPageUrl6 = getComponentsPageUrl(componentUuid6)
    const componentPageUrl7 = getComponentsPageUrl(componentUuid7)

    const overviewPageUrl = circularityToolPages.overviewPage
      .replace("<projectId>", projectId.toString())
      .replace("<variantId>", variantId.toString())

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
      await page.goto(overviewPageUrl)
      await expect(page.locator("[data-testid=circularity-index-total-number__points-div]")).toHaveText(/29/)
    })
  })
  // TODO: ideally update seed data in elca-legacy to have something different like 10 m2.
})
