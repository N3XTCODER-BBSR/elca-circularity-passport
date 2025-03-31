import { generateCsvFilename } from "app/(utils)/csvExportUtils"
describe("generateCsvFilename", () => {
  // Mock the Date object for consistent testing
  const originalDate = global.Date

  beforeEach(() => {
    // Mock date to return a fixed date (2025-03-04)
    const mockDate = new Date(2025, 2, 4) // Month is 0-indexed
    global.Date = class extends Date {
      constructor() {
        super()
        return mockDate
      }
    } as DateConstructor
  })

  afterEach(() => {
    // Restore the original Date
    global.Date = originalDate
  })

  test("generates filename with the correct format", () => {
    const filename = generateCsvFilename("Test Project", "Zirkulaeritaetsinventar")

    // Should follow the pattern YYYYMMDD-[PROJECT_NAME]-[EXPORT_TYPE_NAME].csv
    expect(filename).toBe("20250304-Test Project-Zirkulaeritaetsinventar.csv")
  })

  test("sanitizes project name by replacing invalid filename characters", () => {
    const filename = generateCsvFilename("Test/Project:With*Invalid?Chars", "Zirkulaeritaetsinventar")

    // Should replace invalid characters with hyphens
    expect(filename).toBe("20250304-Test-Project-With-Invalid-Chars-Zirkulaeritaetsinventar.csv")
  })

  test("handles empty project name", () => {
    const filename = generateCsvFilename("", "Zirkulaeritaetsinventar")

    // Should work with an empty project name
    expect(filename).toBe("20250304--Zirkulaeritaetsinventar.csv")
  })
})
