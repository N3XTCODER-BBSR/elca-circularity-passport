import { PostgreSqlContainer } from "@testcontainers/postgresql"
import type { StartedTestContainer } from "testcontainers"

const buildingPassportDbName = "building_passport"
const buildingPassportDbUsername = "building_passport"
const buildingPassportDbPassword = "password"

const elcaDbName = "elca"
const elcaDbUsername = "elca"
const elcaDbPassword = "password"

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
      // .withBindMounts([
      //   {
      //     source: `${process.cwd()}/legacy_db_test_data`,
      //     target: "/var/lib/postgresql/data",
      //   },
      // ])
      .start()

    const passportDbPort = passportDbContainer.getMappedPort(5432).toString()
    const elcaDbPort = elcaDbContainer.getMappedPort(5432).toString()

    const passportDbUrl = `postgres://${buildingPassportDbUsername}:${buildingPassportDbPassword}:${passportDbPort}/${buildingPassportDbName}`
    const elcaDbUrl = `postgres://${elcaDbUsername}:${elcaDbPassword}@localhost:${elcaDbPort}/${elcaDbName}`

    process.env.DATABASE_URL = passportDbUrl
    process.env.ELCA_LEGACY_DATABASE_URL = elcaDbUrl
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__PASSPORT_DB_CONTAINER__ = passportDbContainer
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__ELCA_DB_CONTAINER__ = elcaDbContainer
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
