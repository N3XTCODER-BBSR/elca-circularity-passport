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
  globalSetup: "<rootDir>/tests/unit/dbSetup.ts",
  globalTeardown: "<rootDir>/tests/unit/dbTeardown.ts",
  collectCoverageFrom: [
    "lib/domain-logic/**/*.{js,jsx,ts,tsx}",
    "prisma/queries/**/*.{js,jsx,ts,tsx}", // Adjust the pattern based on your directory structure and file types
  ],
}

module.exports = createJestConfig(customJestConfig)
