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
