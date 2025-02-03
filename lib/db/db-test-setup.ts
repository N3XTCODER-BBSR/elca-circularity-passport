import { PostgreSqlContainer } from "@testcontainers/postgresql"
import type { StartedTestContainer } from "testcontainers"
import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

const buildingPassportDbName = "building_passport"
const buildingPassportDbUsername = "building_passport"
const buildingPassportDbPassword = "password"

const elcaDbName = "elca"
const elcaDbUsername = "elca"
const elcaDbReadOnlyUsername = "elca_read_only"
const elcaDbPassword = "password"

const sqlScriptsDir = "sql_scripts"
const elcaDbInitScript = "elca_db_init.sql"
const createReadOnlyUserScript = "create_read_only_user.sql"

const main = async () => {
  try {
    const passportDbContainer = await new PostgreSqlContainer("postgres:16.3-alpine")
      .withDatabase(buildingPassportDbName)
      .withUsername(buildingPassportDbUsername)
      .withPassword(buildingPassportDbPassword)
      .withExposedPorts(5432)
      .start()

    const elcaDbContainer = await new PostgreSqlContainer("postgres:13-alpine")
      .withDatabase(elcaDbName)
      .withUsername(elcaDbUsername)
      .withPassword(elcaDbPassword)
      .withExposedPorts(5432)
      .withBindMounts([
        {
          source: `${process.cwd()}/${sqlScriptsDir}/${elcaDbInitScript}`,
          target: `/tmp/${elcaDbInitScript}`,
        },
        {
          source: `${process.cwd()}/${sqlScriptsDir}/${createReadOnlyUserScript}`,
          target: `/tmp/${createReadOnlyUserScript}`,
        },
      ])
      .start()

    const passportDbPort = passportDbContainer.getMappedPort(5432).toString()
    const elcaDbPort = elcaDbContainer.getMappedPort(5432).toString()

    const passportDbUrl = `postgres://${buildingPassportDbUsername}:${buildingPassportDbPassword}@localhost:${passportDbPort}/${buildingPassportDbName}`
    const elcaDbUrlWithSuperUser = `postgres://${elcaDbUsername}:${elcaDbPassword}@localhost:${elcaDbPort}/${elcaDbName}`
    const elcaDbUrlWithReadOnlyUser = `postgres://${elcaDbReadOnlyUsername}:${elcaDbPassword}@localhost:${elcaDbPort}/${elcaDbName}`

    // migrations for passport db
    await execAsync(`DATABASE_URL=${passportDbUrl} yarn prisma migrate deploy`)

    // run migrations for elca db
    const runElcaDbInitScriptOutput = await elcaDbContainer.exec([
      "psql",
      "-U",
      elcaDbUsername,
      "-f",
      `/tmp/${elcaDbInitScript}`,
    ])
    if (runElcaDbInitScriptOutput.exitCode !== 0) {
      throw new Error(`Failed to run elca db init script: ${runElcaDbInitScriptOutput.output}`)
    }

    // create read only user
    const runCreateReadOnlyUserScript = await elcaDbContainer.exec([
      "psql",
      "-U",
      elcaDbUsername,
      "-f",
      `/tmp/${createReadOnlyUserScript}`,
    ])

    if (runCreateReadOnlyUserScript.exitCode !== 0) {
      throw new Error(`Failed to run create read only user script: ${runCreateReadOnlyUserScript.output}`)
    }

    process.env.DATABASE_URL = passportDbUrl
    process.env.ELCA_LEGACY_DATABASE_URL = elcaDbUrlWithReadOnlyUser
    process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING = elcaDbUrlWithSuperUser
    process.env.DATABASE_POOL_MAX_CONN = 2
    process.env.DATABASE_POOL_TIMEOUT = "20000"
    process.env.LEGACY_DATABASE_POOL_MAX_CONN = "2"
    process.env.LEGACY_DATABASE_POOL_TIMEOUT = "20000"

    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__PASSPORT_DB_CONTAINER__ = passportDbContainer
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__ELCA_DB_CONTAINER__ = elcaDbContainer
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
