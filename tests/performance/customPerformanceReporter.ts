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
// custom-performance-reporter.ts
import { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter"
import fs from "fs"
import { performanceMetricsArtifactsName } from "./constants"
import { ArtifactMetric } from "./types"

type Metric = {
  count: number
  totalDuration: number
  min: number
  max: number
}

type AggregatedMetrics = {
  [pageName: string]: Metric
}

type UserAggregatedMetrics = {
  [user: string]: AggregatedMetrics
}

export default class CustomPerformanceReporter implements Reporter {
  // Aggregated metrics per user.
  private userMetrics: UserAggregatedMetrics = {}
  // Aggregated overall metrics.
  private overallMetrics: AggregatedMetrics = {}

  onBegin() {
    console.log("Starting performance tests aggregation...")
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Extract user/group from test title path.
    // Expecting title path to be like: [ "", "", "Performance", "Performance Test User 1", "Iteration X: ..." ]
    const titlePath = test.titlePath()
    const userGroup = (titlePath.find((title) => title.startsWith("User:")) || "Unknown User").replace("User: ", "")

    // Look for an attachment
    for (const attachment of result.attachments) {
      if (attachment.name === performanceMetricsArtifactsName && attachment.body) {
        try {
          // Ensure attachment.body is a string.
          const jsonStr = typeof attachment.body === "string" ? attachment.body : attachment.body.toString()
          const metricsArray = JSON.parse(jsonStr) as Array<ArtifactMetric>

          // Aggregate metrics from this test iteration.
          for (const metric of metricsArray) {
            const pageName = metric.pageName
            const duration = metric.duration

            // Update per-user metrics.
            if (!this.userMetrics[userGroup]) {
              this.userMetrics[userGroup] = {}
            }
            if (!this.userMetrics[userGroup][pageName]) {
              this.userMetrics[userGroup][pageName] = {
                count: 0,
                totalDuration: 0,
                min: Number.MAX_VALUE,
                max: 0,
              }
            }
            const userMetric = this.userMetrics[userGroup][pageName]
            userMetric.count++
            userMetric.totalDuration += duration
            userMetric.min = Math.min(userMetric.min, duration)
            userMetric.max = Math.max(userMetric.max, duration)

            // Update overall metrics.
            if (!this.overallMetrics[pageName]) {
              this.overallMetrics[pageName] = {
                count: 0,
                totalDuration: 0,
                min: Number.MAX_VALUE,
                max: 0,
              }
            }
            const overallMetric = this.overallMetrics[pageName]
            overallMetric.count++
            overallMetric.totalDuration += duration
            overallMetric.min = Math.min(overallMetric.min, duration)
            overallMetric.max = Math.max(overallMetric.max, duration)
          }
        } catch (err) {
          console.error(`Error parsing performance metrics for test "${test.title}": ${err}`)
        }
      }
    }
  }

  onEnd(result: FullResult) {
    console.log("\n===== Performance Tests Summary =====\n")

    console.log("Overall Metrics:")
    for (const pageName in this.overallMetrics) {
      const metric = this.overallMetrics[pageName]!
      const avg = (metric.totalDuration / metric.count).toFixed(2)
      console.log(`  ${pageName}: count=${metric.count}, avg=${avg}ms, min=${metric.min}ms, max=${metric.max}ms`)
    }

    console.log("\nPer User Metrics:")
    for (const user in this.userMetrics) {
      console.log(`\nUser: ${user}`)
      const metrics = this.userMetrics[user]
      for (const pageName in metrics) {
        const metric = metrics[pageName]!
        const avg = (metric.totalDuration / metric.count).toFixed(2)
        console.log(`  ${pageName}: count=${metric.count}, avg=${avg}ms, min=${metric.min}ms, max=${metric.max}ms`)
      }
    }

    // Create a summary object.
    const summary = {
      overall: this.overallMetrics,
      perUser: this.userMetrics,
    }

    // Write the summary to a JSON file.
    fs.writeFileSync("performance-summary.json", JSON.stringify(summary, null, 2))
    console.log("\nPerformance summary written to performance-summary.json")
  }
}
