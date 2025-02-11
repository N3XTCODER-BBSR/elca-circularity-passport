import { defineConfig, devices } from "@playwright/test"
import * as dotenv from "dotenv"
dotenv.config({ path: "./tests/performance/.env" })

export default defineConfig({
  testDir: "./tests/performance",
  fullyParallel: true,
  workers: 100,
  testMatch: /\/.*\.spec\.ts/,
  globalSetup: "./tests/performance/setup.ts",
  use: {
    baseURL: process.env.BASE_URL,
    ...devices["Desktop Chrome"],
  },
  reporter: [
    ["list"], // optional built-in reporter for standard output
    [require.resolve("./tests/performance/customPerformanceReporter")], // our custom reporter
  ],
})
