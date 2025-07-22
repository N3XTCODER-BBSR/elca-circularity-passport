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

import { formatCsvRows } from "app/(utils)/csvExportUtils"
import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  calculateMaterialCompatibility,
  getDisturbingSubstancesString,
} from "lib/domain-logic/circularity/utils/getDisturbingSubstancesString"
import { EOLScenarioMap } from "lib/domain-logic/circularity/utils/circularityMappings"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"

// CSV Headers
const CSV_HEADERS = {
  PROJECT_ID: "eLCA Projekt-ID",
  COMPONENT_DATA: "Bauteilkomponenten-Daten",
  LAYER_DATA: "Schichten der Bauteilkomponente",
  BASE_DATA: "Basisdaten / Einheit (m², m, Stück) je Bauteilschicht",
  CIRCULARITY_UNBUILT: "Zirkularitätspotenzial - Unverbaut",
  DISMANTLING_POTENTIAL: "Rückbaupotential",
  MATERIAL_COMPATIBILITY: "Materialverträglichkeit",
  CIRCULARITY_BUILT: "Zirkularitätspotenzial - Verbaut (Final)",
} as const

// CSV Subheader Fields
const SUBHEADER_FIELDS = {
  // Component Data
  LAYER_NUMBER: "Schichtnummer",
  COMPONENT: "Bauteilkomponente",
  AMOUNT: "Menge",
  UNIT: "Einheit",
  DIN_276: "KG DIN 276",
  COMPONENT_UUID: "Komponenten-UUID",
  BUILDING_MATERIAL: "Baustoff (ÖBD)",
  T_BUILDING_MATERIAL: "tBaustoff",
  MANUAL_VALUES: "Manuell eingetragene Werte/Auswahl",

  // Base Data
  THICKNESS_MM: "Dicke [mm]",
  VOLUME_PERCENT: "Anteil in Vol-%",
  VOLUME_PER_UNIT: "Volumen [m³/Einheit]",
  MASS_PER_UNIT: "Masse [kg/Einheit]",

  // Circularity Fields
  EOL_SCENARIO_REAL: "EOL Szenario (Real)",
  EOL_SCENARIO_POTENTIAL: "EOL Szenario (Potenzial)",
  TECHNOLOGY_FACTOR: "TF",
  EOL_SCENARIO_SPECIFIC: "EOL-Szenario (Spezifisch)",
  EXPLANATION: "Erläuterung",
  EOL_CLASS: "EOL Klasse",
  EOL_POINTS: "EOL Punkte",

  // Dismantling Fields
  DISMANTLING_CLASS: "Rückbaupotenzial Klasse",
  DISMANTLING_POINTS: "Rückbaupotenzial Punkte",
  DISMANTLING_REMARK: "Hinweis",

  // Material Compatibility Fields
  MATERIAL_CLASS: "Materialverträglichkeit Klasse",
  MATERIAL_EXPLANATION: "Erläuterung",
  POINTS: "Punkte",
  NEW_CLASSIFICATION: "Neueinstufung",
} as const

// Constants for special values
const SPECIAL_VALUES = {
  MANUAL_ENTRY: "MANUELL",
  RECLASSIFICATION: "NEUEINST.",
} as const

/**
 * Maps circularity data to a CSV format for export
 *
 * @param {ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]} circularityData - Array of building components with circularity data
 * @param {Record<string, string>} fieldTranslations - Object mapping field names to their translated headers
 * @param {number} projectId - The eLCA project ID
 * @returns {Buffer} Formatted CSV buffer containing the mapped circularity data
 */
export const mapCircularityDataToMaterialCsvTransformer = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  fieldTranslations: Record<string, string>,
  projectId: number
) => {
  // Define column groups for subheader
  const subheaders = {
    componentData: [
      SUBHEADER_FIELDS.LAYER_NUMBER,
      SUBHEADER_FIELDS.COMPONENT,
      SUBHEADER_FIELDS.AMOUNT,
      SUBHEADER_FIELDS.UNIT,
      SUBHEADER_FIELDS.DIN_276,
      SUBHEADER_FIELDS.COMPONENT_UUID,
      SUBHEADER_FIELDS.BUILDING_MATERIAL,
      SUBHEADER_FIELDS.T_BUILDING_MATERIAL,
      SUBHEADER_FIELDS.MANUAL_VALUES,
    ],
    baseData: [
      SUBHEADER_FIELDS.THICKNESS_MM,
      SUBHEADER_FIELDS.VOLUME_PERCENT,
      SUBHEADER_FIELDS.VOLUME_PER_UNIT,
      SUBHEADER_FIELDS.MASS_PER_UNIT,
    ],
    circularityPotentialUnbuilt: [
      SUBHEADER_FIELDS.EOL_SCENARIO_REAL,
      SUBHEADER_FIELDS.EOL_SCENARIO_POTENTIAL,
      SUBHEADER_FIELDS.TECHNOLOGY_FACTOR,
      SUBHEADER_FIELDS.EOL_SCENARIO_SPECIFIC,
      SUBHEADER_FIELDS.EXPLANATION,
      SUBHEADER_FIELDS.EOL_CLASS,
      SUBHEADER_FIELDS.EOL_POINTS,
      SUBHEADER_FIELDS.MANUAL_VALUES,
    ],
    dismantlingPotential: [
      SUBHEADER_FIELDS.DISMANTLING_CLASS,
      SUBHEADER_FIELDS.DISMANTLING_POINTS,
      SUBHEADER_FIELDS.DISMANTLING_REMARK,
      SUBHEADER_FIELDS.MANUAL_VALUES,
    ],
    materialCompatibility: [
      SUBHEADER_FIELDS.MATERIAL_CLASS,
      SUBHEADER_FIELDS.MATERIAL_EXPLANATION,
      SUBHEADER_FIELDS.POINTS,
      SUBHEADER_FIELDS.NEW_CLASSIFICATION,
      SUBHEADER_FIELDS.MANUAL_VALUES,
    ],
    circularityPotentialBuilt: [SUBHEADER_FIELDS.EOL_CLASS, SUBHEADER_FIELDS.EOL_POINTS],
  }

  // Create project ID row
  const projectIdRow = [
    CSV_HEADERS.PROJECT_ID,
    projectId,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]

  // Create empty row for spacing
  const emptyRow = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]

  // Create main header with column groups
  const mainHeaderRow = [
    CSV_HEADERS.COMPONENT_DATA,
    "",
    "",
    "",
    "",
    "",
    CSV_HEADERS.LAYER_DATA,
    "",
    "",
    CSV_HEADERS.BASE_DATA,
    "",
    "",
    "", // 5 columns
    CSV_HEADERS.CIRCULARITY_UNBUILT,
    "",
    "",
    "",
    "",
    "",
    "",
    "", // 8 columns
    CSV_HEADERS.DISMANTLING_POTENTIAL,
    "",
    "",
    "", // 4 columns (including remark)
    CSV_HEADERS.MATERIAL_COMPATIBILITY,
    "",
    "",
    "",
    "", // 5 columns
    CSV_HEADERS.CIRCULARITY_BUILT,
    "", // 2 columns
  ]

  const mappedProducts = circularityData.flatMap((buildingComponent) =>
    buildingComponent.layers.map((layer) => {
      const materialCompatibilityClass = getDisturbingSubstancesString(layer)
      const materialCompatibility = calculateMaterialCompatibility(layer)
      const materialCompatibilityPoints = materialCompatibility ?? "-"

      return {
        // Component Data
        layerNumber: layer.layer_position,
        componentName: buildingComponent.element_name,
        amount: buildingComponent.quantity ?? "",
        unit: layer.unit ?? "",
        kgDin276: buildingComponent.din_code,
        componentUuid: layer.element_uuid,
        buildingMaterialComponent: layer.process_name,
        tBuildingMaterial: layer.tBaustoffProductData?.name ?? "",
        manualValuesTBuildingMaterial: layer.tBaustoffProductSelectedByUser ? SPECIAL_VALUES.MANUAL_ENTRY : "",

        // Base Data
        thickness: layer.layer_size ? layer.layer_size * 1000 : "", // mm
        volumeSharePercent: layer.layer_area_ratio ? layer.layer_area_ratio * 100 : "",
        volumePerUnit: layer.volume ?? "",
        massPerUnit: layer.mass ?? "",

        // Circularity Potential - Unbuilt
        eolScenarioReal: layer.eolScenarioReal ? EOLScenarioMap[layer.eolScenarioReal] ?? layer.eolScenarioReal : "",
        eolScenarioPotential: layer.eolScenarioPotential
          ? EOLScenarioMap[layer.eolScenarioPotential] ?? layer.eolScenarioPotential
          : "",
        technologyFactor: layer.technologyFactor ?? "",
        eolScenarioSpecific: layer.eolUnbuiltSpecificScenario
          ? EOLScenarioMap[layer.eolUnbuiltSpecificScenario] ?? layer.eolUnbuiltSpecificScenario
          : "",
        explanationUnbuilt: layer.eolUnbuiltSpecificScenarioProofText ?? "",
        eolClassUnbuilt: layer.eolUnbuilt?.className ?? "",
        eolPointsUnbuilt: layer.eolUnbuilt?.points ?? "",
        manualValuesUnbuilt: layer.manuallyEnteredValues?.eolUnbuilt ? SPECIAL_VALUES.MANUAL_ENTRY : "",

        // Dismantling Potential
        dismantlingPotentialClass: layer.dismantlingPotentialClassId ?? "",
        dismantlingPotentialPoints: layer.dismantlingPoints ?? "",
        dismantlingRemark: layer.dismantlingPotentialClassRemark ?? "", // Add dismantling remark
        manualValuesDismantling: layer.manuallyEnteredValues?.dismantling ? SPECIAL_VALUES.MANUAL_ENTRY : "",

        // Material Compatibility
        materialCompatibilityClass: materialCompatibilityClass,
        materialExplanation:
          layer.disturbingSubstanceSelections
            ?.map((s) => s.disturbingSubstanceName)
            .filter(Boolean)
            .join(", ") ?? "",
        points: materialCompatibilityPoints,
        newClassification: layer.disturbingEolScenarioForS4
          ? EOLScenarioMap[layer.disturbingEolScenarioForS4] ?? layer.disturbingEolScenarioForS4
          : "",
        manualValuesMaterial: layer.manuallyEnteredValues?.materialCompatibility ? SPECIAL_VALUES.MANUAL_ENTRY : "",

        // Circularity Potential - Built
        eolClassBuilt: layer.eolBuilt?.className ?? "",
        eolPointsBuilt: layer.eolBuilt?.points ?? "",
      }
    })
  )

  // Sort the mapped products by DIN code, component name, UUID, and layer position
  const sortedProducts = mappedProducts.sort((a, b) => {
    // First sort by KG DIN 276
    if (a.kgDin276 !== b.kgDin276) {
      return a.kgDin276 - b.kgDin276
    }
    // Then by component name
    if (a.componentName !== b.componentName) {
      return a.componentName.localeCompare(b.componentName)
    }
    // Then by component UUID
    if (a.componentUuid !== b.componentUuid) {
      return a.componentUuid.localeCompare(b.componentUuid)
    }
    // Finally by layer number
    return a.layerNumber - b.layerNumber
  })

  // Create CSV with project ID, empty row, main header and subheaders
  const csvRows = [
    projectIdRow, // Project ID row
    emptyRow, // Empty row for spacing
    mainHeaderRow, // Main header row with column groups
    Object.values(subheaders).flat(), // Subheader row
    ...sortedProducts.map((product) => Object.values(product)),
  ]

  const csvContent = formatCsvRows(csvRows)
  return Buffer.from(csvContent)
}
