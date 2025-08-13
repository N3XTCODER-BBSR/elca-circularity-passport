/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import iconv from "iconv-lite"

/**
 * Encoding used for CSV files to ensure proper handling of special characters in Excel
 */
const CSV_ENCODING = "iso-8859-15"

/**
 * Type for objects that can be converted to CSV
 * All values must be convertible to string
 */
type CsvConvertible = Record<string, string | number | boolean | null | undefined>

/**
 * Escapes and quotes CSV values, always wrapping them in double quotes
 * and escaping any existing quotes by doubling them
 *
 * @param {any} value - The value to escape
 * @returns {string} The escaped and quoted value
 */
export const escapeValue = (value: any): string => {
  if (value === undefined || value === null) {
    return '""'
  }
  const stringValue = String(value)
  // Double any quotes in the value and always wrap in quotes
  return `"${stringValue.replace(/"/g, '""')}"`
}

/**
 * Formats an array of rows into a CSV string with proper escaping
 * Uses semicolon as separator and quotes all fields
 *
 * @param {(string | number | null | undefined)[][]} rows - Array of rows, each containing an array of values
 * @returns {string} The formatted CSV string
 */
export const formatCsvRows = (rows: (string | number | null | undefined)[][]): string => {
  return rows.map((row) => row.map(escapeValue).join(";")).join("\n")
}

/**
 * Converts an array of objects to a CSV string format using ISO-8859-15 encoding,
 * semicolon separators, and double quotes for all fields.
 *
 * @param {T[]} data - The array of objects to convert to CSV
 * @param {Record<string, string>} fieldTranslations - Object mapping field names to their translated headers
 * @returns {Buffer} CSV content as a buffer with ISO-8859-15 encoding
 */
export const convertToCSV = <T extends CsvConvertible>(
  data: T[],
  fieldTranslations: Record<string, string>
): Buffer => {
  if (data.length === 0) return Buffer.from([])

  // Get headers from the first object's keys and translate them
  // We can safely access data[0] since we've checked data.length !== 0
  const firstItem = data[0] as T // Type assertion since we know it exists
  const headers = Object.keys(firstItem)
  const translatedHeaders = headers.map((header) => fieldTranslations[header] || header)

  // Create CSV rows
  const csvRows = [
    translatedHeaders,
    ...data.map((item) =>
      headers.map((header) => {
        const value = item[header]
        return typeof value === "boolean" ? String(value) : value
      })
    ),
  ]

  // Format the rows and convert to ISO-8859-15
  const csvContent = formatCsvRows(csvRows)
  return iconv.encode(csvContent, CSV_ENCODING)
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
