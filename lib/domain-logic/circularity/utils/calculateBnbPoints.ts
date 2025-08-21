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
 * Calculates the interpolated points for Rückbaubarkeit (dismantling) according to official rules.
 *
 * @param rueckbau - The weighted Rückbaupotenzial (RGeb)
 * @returns The calculated points (0-25, rounded)
 */
export function calculateBnbDismantlingPoints(rueckbau: number): number {
  const Rmax = 45
  const Rmin = 7.5
  if (rueckbau >= Rmax) return 25
  if (rueckbau <= Rmin) return 0
  // Interpolate and round to nearest integer
  return Math.round(((rueckbau - Rmin) / (Rmax - Rmin)) * 25)
}

/**
 * Calculates the interpolated points for Zirkularität according to official rules.
 *
 * @param zirkularitaet - The weighted Zirkularitätspotenzial (ZGeb)
 * @returns The calculated points (0-50, rounded)
 */
export function calculateBnbCircularityPoints(zirkularitaet: number): number {
  const Zmax = 60
  const Zmin = 20
  if (zirkularitaet >= Zmax) return 50
  if (zirkularitaet <= Zmin) return 0
  // Interpolate and round to nearest integer
  return Math.round(((zirkularitaet - Zmin) / (Zmax - Zmin)) * 50)
}
