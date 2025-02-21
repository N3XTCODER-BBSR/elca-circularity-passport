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
