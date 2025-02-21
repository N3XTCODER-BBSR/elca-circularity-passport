import { test } from "@playwright/test"
import { getAuthUserFile } from "tests/utils"
import { performanceMetricsArtifactsName, users } from "./constants"
import { ArtifactMetric } from "./types"
import { circularityToolPages } from "tests/constants"

const iterationsPerUser = parseInt(process.env.ITERATIONS_PER_USER!)
const testTimeout = (process.env.TEST_TIMEOUT_IN_SECONDS ? parseInt(process.env.TEST_TIMEOUT_IN_SECONDS) : 120) * 1000

test.describe("Performance", () => {
  test.setTimeout(testTimeout)

  for (const [username, { projectId, componentId, variantId }] of Object.entries(users)) {
    test.describe(`User: ${username}`, () => {
      test.use({ storageState: getAuthUserFile(username) })

      for (let i = 0; i < iterationsPerUser; i++) {
        test(`Iteration ${i + 1} for user ${username}: should load all pages`, async ({ page }, testInfo) => {
          const metrics: Array<Record<string, any>> = []

          const resolvedPages = Object.entries(circularityToolPages).map(([pageName, pageUrl]) => {
            return [
              pageName,
              pageUrl
                .replace("<projectId>", projectId)
                .replace("<variantId>", variantId)
                .replace("<componentId>", componentId),
            ]
          })

          for (const [pageName, pageUrl] of resolvedPages) {
            const startTime = Date.now()

            await page.goto(pageUrl!)

            await page.waitForLoadState("load")

            const duration = Date.now() - startTime

            const newMetric: ArtifactMetric = {
              pageName: pageName!,
              pageUrl: pageUrl!,
              duration,
            }

            metrics.push(newMetric)
          }

          // Attach the metrics JSON as an artifact in the test report.
          testInfo.attach(performanceMetricsArtifactsName, {
            body: JSON.stringify(metrics, null, 2),
            contentType: "application/json",
          })
        })
      }
    })
  }
})
