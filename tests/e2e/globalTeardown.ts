import { StartedTestContainer } from "testcontainers"

const main = async () => {
  try {
    await (globalThis as unknown as { [key: string]: StartedTestContainer }).__PASSPORT_DB_CONTAINER__?.stop()
    await (globalThis as unknown as { [key: string]: StartedTestContainer }).__ELCA_DB_CONTAINER__?.stop()
    await (globalThis as unknown as { [key: string]: StartedTestContainer }).__APP_CONTAINER__?.stop()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
