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
import { FullConfig } from "@playwright/test"
import { authenticateAs } from "tests/utils"
import { z, ZodError } from "zod"
import { users } from "./constants"

const password = process.env.PERFORMANCE_TEST_USER_PASSWORD
const baseURL = process.env.BASE_URL
const iterationsPerUser = process.env.ITERATIONS_PER_USER

const globalSetup = async (config: FullConfig) => {
  // validate environment variables
  try {
    z.string().min(4).parse(password)
    z.string().url().parse(baseURL)
    z.string().parse(iterationsPerUser)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error(
        "Invalid environment variables. Please set up environement variables in the .env.performance_tests file."
      )
    }

    throw error
  }

  console.log("Global Setup Running...")

  for (const username of Object.keys(users)) {
    await authenticateAs(config.projects[0]!.use.baseURL!, username!, password!)
  }

  console.log("Global Setup finished.")
}

export default globalSetup
