const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: ["<rootDir>/e2e"],
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/domain-logic/**/*.{js,jsx,ts,tsx}", // Adjust the pattern based on your directory structure and file types
  ],
}

module.exports = createJestConfig(customJestConfig)
