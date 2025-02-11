import { FullConfig } from "@playwright/test"
import { authenticateAs } from "tests/utils"
import { z, ZodError } from "zod"
import { users } from "./constants"

const password = process.env.PERFORMANCE_TEST_USER_PASSWORD
const baseURL = process.env.BASE_URL
const iterationsPerUser = process.env.ITERATIONS_PER_USER

const globalSetup = async (config: FullConfig) => {
  // validate environment variables
  try {
    z.string().min(4).parse(password)
    z.string().url().parse(baseURL)
    z.string().parse(iterationsPerUser)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error(
        "Invalid environment variables. Please set up environement variables in the .env.performance_tests file."
      )
    }

    throw error
  }

  console.log("Global Setup Running...")

  for (const username of Object.keys(users)) {
    await authenticateAs(config.projects[0]!.use.baseURL!, username!, password!)
  }

  console.log("Global Setup finished.")
}

export default globalSetup
