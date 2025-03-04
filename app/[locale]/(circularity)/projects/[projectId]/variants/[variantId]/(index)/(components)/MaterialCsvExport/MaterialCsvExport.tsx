"use client"

import { useTranslations } from "next-intl"
import React from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

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

export default function MaterialCsvExport(props: MaterialCsvExportProps) {
  const t = useTranslations("CircularityTool.sections.overview.materialExport")
  const tFields = useTranslations("CircularityTool.sections.overview.materialExport.fields")
  const tCircularity = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const tComponents = useTranslations("Circularity.Components")
  const tLayers = useTranslations("Circularity.Components.Layers")
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
    volumePerUnit: tLayers("volume"),
    massPerUnit: tLayers("mass"),
    circularityIndex: tCircularity("circularityIndex"),
    eolClassBuilt: tEolBuilt("class"),
    eolPointsBuilt: tEolBuilt("points"),
    eolClassUnbuilt: tEolUnbuiltClass("class"),
    eolPointsUnbuilt: tEolUnbuiltPoints("points"),
    rebuildClass: tRebuild("rebuildClass"),
    rebuildPoints: tRebuild("rebuildPoints"),
    componentId: tFields("componentId"),
    elementUuid: tComponents("uuid"),
  }

  // Map products to get a list of elements with the required properties
  const mappedProducts = props.circularityData.flatMap((buildingComponent) =>
    buildingComponent.layers.map((layer) => ({
      processName: layer.process_name,
      buildingComponent: buildingComponent.element_name,
      amount: layer.quantity ?? 0,
      unit: layer.unit ?? "",
      tBaustoffMaterial: layer.tBaustoffProductData?.name ?? "",
      thickness: layer.layer_size ?? 0,
      share: layer.layer_area_ratio ?? 0,
      volumePerUnit: layer.volume ?? 0,
      massPerUnit: layer.mass ?? 0,
      circularityIndex: layer.circularityIndex ?? 0,
      eolClassBuilt: layer.eolBuilt?.className ?? "",
      eolPointsBuilt: layer.eolBuilt?.points ?? 0,
      eolClassUnbuilt: layer.eolUnbuilt?.className ?? "",
      eolPointsUnbuilt: layer.eolUnbuilt?.points ?? 0,
      rebuildClass: layer.dismantlingPotentialClassId ? `Class ${layer.dismantlingPotentialClassId}` : "",
      rebuildPoints: layer.dismantlingPoints ?? 0,
      componentId: layer.component_id,
      elementUuid: layer.element_uuid,
    }))
  )

  // Helper function to convert the mapped products to CSV
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ""

    // Get headers from the first object's keys and translate them
    const headers = Object.keys(data[0])
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

  const generateCsvFilename = () => {
    // Generate a filename with the pattern YYYYMMDD-Zirkulaeritaetsinventar-[PROJECT_NAME]
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}${month}${day}`

    // Sanitize project name to remove problematic characters for filenames
    const sanitizedProjectName = props.projectName.replace(/[/\\?%*:|"<>]/g, "-")

    return `${formattedDate}-Zirkulaeritaetsinventar-${sanitizedProjectName}.csv`
  }

  const downloadCSV = () => {
    const csv = convertToCSV(mappedProducts)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)

    const filename = generateCsvFilename()
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={downloadCSV}
      className="py-2inline-flex inline-flex size-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {t("exportMaterialsToCsv")}
    </button>
  )
}
