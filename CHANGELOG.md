## [Release 0.3.2] - 2025-04-29

### Added

- **Release Workflow Documentation:** Added a new section in the README describing the release workflow steps for clarity and consistency.

### Improved / Refactored

- **Footer Privacy Link:** Updated the privacy policy link in the footer to point to the beta domain.
- **Imprint Page Localization:** Improved German translations and wording for the imprint (Impressum) page.
- **Aggregated Inventory CSV Export:**
  - Enhanced section headers and field labels for clarity in all supported languages (DE, EN, ES)
  - Improved translation strings and export data structure for better usability
  - Added new fields: total volume/mass per material, and a more descriptive aggregated inventory label
  - Adjusted EOL class filtering and labels for accuracy
- **Circularity Assessment Terminology:** Updated translation strings to use "Circularity Assessment" instead of "Circularity Inventory" for improved clarity in EN and ES locales.

### Fixed

- **Translation Consistency:** Fixed inconsistencies in translation keys and improved field naming for CSV exports across DE, EN, and ES message files.

## [Release 0.3.1] - 2025-04-10

### Improved / Refactored

- **CSV Export Enhancement:** Improved aggregated inventory CSV export functionality
  - Added clearer section headers and descriptive field labels
  - Enhanced translated text for better clarity in all languages
  - Improved EOL class filtering to exclude NA class
  - Added additional data fields to provide more comprehensive export results

## [Release 0.3.0] - 2025-04-09

### Improved / Refactored

- **Revert multiple changes related to OBD->tBaustoff auto-matching:** Since this feature created issues for some projects on production, revert all changes made in previous releases.

### Fixed

- **Circularity Data Handling:** Fixed issues with circularity data processing and validation
- **Test Coverage:** Fixed and improved test suite for database queries and domain logic

## [Release 0.2.9] - 2025-04-09

### Improved / Refactored

- **Enhanced Debugging:** Added detailed query logging and improved error handling for database queries.
  - Added structured logging of query configurations for better traceability
  - Enhanced error reporting with detailed data dumps when process lifecycle assignment errors occur

## [Release 0.2.8] - 2025-04-08

### Fixed

- **Process Lifecycle Validation:** Updated validation logic for process lifecycle assignments to allow components with zero assignments, fixing data processing errors.

## [Release 0.2.7] - 2025-04-08

### Added

- **OBD Support:** Updated OBD version references in the notebook to support additional versions (2024-II and 2016). Ran notebook and updated mapping csv file used for seeding.

## [Release 0.2.6] - 2025-04-08

### Added

- **Footer & Imprint:** Added site footer with policy links and imprint page.
- **Documentation:** Added PDF documentation for circularity index v0.3.

### Fixed

- **TBaustoff Mapping:** Further improvements to TBaustoff mapping data accuracy.
- **Layout Components:** Various fixes to layout elements and component displays.

### Improved / Refactored

- **Legacy Database Queries:** Enhanced database query structure and test coverage.
- **Localization:** Added new translation entries for German, English, and Spanish.
- **Circularity Data Processing:** Improved error handling and data preloading.

## [Release 0.2.5] - 2025-04-08

### Added

- **OBD Version Support:** Added notebook for managing new OBD versions.
- **Database Testing:** Improved test coverage for database queries and interactions.

### Fixed

- **TBaustoff Mapping:** Resolved issues with TBaustoff mapping data and improved accuracy.
- **Process DB Filtering:** Enhanced filtering logic for process database entries.
- **Circularity Data Loading:** Improved preloading of circularity data with better error handling.

### Improved / Refactored

- **Database Queries:** Refactored legacy database queries following clean architecture principles.
- **E2E Testing:** Enhanced end-to-end tests for circularity tools.
- **Domain Logic:** Improved separation of concerns in circularity data handling.

## [Release 0.2.4] - 2025-04-02

### Added

- **Documentation Updates:** Enhanced project documentation with improved README, contribution guide, and license information.
- **CSV Export:** Added functionality to export aggregated inventory data to CSV format.
- **Clean Architecture:** Implemented clean architecture principles with clear separation between domain and presentation layers.

### Fixed

- **Wording and Presentation:** Improved various text and translation issues across DE/EN/ES locales.
- **Unit Corrections:** Fixed unit display issues in component displays.
- **Product Header Layout:** Updated product header layout and component organization.
- **CSV Export Transformation:** Enhanced CSV export transformation for material circularity data.

### Improved / Refactored

- **Code Organization:** Reorganized codebase according to clean architecture principles:
  - Separated domain logic (business rules and calculations)
  - Moved formatting functions to presentation layer
  - Improved database access patterns
  - Enhanced separation of concerns between database modules
- **Middleware/Query Logging:** Improved logging functionality in middleware and database queries.
- **Documentation:** Updated and cleaned up project documentation:
  - Removed boilerplate content
  - Updated project naming
  - Synchronized scripts section with package.json
  - Enhanced contribution guidelines

## [Release 0.2.3] - 2025-03-25

### Added

- **Circularity Component Improvements:** Enhanced circularity component functionality with updated unit of mass display and improved handling of missing volume data.

### Fixed

- **Security:** Updated Next.js to address security vulnerability CVE-2025-29927.
- **Circularity Indication:** Fixed volume display to show N/A and empty indicator values when at least one included product has missing volume.
- **Classification Logic:** Improved rebuild class calculation to be closest to point aggregate.

### Improved / Refactored

- **Tests:** Updated tests for circularity calculations including total mass, total volume, and weighted circularity and dismantling potential.

## [Release 0.2.2] - 2025-03-17

### Added

- **Circularity Index Indicators:** Added display of circularity index indicators on component pages, providing more detailed circularity metrics at the component level.
- **EOL and Dismantling Potential Metrics:** Implemented end-of-life (EOL) and dismantling potential metrics for the overview page, including a metric selector for different visualization options.
- **Materials CSV Export:** Added functionality to export materials data to CSV format with improved translations and correct unit display (thickness in mm).
- **License Information:** Added license file headers to source code files and updated the LICENSE file.

### Fixed

- **Component Filtering for Charts:** Fixed chart data by excluding components without any included materials, ensuring more accurate visualization.
- **Volume-based Aggregation:** Parameterized circularity index calculation to use volume for project overview instead of mass, fixing issues with project-wide calculations that didn't consider quantity.
- **Internationalization:** Improved translations across the application, including the ProductHeader component.

### Improved / Refactored

- **UI Enhancements:** Added styling improvements for circularity descriptions on component level and implemented description items for products in non-extended state.
- **Display Improvements:** Enhanced display of product material compatibility with proper handling of null values and added display of total component mass and volume values.

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
