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
import { din276Hierarchy } from "./din276Mapping"
import { BuildingComponent, PassportData } from "./passportSchema"

export type DinEnrichedBuildingComponent = Omit<BuildingComponent, "costGroupDIN276"> & {
  dinComponentLevelNumber: number
  din276ComponetTypeName: string
  dinGroupLevelNumber: number
  din276GroupName: string
  dinCategoryLevelNumber: number
  din276CategoryName: string
}

export type DinEnrichedPassportData = Omit<PassportData, "buildingComponents"> & {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
}

export const enrichComponentsArrayWithDin276Labels = (
  buildingComponents: BuildingComponent[]
): DinEnrichedBuildingComponent[] => {
  const dinLabelEnrichedComponents = buildingComponents.map((component) => {
    // TODO (L): add error handling for non-existing values
    const { costGroupDIN276: dinComponentLevelNumber } = component

    const dinCategoryLevelNumber = Math.floor(dinComponentLevelNumber / 10) * 10
    const dinGroupLevelNumber = Math.floor(dinComponentLevelNumber / 100) * 100

    const group = din276Hierarchy.find((el) => el.number === dinGroupLevelNumber)
    const category = group?.children.find((el) => el.number === dinCategoryLevelNumber)
    const componentType = category?.children.find((el) => el.number === dinComponentLevelNumber)
    return {
      ...component,
      dinComponentLevelNumber,
      din276ComponetTypeName: componentType?.name || "DIN " + dinComponentLevelNumber,
      dinCategoryLevelNumber,
      din276CategoryName: category?.name || "DIN " + dinCategoryLevelNumber,
      dinGroupLevelNumber,
      din276GroupName: group?.name || "DIN " + dinGroupLevelNumber,
    }
  })

  return dinLabelEnrichedComponents
}

export default enrichComponentsArrayWithDin276Labels
