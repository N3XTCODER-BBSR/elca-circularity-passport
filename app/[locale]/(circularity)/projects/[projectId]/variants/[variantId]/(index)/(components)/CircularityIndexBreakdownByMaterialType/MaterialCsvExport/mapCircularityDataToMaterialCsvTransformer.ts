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

import { convertToCSV } from "app/(utils)/csvExportUtils"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

/**
 * Maps circularity data to a CSV format for export
 *
 * @param {ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]} circularityData - Array of building components with circularity data
 * @param {Record<string, string>} fieldTranslations - Object mapping field names to their translated headers
 * @returns {string} Formatted CSV string containing the mapped circularity data
 */
export const mapCircularityDataToMaterialCsvTransformer = (
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
      thickness: layer.layer_size ? layer.layer_size * 1000 : "", // * 1000 for thickness in mm
      share: layer.layer_area_ratio ? layer.layer_area_ratio * 100 : "", // * 100 for percentage
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
