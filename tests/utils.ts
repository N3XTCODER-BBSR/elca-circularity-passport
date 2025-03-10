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
import { chromium } from "@playwright/test"
import { execSync } from "node:child_process"
import { prisma } from "prisma/prismaClient"

export const getAuthUserFile = (username: string) => `playwright/.auth/${username}.json`

export const authenticateAs = async (baseUrl: string, username: string, password: string, alias?: string) => {
  const browser = await chromium.launch()

  const page = await browser.newPage()

  const signInUrl = `${baseUrl}/auth/signin`

  await page.goto(signInUrl)

  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)

  await page.click('button[type="submit"]')

  await page.waitForURL(/\/projects/, { timeout: 5000 })

  const userFile = getAuthUserFile(alias || username)

  await page.context().storageState({ path: userFile })
  await browser.close()
}

/**
 * reset new database by truncating all tables and settting the autoincrement to 1 and reapplying the seed
 */
export const resetDb = async () => {
  const result: { tables: string | null }[] = await prisma.$queryRaw`
    SELECT string_agg('"' || table_name || '"', ', ') as tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE '%migrations%';
  `

  const tables = result[0]?.tables

  if (tables) {
    const truncateSql = `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`
    await prisma.$executeRawUnsafe(truncateSql)
  }

  execSync(`SEED_INITIAL_DATA=true DATABASE_URL=${process.env.DATABASE_URL} yarn prisma:seed`, { stdio: "inherit" })
}
