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
 * Calculates the volume-weighted average for a collection of items.
 * Filters out items with null volume before calculation.
 *
 * @param items - Array of items with volume and value
 * @param totalVolume - Total volume across all items
 * @returns The volume-weighted average
 */
export function calculateVolumeWeightedAverage(
  items: Array<{ volume: number | null; value: number }>,
  totalVolume: number
): number {
  // Filter out items with null volume and cast to non-null
  const validItems = items.filter((item): item is { volume: number; value: number } => item.volume !== null)

  return validItems.reduce((sum, { volume, value }) => {
    return sum + value * (volume / totalVolume)
  }, 0)
}

/**
 * Validates that all items have valid volume data.
 *
 * @param items - Array of items with volume data
 * @returns True if all items have valid volume data, false otherwise
 */
export function validateVolumeData<T extends { volume: number | null }>(items: T[]): boolean {
  return items.length > 0 && !items.some(({ volume }) => volume === null)
}
