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
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { calculateVolumeWeightedAverage, validateVolumeData } from "./volumeWeightedAverageUtils"

/**
 * Calculates the volume-weighted average circularity potential for all building layers.
 *
 * @param layers - Array of enriched ELCA element components
 * @returns The volume-weighted average circularity potential, or null if no valid data
 */
export const getTotalWeightedCircularityPotential = (layers: EnrichedElcaElementComponent[]): number | null => {
  // Process layers: calculate circularity data and filter out invalid ones
  const filteredData = layers
    .map((layer) => {
      const circularData = calculateCircularityDataForLayer(layer)
      const circularityPotential = circularData.eolBuilt?.points ?? null
      return { layer, circularityPotential }
    })
    .filter(({ layer, circularityPotential }) => !layer.isExcluded && circularityPotential !== null)
    .map(({ layer, circularityPotential }) => ({
      volume: layer.volume!,
      value: circularityPotential!,
    }))

  // Return null if no valid layers or if any layer is missing volume data
  if (!validateVolumeData(filteredData)) {
    return null
  }

  // Calculate total volume across all valid layers
  const totalVolume = filteredData.reduce((sum, { volume }) => sum + volume, 0)

  // Calculate volume-weighted average using utility function
  return calculateVolumeWeightedAverage(filteredData, totalVolume)
}
