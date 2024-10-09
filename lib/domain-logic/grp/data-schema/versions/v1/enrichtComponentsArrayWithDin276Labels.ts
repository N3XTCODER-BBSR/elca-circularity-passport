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
    // TODO: add error handling for non-existing values
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
