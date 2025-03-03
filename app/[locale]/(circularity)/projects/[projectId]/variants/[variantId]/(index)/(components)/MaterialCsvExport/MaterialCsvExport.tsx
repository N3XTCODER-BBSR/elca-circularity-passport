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

  // Map layers to MaterialNodes

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

    // Get headers from the first object's keys
    const headers = Object.keys(data[0])

    // Create CSV header row
    const headerRow = headers.join(",")

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

  const downloadCSV = () => {
    const csv = convertToCSV(mappedProducts)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "materials_export.csv")
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
