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
 * Calculates the DIN code group level (hundreds place)
 * e.g., 334 -> 300
 *
 * @param dinCode The original DIN code
 * @returns The DIN code group level (hundreds)
 */
export function getDinCodeGroupLevel(dinCode: number): number {
  return Math.floor(dinCode / 100) * 100
}

/**
 * Calculates the DIN code sub-group level (tens place)
 * e.g., 334 -> 330
 *
 * @param dinCode The original DIN code
 * @returns The DIN code sub-group level (tens)
 */
export function getDinCodeSubGroupLevel(dinCode: number): number {
  return Math.floor(dinCode / 10) * 10
}
