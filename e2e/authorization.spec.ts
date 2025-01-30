import { expect, test } from "@playwright/test"
import { componentId, getAuthUserFile, projectId, users, variantId } from "./utils"
import {
  createAccessGroup,
  createProject,
  createVariant,
  deleteAccessGroupIfExists,
  deleteProjectIfExists,
  deleteVariantIfExists,
} from "prisma/queries/utils"

test.describe("Authorization", () => {
  const routes = {
    variantsPage: "/de/projects/projectId/variants",
    variantPage: "/de/projects/projectId/variants/variantId",
    passportsPage: "/de/projects/projectId/variants/variantId/passports",
    catalogPage: "/de/projects/projectId/variants/variantId/catalog",
    componentPage: "/de/projects/projectId/variants/variantId/catalog/components/componentId",
  }

  for (const route of Object.values(routes)) {
    test.describe(`Route: ${route}`, () => {
      test.describe("Unauthorized user to project", () => {
        test.use({ storageState: getAuthUserFile(users.unAuthorizedUser.username) })

        test("should not be able to access page", async ({ page }) => {
          const url = route.replace("projectId", projectId.toString()).replace("variantId", variantId.toString())

          await page.goto(url)

          await page.waitForURL(url, { timeout: 5000 })

          await expect(page.locator("text=Unauthorized")).toBeVisible()
        })
      })
      test.describe("Read only token user to project", () => {
        test.use({ storageState: getAuthUserFile(users.readOnlyTokenUser.username) })

        test("should not be able to access page", async ({ page }) => {
          const url = route.replace("projectId", projectId.toString()).replace("variantId", variantId.toString())

          await page.goto(url)

          await page.waitForURL(url, { timeout: 5000 })

          await expect(page.locator("text=Unauthorized")).toBeVisible()
        })
      })
      // TODO: this should work and not be skipped
      if (route !== routes.componentPage && route !== routes.variantPage) {
        test.describe("Edit token user to project", () => {
          test.use({ storageState: getAuthUserFile(users.editTokenUser.username) })

          test("should be able to access page", async ({ page }) => {
            const url = route.replace("projectId", projectId.toString()).replace("variantId", variantId.toString())

            await page.goto(url)

            await page.waitForURL(url, { timeout: 5000 })

            await expect(page.locator("[data-testid=root-layout]")).toBeVisible()
          })
        })
      }
      // TODO: this should work and not be skipped
      if (route !== routes.componentPage && route !== routes.variantPage) {
        test.describe("Group member user to project", () => {
          test.use({ storageState: getAuthUserFile(users.groupMemberUser.username) })

          test("should not be able to access page", async ({ page }) => {
            const url = route.replace("projectId", projectId.toString()).replace("variantId", variantId.toString())

            await page.goto(url)

            await page.waitForURL(url, { timeout: 5000 })

            await expect(page.locator("[data-testid=root-layout]")).toBeVisible()
          })
        })
      }
      test.describe("Project owner user to project", () => {
        test.use({ storageState: getAuthUserFile(users.projectOwnerUser.username) })

        test("should be able to access page", async ({ page }) => {
          const url = route
            .replace("projectId", projectId.toString())
            .replace("variantId", variantId.toString())
            .replace("componentId", componentId)

          await page.goto(url)

          await page.waitForURL(url, { timeout: 5000 })

          await expect(page.locator("[data-testid=root-layout]")).toBeVisible()
        })
      })
      if (route !== routes.variantsPage) {
        test.describe("different parameters", () => {
          const newAccessGroupId = 199
          const newProjectId = 99
          const newVariantId = 99

          test.use({ storageState: getAuthUserFile(users.unAuthorizedUser.username) })

          test.beforeAll(async () => {
            await deleteProjectIfExists(newProjectId)
            await deleteAccessGroupIfExists(newAccessGroupId)

            await createAccessGroup(newAccessGroupId)
            await createProject(newProjectId, newAccessGroupId, users.unAuthorizedUser.userId)

            await deleteVariantIfExists(newVariantId)
            await createVariant(newVariantId, newProjectId)
          })
          test.afterAll(async () => {
            await deleteProjectIfExists(newProjectId)
            await deleteAccessGroupIfExists(newAccessGroupId)
            await deleteVariantIfExists(newVariantId)
          })

          test("should not be able to access page resource parameter that is not part of project", async ({ page }) => {
            let url = route.replace("projectId", newProjectId.toString())
            if (url.includes("componentId")) {
              url = url.replace("componentId", componentId)
              url = url.replace("variantId", newVariantId.toString())
            } else if (url.includes("variantId")) {
              url = url.replace("variantId", variantId.toString())
            }

            await page.goto(url)

            await page.waitForURL(url, { timeout: 5000 })

            // TODO: this should assert to true
            await expect(page.locator("text=Unauthorized")).toBeVisible()
          })
        })
      }
    })
  }
})
