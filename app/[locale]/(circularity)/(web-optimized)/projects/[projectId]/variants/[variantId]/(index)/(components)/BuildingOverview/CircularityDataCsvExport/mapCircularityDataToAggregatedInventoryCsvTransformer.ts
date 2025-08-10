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
import { formatCsvRows } from "app/(utils)/csvExportUtils"
import { DimensionalFieldName } from "lib/domain-logic/circularity/misc/domain-types"
import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { EolClasses } from "lib/domain-logic/circularity/utils/circularityMappings"

interface TBaustoffEolData {
  tBaustoffName: string
  eolData: Record<EolClasses, number>
  total: number
}

/**
 * Processes circularity data to aggregate by tBaustoff and EoL class
 */
export function processCircularityDataForCsv(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName
): {
  tBaustoffEolData: TBaustoffEolData[]
  eolClasses: EolClasses[]
  eolTotals: Record<EolClasses, number>
  grandTotal: number
} {
  const tBaustoffMap = new Map<string, TBaustoffEolData>()

  // Include all possible EoL classes, not just the ones present in the data
  // But leave out the 'N/A' special class
  const allEolClasses = Object.values(EolClasses).filter((eolClass) => eolClass !== EolClasses.NA)

  // Process each element and its layers
  circularityData.forEach((element) => {
    element.layers.forEach((layer) => {
      // Skip layers without tBaustoff data or EoL class
      // TODO (L): during refactoring, we probably wanna use a type here that guarantees the presence of these properties
      if (!layer.tBaustoffProductData?.name || !layer.eolUnbuilt?.className) return

      const tBaustoffName = layer.tBaustoffProductData.name
      const eolClass = layer.eolUnbuilt.className as EolClasses
      const amount = layer[dimensionalFieldName] || 0

      // Get or create tBaustoff entry
      let tBaustoffEntry = tBaustoffMap.get(tBaustoffName)
      if (!tBaustoffEntry) {
        tBaustoffEntry = {
          tBaustoffName,
          eolData: allEolClasses.reduce(
            (acc, cls) => {
              acc[cls] = 0
              return acc
            },
            {} as Record<EolClasses, number>
          ),
          total: 0,
        }
        tBaustoffMap.set(tBaustoffName, tBaustoffEntry)
      }

      // Add amount to the corresponding EoL class and total
      tBaustoffEntry.eolData[eolClass] += amount
      tBaustoffEntry.total += amount
    })
  })

  // Convert map to array and sort by tBaustoff name
  const tBaustoffEolData = Array.from(tBaustoffMap.values()).sort((a, b) =>
    a.tBaustoffName.localeCompare(b.tBaustoffName)
  )

  // Sort EoL classes by their enum order
  const eolClasses = [...allEolClasses].sort((a, b) => {
    const order = Object.values(EolClasses)
    return order.indexOf(a) - order.indexOf(b)
  })

  // Calculate total for each EoL class
  const eolTotals = eolClasses.reduce(
    (acc, eolClass) => {
      acc[eolClass] = tBaustoffEolData.reduce((sum, item) => sum + item.eolData[eolClass], 0)
      return acc
    },
    {} as Record<EolClasses, number>
  )

  // Calculate grand total
  const grandTotal = tBaustoffEolData.reduce((sum, item) => sum + item.total, 0)

  return { tBaustoffEolData, eolClasses, eolTotals, grandTotal }
}

/**
 * Creates a section of CSV data for a specific dimensional field
 */
function createCsvSection(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName,
  translations: Record<string, string>,
  sectionTitle: string,
  totalPerEolClassTitle: string,
  totalDimensionPerMaterialLabel: string
): string[][] {
  const { tBaustoffEolData, eolClasses, eolTotals, grandTotal } = processCircularityDataForCsv(
    circularityData,
    dimensionalFieldName
  )

  // Create EoL class label row with section title in the first cell
  const eolClassLabelRow = [
    sectionTitle,
    translations.eolClassLabel || "EoL class:",
    ...eolClasses.slice(1).map(() => ""),
    "",
  ]

  // Create CSV header with "Material:" in the first cell
  const header = [
    translations.materialLabel || "Material:",
    ...eolClasses.map((eolClass) => eolClass),
    totalDimensionPerMaterialLabel,
  ]

  const transformCell = (cell: number) => (cell === 0 ? "" : cell.toFixed(2))

  // Create CSV rows
  const rows = tBaustoffEolData.map((item) => {
    return [
      item.tBaustoffName,
      ...eolClasses.map((eolClass) => transformCell(item.eolData[eolClass])),
      transformCell(item.total),
    ]
  })

  // Add totals row
  const totalsRow = [
    totalPerEolClassTitle,
    ...eolClasses.map((eolClass) => transformCell(eolTotals[eolClass])),
    transformCell(grandTotal),
  ]

  // Add % row
  const percentageRow = [
    translations.percentagePerClass || "% per class",
    ...eolClasses.map((eolClass) => transformCell((eolTotals[eolClass] / grandTotal) * 100)),
    transformCell((grandTotal / grandTotal) * 100),
  ]

  // Combine section rows
  return [eolClassLabelRow, header, ...rows, totalsRow, percentageRow]
}

/**
 * Transforms circularity data into CSV format with both mass and volume data
 */
export function mapCircularityDataToAggregatedInventoryCsvTransformer(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  translations: Record<string, string>
): Buffer {
  // Create main header row
  const mainHeaderRow = [translations.aggregatedInventory || "Aggregated Inventory - Circularity Potential"]

  // Add empty row after main header
  const emptyRowAfterHeader = [""]

  // Add empty row as separator
  const separator = [[""]]

  // Create volume section
  const volumeSection = createCsvSection(
    circularityData,
    "volume",
    translations,
    translations.volumeSection || "Volume Data (m³)",
    translations.totalVolumePerEolClass || "Total volume (m³) per EoL class",
    translations.totalVolumePerMaterial || "Total volume (m³) per material"
  )

  // Create mass section
  const massSection = createCsvSection(
    circularityData,
    "mass",
    translations,
    translations.massSection || "Mass Data (kg)",
    translations.totalMassPerEolClass || "Total mass (kg) per EoL class",
    translations.totalMassPerMaterial || "Total mass (kg) per material"
  )

  // Combine all sections
  const csvData: (string | number)[][] = [
    mainHeaderRow,
    emptyRowAfterHeader,
    ...volumeSection,
    ...separator,
    ...massSection,
  ]

  // Format CSV with semicolon separator and quoted fields
  const csvContent = formatCsvRows(csvData)

  // Convert to Buffer with ISO-8859-15 encoding for Excel compatibility
  return iconv.encode(csvContent, "iso-8859-15")
}
