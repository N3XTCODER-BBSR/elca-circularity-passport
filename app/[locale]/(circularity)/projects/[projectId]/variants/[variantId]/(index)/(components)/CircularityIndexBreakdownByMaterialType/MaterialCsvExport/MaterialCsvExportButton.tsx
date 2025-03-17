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
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { generateCsvFilename, mapCircularityDataToCsv } from "./circularityDataToCsvTransformer"

export type ProcessCategory = {
  node_id: number
  name: string
  ref_num: string | null
}

export type MaterialNode = {
  component_uuid: string
  component_name: string
  product_id: number
  name: string
  process_category_node_id: number
  weight: number
  circularityIndex: number
}

type MaterialCsvExportProps = {
  catalogPath: string
  projectName: string
  processCategories: ProcessCategory[]
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
}

export default function MaterialCsvExportButton(props: MaterialCsvExportProps) {
  const t = useTranslations("CircularityTool.sections.overview.materialExport")
  const tFields = useTranslations("CircularityTool.sections.overview.materialExport.fields")
  const tCircularity = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const tComponents = useTranslations("Circularity.Components")
  const tRebuild = useTranslations("Circularity.Components.Layers.CircularityInfo.RebuildSection")
  const tEolBuilt = useTranslations("Circularity.Components.Layers.CircularityInfo.EolBuiltSection")
  const tEolUnbuiltClass = useTranslations(
    "Circularity.Components.Layers.CircularityInfo.EolDataSection.EolUnbuilt.Class"
  )
  const tEolUnbuiltPoints = useTranslations(
    "Circularity.Components.Layers.CircularityInfo.EolDataSection.EolUnbuilt.Points"
  )

  // Map of field names to their translation keys
  const fieldTranslations: Record<string, string> = {
    processName: tFields("processName"),
    buildingComponent: tComponents("name"),
    amount: tFields("amount"),
    unit: tFields("unit"),
    tBaustoffMaterial: tCircularity("tBaustoffMaterial"),
    thickness: tFields("thickness"),
    share: tFields("share"),
    volumePerUnit: tFields("volumePerUnit"),
    massPerUnit: tFields("massPerUnit"),
    circularityIndex: tCircularity("circularityIndex"),
    eolClassBuilt: tEolBuilt("class"),
    eolPointsBuilt: tEolBuilt("points"),
    eolClassUnbuilt: tEolUnbuiltClass("class"),
    eolPointsUnbuilt: tEolUnbuiltPoints("points"),
    rebuildClass: tRebuild("rebuildClass"),
    rebuildPoints: tRebuild("rebuildPoints"),
    elementUuid: tFields("componentUuid"),
    componentId: tFields("componentId"),
  }

  const downloadCSV = () => {
    const csv = mapCircularityDataToCsv(props.circularityData, fieldTranslations)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)

    const filename = generateCsvFilename(props.projectName)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      type="button"
      className="h-8 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      onClick={downloadCSV}
    >
      {t("exportMaterialsToCsv")}
    </button>
  )
}
