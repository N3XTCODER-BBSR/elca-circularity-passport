# eLCA Circularity Index and Building Resource Passport

Welcome to the eLCA Circularity Index and Building Resource Passport, a stand-alone open-source project that extends the functionality of eLCA ([bauteileditor.de](https://www.bauteileditor.de)).

eLCA Circularity Index is a web-based add-on to eLCA, to calculate the circularity score of a building according to the BNB 4.1.4. standard. eLCA Building Resource Passport is a website for exploring and downloading normed sustainability indicators of a building.

## Features & Tech Stack

- **Next.js 14 with App Router:**
  We use Next.js 14 with the new app router to build our web app.

- **Databases:** The project accesses two PostgreSQL databases:
  - One for the eLCA app data (existing, primary database of eLCA)
  - One for app-specific data.
- **Tailwind CSS & React Components**: Tailwind CSS helps with quick styling, while React builds our UI components.

- **Server Rendered Components:** Some components are rendered on the server to improve performance and SEO.
- **Server Actions and react-query:** We use server-actions for manipulating data and we additionally introduced react-query for more complex data-input/update scenarios (mainly on the Circularity Tools component detail page).

- **Testing:**

  - Jest: for unit testing.
  - Playwright: for end-to-end testing.

- **CI/CD with GitHub Actions:** We use GitHub Actions to run tests, check our code style, and build the project automatically on every commit and pull request. This keeps the code reliable and speeds up our development process.

## Table of Contents

- [eLCA Circularity Index and Building Resource Passport](#elca-circularity-index-and-building-resource-passport)
  - [Features & Tech Stack](#features--tech-stack)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
    - [Run local development server](#run-local-development-server)
  - [Scripts Overview](#scripts-overview)
  - [Environment Variables handling](#environment-variables-handling)
  - [Release Workflow](#release-workflow)
  - [Contribution](#contribution)
  - [License](#license)

## Getting Started

### Prerequisites

- **Docker:**  
  [Install Docker](https://docs.docker.com/get-docker/) and ensure you're authenticated to Docker Hub.

- **Node.js (version >=20.0.0 and <22.7.0):**
  [Install Node.js](https://nodejs.org/en/download/) or use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.

- **Yarn**:
  Ensure Yarn is installed as the project requires it as the package manager. [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install) if you don't already have it.

- **eLCA Application:**  
  The eLCA app and its database must be running locally.  
  [Set it up here](https://github.com/n3xtcoder/elca-beibob-elca?tab=readme-ov-file#getting-started).

- **PDF export:**  
  The PDF export feature uses the [Doppio](https://doppio.sh/) service to render the PDF.

  We also use a custom, European S3 bucket instead of Doppios default Google Cloud Storage bucket.
  So you also need to create a (AWS S3 compatible) S3 bucket and set the following environment variables:

  - `S3_BUCKET_NAME`
  - `S3_ACCESS_KEY`
  - `S3_SECRET_KEY`
  - `S3_REGION`
  - `S3_ENDPOINT`
    Also, you need to ensure that the S3 bucket is configured to allow public access to the objects (often called 'Static Website Hosting' in the S3 console).

### Installation Steps

1. **Fork & clone the repository:**

   ```bash
   ## Don't forget to ⭐ star and fork it first :)
   git clone https://github.com/<your_username>/elca-app.git
   cd elca-app
   ```

2. **Set up Git Hooks for Conventional Commits (Optional but Recommended):**  
   We use [git-conventional-commits](https://github.com/qoomon/git-conventional-commits) to maintain a consistent commit history.

   **macOS users:**

   ```sh
     brew install pre-commit
     pre-commit install -t commit-msg
   ```

### Run local development server

1. **Install dependencies:**

   ```bash
   yarn install --frozen-lockfile
   ```

2. **Set up environment variables and start the DB:**

   ```bash
   cp .env.EXAMPLE .env
   yarn db:dev
   ```

3. **Generate Prisma client, run migrations and seed data:**

   ```bash
   yarn prisma:generate
   yarn prisma:migrate
   yarn prisma:seed
   ```

4. **Start the development server:**

   ```bash
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## Scripts Overview

The following scripts are available in the `package.json`:

- `dev`: Starts the development server
- `db:dev`: Start the main DB server as Docker container
- `build`: Builds the app for production
- `start`: Starts the production server
- `lint`: Lints the code using ESLint
- `lint:fix`: Automatically fixes linting errors
- `prettier`: Checks the code for proper formatting
- `prettier:fix`: Automatically fixes formatting issues
- `analyze`: Analyzes the bundle sizes for Client, Server and Edge environments
- `test`: Runs unit tests
- `e2e:headless`: Runs end-to-end tests in headless mode
- `e2e:ui`: Runs end-to-end tests with UI
- `format`: Formats the code with Prettier
- `postinstall`: Applies patches to external dependencies
- `preinstall`: Ensures the project is installed with Yarn
- `prisma:generate`: Generates the Prisma clients
- `prisma:migrate`: Runs the Prisma migrations
- `prisma:migrate-legacy`: Runs the Prisma migrations for the legacy database
- `prisma:seed`: Seeds the database with initial data

## Environment Variables handling

We manage environment variables explicitly in the `.env.EXAMPLE` file, which is committed to the repository to serve as a reference. Every new environment variable must be added to this file to ensure consistency across development and deployment environments.

We use `@t3-oss/env-nextjs` with `zod` for validation and type safety. Environment variables are defined in `env.mjs`.

## Release Workflow

To create a new release, follow these steps:

1. **Review Changes**:

   ```bash
   git fetch origin main:main # or just pull
   git diff prod..main
   ```

   This shows all changes since the last production release.

2. **Update CHANGELOG.md**:
   Add a detailed entry in the CHANGELOG.md file documenting all changes in this release.

3. **Commit the Release**:
   Create a commit with a message formatted as follows:

   ```
   release: Version x.x.x

   * Change 1 description
   * Change 2 description
   ```

   The commit message should:

   - Start with "release: Version x.x.x"
   - Include a shorter summary of the changes as bullet points after a new line
   - Be more concise than the CHANGELOG.md entry but cover the key changes

## Contribution

We welcome contributions from the community! Check the [CONTRIBUTING.md](./CONTRIBUTING.md) file for details.

## License

This project is licensed under the GNU Affero General Public License (AGPL). For more information, see the [LICENSE](./LICENSE) file.
