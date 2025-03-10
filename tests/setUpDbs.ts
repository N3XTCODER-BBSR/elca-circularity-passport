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
import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { StartedNetwork } from "testcontainers"
import { exec } from "node:child_process"
import { promisify } from "node:util"

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
