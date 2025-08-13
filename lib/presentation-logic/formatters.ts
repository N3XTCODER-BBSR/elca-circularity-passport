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
 * Formats a number with German locale and specified decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (both minimum and maximum)
 */
export const formatNumber = (value: number, decimals: number = 1) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)

/**
 * Maps Arabic numerals to Roman numerals
 */
export const romanNumeralMap: Record<string, string> = {
  "1": "I",
  "2": "II",
  "3": "III",
  "4": "IV",
}

/**
 * Converts a number or string to Roman numeral if possible
 * @param value - The value to convert
 */
export const formatRoman = (value: string) => romanNumeralMap[value] || value

interface ProjectLocation {
  street?: string | null
  postcode?: string | null
  city?: string | null
}

/**
 * Formats an address from legacy database project location fields
 * @param projectLocation - The project location data from legacy database
 * @returns Formatted address string or empty string if no data available
 */
export function formatProjectAddress(projectLocation?: ProjectLocation | null): string {
  if (!projectLocation) {
    return ""
  }

  const { street, postcode, city } = projectLocation

  // Build address parts, filtering out empty values
  const addressParts = [street, postcode, city].filter((part) => part && part.trim() !== "")

  if (addressParts.length === 0) {
    return ""
  }

  // Join with comma and space, then trim
  const address = addressParts.join(", ").trim()

  return address
}
