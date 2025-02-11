import type { Config } from "jest"
import nextJest from "next/jest"

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: ["<rootDir>/tests"],
  collectCoverage: true,
  globalSetup: "<rootDir>/lib/db/db-test-setup.ts",
  globalTeardown: "<rootDir>/lib/db/db-test-teardown.ts",
  collectCoverageFrom: [
    "lib/domain-logic/**/*.{js,jsx,ts,tsx}",
    "prisma/queries/**/*.{js,jsx,ts,tsx}", // Adjust the pattern based on your directory structure and file types
  ],
}

module.exports = createJestConfig(customJestConfig)
