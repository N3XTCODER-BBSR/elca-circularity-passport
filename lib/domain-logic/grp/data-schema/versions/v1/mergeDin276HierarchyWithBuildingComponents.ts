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
import _ from "lodash"
import { ComponentWithBasicFields } from "lib/domain-logic/shared/basic-types"
import { din276Hierarchy } from "./din276Mapping"

export type Din276MergedComponent = {
  groupNumber: number
  name: string
  categories: {
    categoryNumber: number
    name: string
    componentTypes: {
      componentTypeNumber: number
      name: string
      components: ComponentWithBasicFields[]
      numberOfComponents: number
    }[]
    numberOfComponents: number
  }[]
  numberOfComponents: number
}

const filterDinHierachysForCategoryNumbersToInclude = (categoryNumbersToInclude?: number[]) => {
  if (categoryNumbersToInclude == null) {
    return din276Hierarchy
  }

  const groupNumbersToInclude = _.uniq(categoryNumbersToInclude.map((el) => Math.floor(el / 100) * 100))
  const filtered = din276Hierarchy
    .filter((el) => groupNumbersToInclude.includes(el.number))
    .map((group) => ({
      ...group,
      children: group.children.filter((cat) => categoryNumbersToInclude.includes(cat.number)),
    }))

  return filtered
}

const mergeDin276HierarchyWithBuildingComponents = <T extends ComponentWithBasicFields[]>(
  buildingComponents: T,
  categoryNumbersToInclude?: number[]
): Din276MergedComponent[] => {
  const filteredDin276Hierarchy = filterDinHierachysForCategoryNumbersToInclude(categoryNumbersToInclude)

  const mergedDin276Hierarchy: Din276MergedComponent[] = filteredDin276Hierarchy.map((group) => {
    const categories = group.children.map((category) => {
      const componentTypes = category.children.map((componentType) => {
        const components = buildingComponents.filter((buildingComponent) => {
          return buildingComponent.dinComponentLevelNumber === componentType.number
        })
        const mergedComponentType = {
          componentTypeNumber: componentType.number,
          name: componentType.name,
          components,
          numberOfComponents: components.length,
        }

        return mergedComponentType
      })
      const mergedCategory = {
        categoryNumber: category.number,
        name: category.name,
        componentTypes,
        numberOfComponents: componentTypes.reduce((acc, curr) => acc + curr.numberOfComponents, 0),
      }
      return mergedCategory
    })
    const mergedGroup = {
      groupNumber: group.number,
      name: group.name,
      categories,
      numberOfComponents: categories.reduce((acc, curr) => acc + curr.numberOfComponents, 0),
    }
    return mergedGroup
  })
  return mergedDin276Hierarchy
}

export default mergeDin276HierarchyWithBuildingComponents
