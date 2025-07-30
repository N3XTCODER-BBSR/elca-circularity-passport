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
import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { mapCircularityDataToMaterialCsvTransformer } from "./mapCircularityDataToMaterialCsvTransformer"

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
}

type MaterialCsvExportProps = {
  catalogPath: string
  projectName: string
  projectId: number
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
    // Component Data
    layerNumber: tFields("layerNumber"),
    componentName: tComponents("name"),
    amount: tFields("amount"),
    unit: tFields("unit"),
    buildingMaterialComponent: tFields("buildingMaterialComponent"),
    componentId: tFields("componentId"),
    componentUuid: tFields("componentUuid"),

    // Base Data
    tBuildingMaterial: tCircularity("tBaustoffMaterial"),
    thickness: tFields("thickness"),
    volumeSharePercent: tFields("volumeShare"),
    volumePerUnit: tFields("volumePerUnit"),
    massPerUnit: tFields("massPerUnit"),

    // Circularity Potential - Unbuilt
    eolScenarioReal: tFields("eolScenarioReal"),
    eolScenarioPotential: tFields("eolScenarioPotential"),
    technologyFactor: tFields("tf"),
    eolScenarioSpecific: tFields("eolScenarioSpecific"),
    explanationUnbuilt: tFields("explanationUnbuilt"),
    eolClassUnbuilt: tEolUnbuiltClass("class"),
    eolPointsUnbuilt: tEolUnbuiltPoints("points"),
    manualValuesUnbuilt: tFields("manualValuesUnbuilt"),

    // Dismantling Potential
    dismantlingPotentialClass: tRebuild("rebuildClass"),
    dismantlingPotentialPoints: tRebuild("rebuildPoints"),
    manualValuesDismantling: tFields("manualValuesDismantling"),

    // Material Compatibility
    materialCompatibilityClass: tFields("materialCompatibilityClass"),
    materialExplanation: tFields("materialExplanation"),
    newClassification: tFields("newClassification"),
    manualValuesMaterial: tFields("manualValuesMaterial"),

    // Circularity Potential - Built
    eolClassBuilt: tEolBuilt("class"),
    eolPointsBuilt: tEolBuilt("points"),
  }

  const generateAndDownloadCsv = () => {
    const csvBuffer = mapCircularityDataToMaterialCsvTransformer(
      props.circularityData,
      fieldTranslations,
      props.projectId,
      props.projectName
    )
    const filename = generateCsvFilename(props.projectName, "Zirkulaeritaetsinventar")
    downloadCsvFile(filename, csvBuffer)
  }

  return (
    <button
      type="button"
      className="h-8 rounded-md bg-bbsr-blue-700 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-bbsr-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bbsr-blue-500"
      onClick={generateAndDownloadCsv}
    >
      {t("exportMaterialsToCsv")}
    </button>
  )
}
