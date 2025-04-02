# Contributing to elca-passport

We welcome contributions from the community.

If you plan to implement a new feature or make an improvement, please get in touch with the product owner ([Purcy Marte](mailto:purcy@n3xtcoder.org)) beforehand to make sure your implementation is in line with the application’s product vision and software architecture.

To ensure a smooth contribution process, please follow these guidelines:

## Pull Requests

- PRs should be self-contained with a short lifespan.
- Descriptive titles and squashed commits are required.
- Each PR triggers an isolated deployment on Scalingo.

## Tests

- Write tests with high coverage, particularly for logic components.
- UI tests are secondary but still important.
- Tests are mandatory for every PR.

## CI/CD

- All PRs must pass CI/CD checks before merging.
- Releases to production are done periodically.
