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
import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"

export const calculateTotalCircularityIndexForProject = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dimensionalFieldName: DimensionalFieldName
) => {
  // TODO (XL): ensure to exlude
  // 1. components which don't fall into our selection of DIN categories
  // 2. explicitly excluded components

  // Calculate the total circularity index for the project by iterating over
  // all entries in circulartiyData
  //   and within each entry, summing the
  //     circularity index of each component
  //     calculate the volume or mass (depending on dimensionalFieldName) of each component
  // At the end, divide the total circularity index by the total volume/mass of the project
  // to get the total circularity index of the project

  let circularityIndexTimesDimensionalValueSumOverAllComponentLayers = 0
  let totalDimensionalValue = 0

  for (const component of circularityData) {
    for (const layer of component.layers) {
      // Get the dimensional value of the layer
      const dimensionalValue = (layer[dimensionalFieldName] ?? 0) * component.quantity

      // Accumulate total dimensional value
      totalDimensionalValue += dimensionalValue

      // Only proceed if circularityIndex is not null
      if (layer.circularityIndex == null) {
        continue
      }

      // Accumulate the product of circularityIndex and dimensionalValue
      circularityIndexTimesDimensionalValueSumOverAllComponentLayers += layer.circularityIndex * dimensionalValue
    }
  }
  // Calculate the total circularity index for the project

  const totalCircularityIndexForProject =
    circularityIndexTimesDimensionalValueSumOverAllComponentLayers / totalDimensionalValue
  return totalCircularityIndexForProject
}
