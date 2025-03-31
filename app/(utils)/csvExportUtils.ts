/**
 * Type for objects that can be converted to CSV
 * All values must be convertible to string
 */
type CsvConvertible = Record<string, string | number | boolean | null | undefined>

/**
 * Converts an array of objects to a CSV string format
 *
 * @param {T[]} data - The array of objects to convert to CSV
 * @param {Record<string, string>} fieldTranslations - Object mapping field names to their translated headers
 * @returns {string} Formatted CSV string with headers and data rows
 */
export const convertToCSV = <T extends CsvConvertible>(data: T[], fieldTranslations: Record<string, string>) => {
  if (data.length === 0) return ""

  // Get headers from the first object's keys and translate them
  // We can safely access data[0] since we've checked data.length !== 0
  const firstItem = data[0] as T // Type assertion since we know it exists
  const headers = Object.keys(firstItem)
  const translatedHeaders = headers.map((header) => fieldTranslations[header] || header)

  // Create CSV header row
  const headerRow = translatedHeaders.join(",")

  // Create CSV data rows
  const dataRows = data.map((item) =>
    headers
      .map((header) => {
        // Handle values that might contain commas by wrapping in quotes
        const value = item[header]?.toString() || ""
        return value.includes(",") ? `"${value}"` : value
      })
      .join(",")
  )

  return [headerRow, ...dataRows].join("\n")
}

/**
 * Generates a standardized filename for the circularity inventory CSV export
 *
 * @param {string} projectName - The name of the project
 * @param {string} exportTypeName - The name of the export type, e.g.'Zirkulaeritaetsinventar' or 'Aggregiertes Inventar'
 * @returns {string} Formatted filename with date and sanitized project name
 */
export const generateCsvFilename = (projectName: string, exportTypeName: string) => {
  // Generate a filename with the pattern YYYYMMDD-Zirkulaeritaetsinventar-[PROJECT_NAME]
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const formattedDate = `${year}${month}${day}`

  // Sanitize project name to remove problematic characters for filenames
  const sanitizedProjectName = projectName.replace(/[/\\?%*:|"<>]/g, "-")

  return `${formattedDate}-${sanitizedProjectName}-${exportTypeName}.csv`
}
