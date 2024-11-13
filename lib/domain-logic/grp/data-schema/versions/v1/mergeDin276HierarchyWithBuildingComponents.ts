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

const mergeDin276HierarchyWithBuildingComponents = (
  buildingComponents: ComponentWithBasicFields[],
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
