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
const elcaDbPassword = "password"

const elcaDbDumpFile = "elca_db_dump.sql"

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
          source: `${process.cwd()}/${elcaDbDumpFile}`,
          target: `/tmp/${elcaDbDumpFile}`,
        },
      ])
      .start()

    const passportDbPort = passportDbContainer.getMappedPort(5432).toString()
    const elcaDbPort = elcaDbContainer.getMappedPort(5432).toString()

    const passportDbUrl = `postgres://${buildingPassportDbUsername}:${buildingPassportDbPassword}@localhost:${passportDbPort}/${buildingPassportDbName}`
    const elcaDbUrl = `postgres://${elcaDbUsername}:${elcaDbPassword}@localhost:${elcaDbPort}/${elcaDbName}`

    process.env.DATABASE_URL = passportDbUrl
    process.env.ELCA_LEGACY_DATABASE_URL = elcaDbUrl
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__PASSPORT_DB_CONTAINER__ = passportDbContainer
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__ELCA_DB_CONTAINER__ = elcaDbContainer

    // migrations for passport db
    await execAsync(`DATABASE_URL=${passportDbUrl} yarn prisma migrate deploy`)

    // run migrations for elca db
    await elcaDbContainer.exec(["psql", "-U", elcaDbUsername, "-f", `/tmp/${elcaDbDumpFile}`])
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
