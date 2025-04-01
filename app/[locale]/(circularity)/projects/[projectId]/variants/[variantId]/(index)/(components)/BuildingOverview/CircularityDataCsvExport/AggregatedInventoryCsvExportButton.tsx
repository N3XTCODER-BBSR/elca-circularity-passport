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
"use client"

import { useTranslations } from "next-intl"
import React from "react"
import { generateCsvFilename } from "app/(utils)/csvExportUtils"
import { downloadCsvFile } from "app/(utils)/downloadCsvFile"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { mapCircularityDataToAggregatedInventoryCsvTransformer } from "./mapCircularityDataToAggregatedInventoryCsvTransformer"

type CircularityDataCsvExportProps = {
  projectName: string
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
}

const AggregatedInventoryCsvExportButton = ({ projectName, circularityData }: CircularityDataCsvExportProps) => {
  const tTable = useTranslations("CircularityTool.sections.overview.aggregatedInventoryExport")

  // Map of field names to their translation keys
  const fieldTranslations: Record<string, string> = {
    total: tTable("total"),
    volumeSection: tTable("volumeSection"),
    massSection: tTable("massSection"),
    percentagePerClass: tTable("percentagePerClass"),
  }

  const generateAndDownloadCsv = () => {
    const csvContent = mapCircularityDataToAggregatedInventoryCsvTransformer(circularityData, fieldTranslations)
    const filename = generateCsvFilename(projectName, "AggregatedInventory")
    downloadCsvFile(filename, csvContent)
  }

  return (
    <button
      type="button"
      className="h-8 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      onClick={generateAndDownloadCsv}
    >
      {tTable("exportAggregatedInventoryToCsv")}
    </button>
  )
}

export default AggregatedInventoryCsvExportButton
