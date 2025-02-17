import type { StartedTestContainer } from "testcontainers"
import { setupTestDBs } from "tests/setUpDbs"

const main = async () => {
  try {
    const { passportDbContainer, passportDbUrl, elcaDbContainer, elcaDbUrlWithReadOnlyUser, elcaDbUrlWithSuperUser } =
      await setupTestDBs()

    process.env.DATABASE_URL = passportDbUrl
    process.env.ELCA_LEGACY_DATABASE_URL = elcaDbUrlWithReadOnlyUser
    process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING = elcaDbUrlWithSuperUser
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__PASSPORT_DB_CONTAINER__ = passportDbContainer
    ;(globalThis as unknown as { [key: string]: StartedTestContainer }).__ELCA_DB_CONTAINER__ = elcaDbContainer
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
