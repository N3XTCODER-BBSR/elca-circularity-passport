# Run performance tests

## Prerequisites

Copy the contents of the `/tests/performance/.env.EXAMPLE` file into a newly created `/tests/performance/.env` file

```
cp tests/performance/.env.EXAMPLE tests/performance/.env
```

... and adapt the values to your needs.

Then, be sure that the hardcoded value of the `users` constant in the `/tests/performance/constants.ts` file is set to a value that makes sense for your test.

## Run tests

Run the following command to start the performance tests in UI mode:

```bash
yarn performance:ui
```

Or run the following command to start the performance tests in headless mode:

```bash
yarn performance:headless
```

Both commands will spin up a maximum number of 100 parallel workers to run the test for each user a number of times specified by the `ITERATIONS_PER_USER` environment variable.

## See results

At the end of a test run, the test runner will log the results to the console and write them to a file named `/performance-summary.json`.
