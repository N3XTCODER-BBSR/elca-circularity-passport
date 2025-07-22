import { generateCsvFilename, convertToCSV } from "app/(utils)/csvExportUtils"
import iconv from "iconv-lite"

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

describe("convertToCSV", () => {
  const testData = [
    { name: "Test 1", value: "100,000", description: "First item" },
    { name: "Test 2", value: "200;000", description: "Second; item" },
  ]

  const translations = {
    name: "Name",
    value: "Value",
    description: "Description",
  }

  const decodeCsvBuffer = (buffer: Buffer): string => {
    return iconv.decode(buffer, "iso-8859-15")
  }

  // Helper to parse CSV fields properly, handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const fields: string[] = []
    let currentField = ""
    let inQuotes = false
    const quoteStart = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Double quote inside quoted field
          currentField += '""'
          i++ // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes
          currentField += '"'
        }
      } else if (char === ";" && !inQuotes) {
        // Field separator outside quotes
        fields.push(currentField)
        currentField = ""
      } else {
        currentField += char
      }
    }

    // Add the last field
    fields.push(currentField)
    return fields
  }

  test("uses semicolon separators", () => {
    const buffer = convertToCSV(testData, translations)
    const csv = decodeCsvBuffer(buffer)
    const firstLine = csv.split("\n")[0]
    expect(firstLine).toBe('"Name";"Value";"Description"')
  })

  test("wraps all fields in double quotes", () => {
    const buffer = convertToCSV(testData, translations)
    const csv = decodeCsvBuffer(buffer)
    const lines = csv.split("\n")

    // Check if all fields in all lines are properly quoted
    lines.forEach((line) => {
      const fields = parseCSVLine(line)
      fields.forEach((field) => {
        // Check that the field starts and ends with quotes
        expect(field).toMatch(/^".*"$/)
      })
    })
  })

  test("uses ISO-8859-15 encoding for special characters", () => {
    const specialData = [{ name: "Test ä", value: "100", description: "Contains € symbol" }]

    const buffer = convertToCSV(specialData, translations)
    const csv = decodeCsvBuffer(buffer)

    // The special characters should be preserved
    expect(csv).toContain("ä")
    expect(csv).toContain("€")
  })

  test("properly escapes double quotes in field values", () => {
    const dataWithQuotes = [{ name: 'Test "quoted" text', value: "100", description: 'Contains "quotes"' }]

    const buffer = convertToCSV(dataWithQuotes, translations)
    const csv = decodeCsvBuffer(buffer)
    const lines = csv.split("\n")
    const dataLine = lines[1]
    if (!dataLine) {
      throw new Error("Expected data line missing from CSV output")
    }
    const dataFields = parseCSVLine(dataLine)

    expect(dataFields[0]).toBe('"Test ""quoted"" text"')
    expect(dataFields[1]).toBe('"100"')
    expect(dataFields[2]).toBe('"Contains ""quotes"""')
  })

  test("returns empty buffer for empty data", () => {
    const buffer = convertToCSV([], translations)
    expect(buffer.length).toBe(0)
  })
})
