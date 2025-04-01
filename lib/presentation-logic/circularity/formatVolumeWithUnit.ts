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
import { MissingVolumeError } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalVolume"

/**
 * Type definition for the formatter interface we need
 */
interface NumberFormatter {
  number: (value: number, options?: { maximumFractionDigits?: number }) => string
}

/**
 * Formats a volume value with the appropriate unit and handles error cases
 *
 * @param totalVolume The volume value to format
 * @param format The formatter to use for number formatting
 * @returns A formatted string with the volume and unit, or an appropriate placeholder
 */
export function formatVolumeWithUnit(
  totalVolume: number | null | undefined,
  format: NumberFormatter,
  options = { maximumFractionDigits: 2 }
): string {
  try {
    return totalVolume ? `${format.number(totalVolume, options)} m3` : "-"
  } catch (error) {
    if (error instanceof MissingVolumeError) {
      return "N/A"
    }
    // Re-throw unexpected errors
    throw error
  }
}
