import { din276Hierarchy } from "./din276Mapping"
import { DinEnrichedBuildingComponent } from "./enrichtComponentsArrayWithDin276Labels"

const mergeDin276HierarchyWithBuildingComponents = (buildingComponents: DinEnrichedBuildingComponent[]) => {
  const mergedDin276Hierarchy = din276Hierarchy.map((group) => {
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
