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

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

/**
 * Converts an array of objects to a CSV string format
 *
 * @param {any[]} data - The array of objects to convert to CSV
 * @param {Record<string, string>} fieldTranslations - Object mapping field names to their translated headers
 * @returns {string} Formatted CSV string with headers and data rows
 */
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
const convertToCSV = <T extends CsvConvertible>(data: T[], fieldTranslations: Record<string, string>) => {
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
 * Maps circularity data to a CSV format for export
 *
 * @param {ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]} circularityData - Array of building components with circularity data
 * @param {Record<string, string>} fieldTranslations - Object mapping field names to their translated headers
 * @returns {string} Formatted CSV string containing the mapped circularity data
 */
export const mapCircularityDataToCsv = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  fieldTranslations: Record<string, string>
) => {
  const mappedProducts = circularityData.flatMap((buildingComponent) =>
    buildingComponent.layers.map((layer) => ({
      processName: layer.process_name,
      buildingComponent: buildingComponent.element_name,
      amount: layer.quantity ?? "",
      unit: layer.unit ?? "",
      tBaustoffMaterial: layer.tBaustoffProductData?.name ?? "",
      thickness: layer.layer_size ?? "",
      share: layer.layer_area_ratio ?? "",
      volumePerUnit: layer.volume ?? "",
      massPerUnit: layer.mass ?? "",
      circularityIndex: layer.circularityIndex ?? "",
      eolClassBuilt: layer.eolBuilt?.className ?? "",
      eolPointsBuilt: layer.eolBuilt?.points ?? "",
      eolClassUnbuilt: layer.eolUnbuilt?.className ?? "",
      eolPointsUnbuilt: layer.eolUnbuilt?.points ?? "",
      rebuildClass: layer.dismantlingPotentialClassId ?? "",
      rebuildPoints: layer.dismantlingPoints ?? "",
      componentId: layer.component_id,
      elementUuid: layer.element_uuid,
    }))
  )

  return convertToCSV(mappedProducts, fieldTranslations)
}

/**
 * Generates a standardized filename for the circularity inventory CSV export
 *
 * @param {string} projectName - The name of the project
 * @returns {string} Formatted filename with date and sanitized project name
 */
export const generateCsvFilename = (projectName: string) => {
  // Generate a filename with the pattern YYYYMMDD-Zirkulaeritaetsinventar-[PROJECT_NAME]
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const formattedDate = `${year}${month}${day}`

  // Sanitize project name to remove problematic characters for filenames
  const sanitizedProjectName = projectName.replace(/[/\\?%*:|"<>]/g, "-")

  return `${formattedDate}-Zirkulaeritaetsinventar-${sanitizedProjectName}.csv`
}
