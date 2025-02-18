# E2E tests

## How to name data-testids values

Format: `component-name__element__modifier`

- component name: the React component name - does not need to be the exact name of the component
- element: the HTML element name
- modifier (not required): additional identifier eg. for list items that need a specific testid - can be a number that is unique to the list item

Example: `toggle__switch__23`
