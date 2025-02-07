// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

module.exports = {
  parser: "@typescript-eslint/parser", // Specify the ESLint parser
  extends: [
    "next",
    "prettier",
    "plugin:@typescript-eslint/recommended", // Add TypeScript ESLint recommended rules
    "plugin:storybook/recommended",
    "plugin:tailwindcss/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  plugins: ["@typescript-eslint", "unused-imports"],
  rules: {
    "no-unused-vars": "off", // Turn off ESLint's no-unused-vars as we are using @typescript-eslint's version
    "@typescript-eslint/no-explicit-any": "warn",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
    ],
    "tailwindcss/no-custom-classname": "off",
    "testing-library/prefer-screen-queries": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "sort-imports": [
      "warn",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "tailwindcss/classnames-order": "off",
    "import/order": [
      1,
      {
        groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
        pathGroups: [
          ...getDirectoriesToSort().map((singleDir) => ({
            pattern: `${singleDir}/**`,
            group: "internal",
          })),
          {
            pattern: "env",
            group: "internal",
          },
          {
            pattern: "theme",
            group: "internal",
          },
          {
            pattern: "public/**",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
}

function getDirectoriesToSort() {
  const ignoredSortingDirectories = [".git", ".next", ".vscode", "node_modules"]
  return getDirectories(process.cwd()).filter((f) => !ignoredSortingDirectories.includes(f))
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory()
  })
}
