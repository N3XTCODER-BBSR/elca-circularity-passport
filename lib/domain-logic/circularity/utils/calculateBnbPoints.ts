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
 * Higher-order function that returns a configured linear score calculator.
 *
 * @param maxPoints - The maximum points to return
 * @param maxValue - The maximum threshold (returns maxPoints if value >= maxValue)
 * @param minValue - The minimum threshold (returns 0 if value <= minValue)
 * @returns A function that calculates the linear score for a given input value
 */
function getLinearScoreCalculator(maxPoints: number, maxValue: number, minValue: number) {
  return (value: number): number => {
    if (value >= maxValue) return maxPoints
    if (value <= minValue) return 0
    // Interpolate and round to nearest integer
    return Math.round(((value - minValue) / (maxValue - minValue)) * maxPoints)
  }
}

/**
 * Calculates the interpolated points for Rückbaubarkeit (dismantling) according to official rules.
 *
 * @param rueckbau - The weighted Rückbaupotenzial (RGeb)
 * @returns The calculated points (0-25, rounded)
 */
export const calculateBnbDismantlingPoints = getLinearScoreCalculator(25, 45, 7.5)

/**
 * Calculates the interpolated points for Zirkularität according to official rules.
 *
 * @param zirkularitaet - The weighted Zirkularitätspotenzial (ZGeb)
 * @returns The calculated points (0-50, rounded)
 */
export const calculateBnbCircularityPoints = getLinearScoreCalculator(50, 60, 20)
