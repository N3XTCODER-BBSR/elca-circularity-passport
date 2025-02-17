import type { StartedTestContainer } from "testcontainers"

const main = async (): Promise<void> => {
  try {
    await (
      globalThis as unknown as {
        __PASSPORT_DB_CONTAINER__: StartedTestContainer
      }
    ).__PASSPORT_DB_CONTAINER__.stop()

    await (
      globalThis as unknown as {
        __ELCA_DB_CONTAINER__: StartedTestContainer
      }
    ).__ELCA_DB_CONTAINER__.stop()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main
