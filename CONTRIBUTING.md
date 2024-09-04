# Contributing to elca-passport

We welcome contributions from the community. To ensure a smooth contribution process, please follow these guidelines:

## Code Style
- Follow the naming conventions and function style as defined in the codebase.
- No usage of `eslint-ignore` or `ts-ignore` tags.
- No explicit `any` types.

## Pull Requests
- PRs should be self-contained with a short lifespan.
- Descriptive titles and squashed commits are required.
- All PRs should be linked to a ticket number, if applicable.
- Each PR triggers an isolated deployment on Scalingo.

## Tests
- Write tests with high coverage, particularly for logic components.
- UI tests are secondary but still important.
- Tests are mandatory for every PR.

## CI/CD
- All PRs must pass CI/CD checks before merging.
- We use semantic-release for versioning and release management.
- Releases to production are done periodically.

## Local Development
- Use `.env.example` as a
