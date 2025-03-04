import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

const convertToCSV = (data: any[], fieldTranslations: Record<string, string>) => {
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

export const mapCircularityDataToCsv = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  fieldTranslations: Record<string, string>
) => {
  const mappedProducts = circularityData.flatMap((buildingComponent) =>
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

  return convertToCSV(mappedProducts, fieldTranslations)
}

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
