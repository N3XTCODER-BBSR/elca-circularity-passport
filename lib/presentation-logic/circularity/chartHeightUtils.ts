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

/**
 * Calculates the optimal chart height for Nivo bar charts based on the number of items
 * @param itemCount - Number of chart items/bars
 * @returns Height in pixels for the chart container
 */
export function calculateChartHeight(itemCount: number): number {
  const targetBarHeight = 32 // Target bar height in pixels
  const baseSpacing = 64 // Base spacing for axis labels and margins

  if (itemCount === 0) return 200 // Default height for empty charts
  if (itemCount === 1) return targetBarHeight + 58 // Special case for single item
  if (itemCount < 4) return itemCount * targetBarHeight + 58 // Small charts

  return itemCount * targetBarHeight + baseSpacing // Standard calculation
}

/**
 * Standard margin configuration for all circularity charts
 */
export const chartMargin = {
  top: 20,
  right: 50,
  bottom: 30,
  left: 180,
}
