## [Release 0.2.1] - 2025-03-04

### Added

- **Volume Calculation Tests:** Introduced tests for volume calculation along with a refactoring that moves the calculation logic into its own file and adds a wrapper function (`getVolumeForProduct`).
- **Product Separation:** Implemented a new feature to separate products into “Layers” and “Other Materials” with updated wording and the new `isLayer` attribute.
- **Internationalization:** Added Spanish translations and expanded internationalization content for the NoComponentsMessage component.
- **End-to-End Testing:** Added E2E tests for the NoComponentsMessage display and empty state handling.
- **API Enhancements:** Extended the `/api/health` endpoint to include database information.
- **Request Tracing:** Introduced middleware that sets a request ID and logs it in server components and actions for improved traceability.

### Fixed

- **Chart Data Aggregation:** Resolved multiple issues with chart data aggregation for the Circular Overview Page—including fixes for chart 1 and chart 2—and addressed aggregation problems in the “Breakdown by DIN” view by correcting the transform function (aggregating on a component level rather than the product level).
- **Mass Formatting:** Fixed display issues for mass values by ensuring fractional digits are shown correctly on the overview page and corrected unit/number formatting in the GRP PDF.
- **Test Infrastructure:** Adjusted E2E tests and seeding data as per review comments, and improved debug-level logging for test containers.

### Improved / Refactored

- **Performance Enhancements:** Refactored database calls using batching to reduce overhead and optimized DB call volume in the project circularity index and component pages.
- **Code Cleanup:** Replaced usage of `idx` with resource id in the mapping function and removed commented-out code to enhance overall code clarity.
