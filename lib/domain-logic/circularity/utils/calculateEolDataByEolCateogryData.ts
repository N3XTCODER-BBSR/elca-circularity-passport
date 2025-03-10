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
import { getEolClassNameByPoints, getEolPointsByScenario } from "lib/domain-logic/circularity/utils/circularityMappings"
import { TBs_ProductDefinitionEOLCategory } from "prisma/generated/client"

export function calculateEolDataByEolCateogryData(eolCategory: TBs_ProductDefinitionEOLCategory | null | undefined) {
  if (eolCategory == null) {
    return
  }
  const realScenario = eolCategory.eolScenarioUnbuiltReal
  const realPoints = getEolPointsByScenario(realScenario)
  const realClassName = getEolClassNameByPoints(realPoints)

  const potentialScenario = eolCategory.eolScenarioUnbuiltPotential
  const potentialPoints = getEolPointsByScenario(potentialScenario)
  const potentialClassName = getEolClassNameByPoints(potentialPoints)

  const totalPoints = realPoints - (realPoints - potentialPoints) * eolCategory.technologyFactor
  const totalClassName = getEolClassNameByPoints(totalPoints)

  return {
    eolUnbuiltRealScenario: realScenario,
    eolUnbuiltRealPoints: realPoints,
    eolUnbuiltRealClassName: realClassName,
    eolUnbuiltPotentialScenario: potentialScenario,
    eolUnbuiltPotentialPoints: potentialPoints,
    eolUnbuiltPotentialClassName: potentialClassName,
    eolUnbuiltTotalPoints: totalPoints,
    eolUnbuiltTotalClassName: totalClassName,
  }
}
