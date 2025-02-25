import { FullConfig } from "@playwright/test"
import dotenv from "dotenv"
import { GenericContainer, Network, type StartedTestContainer } from "testcontainers"
import fs from "node:fs"
import { setupElcaTestDB, setupPassportTestDB } from "tests/setUpDbs"

const testEnvFileName = ".env.e2e_tests"

const globalSetup = async () => {
  const network = await new Network().start()

  console.log("Sets up DB containers...")
  const [
    {
      container: elcaDbContainer,
      dbUrlWithReadOnlyUser: elcaDbUrlWithReadOnlyUser,
      dbUrlWithSuperUser: elcaDbUrlWithSuperUser,
      internalUrlWithReadOnlyUser: elcaInternalUrlWithReadOnlyUser,
      internalUrlWithSuperUser: elcaInternalUrlWithSuperUser,
    },
    { container: passportDbContainer, dbUrl: passportDbUrl, internalUrl: passportInternalUrl },
  ] = await Promise.all([setupElcaTestDB(network, "elca"), setupPassportTestDB(network, "passport")])

  ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__PASSPORT_DB_CONTAINER__ = passportDbContainer
  ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__ELCA_DB_CONTAINER__ = elcaDbContainer

  console.log("Builds app image...")
  const appContainerBuilder = await GenericContainer.fromDockerfile(".", "Dockerfile.e2e").build()

  const databaseEnvs = {
    DATABASE_URL: passportInternalUrl,
    ELCA_LEGACY_DATABASE_URL: elcaInternalUrlWithReadOnlyUser,
    ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING: elcaInternalUrlWithSuperUser,
  }

  const envFile = fs.readFileSync(testEnvFileName)
  const envFileEnvs = dotenv.parse(envFile)

  const envs = {
    ...databaseEnvs,
    ...envFileEnvs,
  }

  console.log("Starts app container...")
  const port = 3000
  const appContainer = await appContainerBuilder
    .withEnvironment(envs)
    .withExposedPorts(port)
    .withNetwork(network)
    .withCommand(["sh", "-c", `yarn prisma:generate && npx prisma migrate deploy && PORT=${port} yarn start`])
    .start()

  ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__APP_CONTAINER__ = appContainer

  const appPort = appContainer.getMappedPort(port)

  const baseUrl = `http://localhost:${appPort}`
  console.log("App is running on", baseUrl)

  process.env.DATABASE_URL = passportDbUrl
  process.env.ELCA_LEGACY_DATABASE_URL = elcaDbUrlWithReadOnlyUser
  process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING = elcaDbUrlWithSuperUser
  process.env.BASE_URL = baseUrl

  // HINT: don't use static import so that the prisma client is only created after the dyncamic DB URL env vars are set
  const { createUsers } = require("./utils")

  console.log("Creates test users...")
  await createUsers(baseUrl, "password1!")
}

const main = async (_: FullConfig) => {
  try {
    console.log("Global Setup Running...")
    await globalSetup()
    console.log("Global Setup finished.")
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
