import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { StartedNetwork } from "testcontainers"

/**
 * set up elca and passport DB using testcontainers, run migrations for both DBs and creates read-only user for elca DB
 * @returns passportDbUrl, elcaDbUrlWithReadOnlyUser, elcaDbUrlWithSuperUser, passportDbContainer, elcaDbContainer
 */

export const setupElcaTestDB = async (startedNetwork?: StartedNetwork, networkAlias?: string) => {
  const dbName = "elca"
  const dbUsername = "elca"
  const dbReadOnlyUsername = "elca_read_only"
  const dbPassword = "password"

  const sqlScriptsDir = "sql_scripts"
  const elcaDbInitScript = "elca_db_init.sql"
  const createReadOnlyUserScript = "create_read_only_user.sql"

  let containerBuilder = new PostgreSqlContainer("postgres:13-alpine")
    .withDatabase(dbName)
    .withUsername(dbUsername)
    .withPassword(dbPassword)
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

  if (startedNetwork && networkAlias) {
    containerBuilder = containerBuilder.withNetwork(startedNetwork).withNetworkAliases(networkAlias)
  }

  const container = await containerBuilder.start()

  const dbPort = container.getMappedPort(5432).toString()

  const internalUrlWithSuperUser = `postgres://${dbUsername}:${dbPassword}@${networkAlias}:5432/${dbName}`
  const internalUrlWithReadOnlyUser = `postgres://${dbReadOnlyUsername}:${dbPassword}@${networkAlias}:5432/${dbName}`
  const dbUrlWithSuperUser = `postgres://${dbUsername}:${dbPassword}@localhost:${dbPort}/${dbName}`
  const dbUrlWithReadOnlyUser = `postgres://${dbReadOnlyUsername}:${dbPassword}@localhost:${dbPort}/${dbName}`

  // run migrations for elca db
  const runDbInitScriptOutput = await container.exec(["psql", "-U", dbUsername, "-f", `/tmp/${elcaDbInitScript}`])
  if (runDbInitScriptOutput.exitCode !== 0) {
    throw new Error(`Failed to run elca db init script: ${runDbInitScriptOutput.output}`)
  }

  // create read only user
  const runCreateReadOnlyUserScript = await container.exec([
    "psql",
    "-U",
    dbUsername,
    "-f",
    `/tmp/${createReadOnlyUserScript}`,
  ])

  if (runCreateReadOnlyUserScript.exitCode !== 0) {
    throw new Error(`Failed to run create read only user script: ${runCreateReadOnlyUserScript.output}`)
  }

  return {
    internalUrlWithReadOnlyUser,
    internalUrlWithSuperUser,
    dbUrlWithReadOnlyUser,
    dbUrlWithSuperUser,
    container,
  }
}

export const setupPassportTestDB = async (startedNetwork?: StartedNetwork, networkAlias?: string) => {
  const dbName = "building_passport"
  const dbUsername = "building_passport"
  const dbPassword = "password"

  const containerBuilder = new PostgreSqlContainer("postgres:16.3-alpine")
    .withDatabase(dbName)
    .withUsername(dbUsername)
    .withPassword(dbPassword)
    .withExposedPorts(5432)

  if (startedNetwork && networkAlias) {
    containerBuilder.withNetwork(startedNetwork).withNetworkAliases(networkAlias)
  }

  const container = await containerBuilder.start()

  const dbPort = container.getMappedPort(5432).toString()
  const dbUrl = `postgres://${dbUsername}:${dbPassword}@localhost:${dbPort}/${dbName}`
  const internalUrl = `postgres://${dbUsername}:${dbPassword}@${networkAlias}:5432/${dbName}`

  const execAsync = promisify(exec)
  await execAsync(`DATABASE_URL=${dbUrl} yarn prisma migrate deploy`)

  return {
    internalUrl,
    dbUrl,
    container,
  }
}

export const setupTestDBs = async () => {
  const [
    {
      container: elcaDbContainer,
      dbUrlWithReadOnlyUser: elcaDbUrlWithReadOnlyUser,
      dbUrlWithSuperUser: elcaDbUrlWithSuperUser,
    },
    { container: passportDbContainer, dbUrl: passportDbUrl },
  ] = await Promise.all([setupElcaTestDB(), setupPassportTestDB()])

  return {
    passportDbUrl,
    elcaDbUrlWithReadOnlyUser,
    elcaDbUrlWithSuperUser,
    passportDbContainer,
    elcaDbContainer,
  }
}
