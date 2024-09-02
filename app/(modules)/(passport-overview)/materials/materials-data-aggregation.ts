import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

export interface AggretatedMaterialsDataByCategoryWithPercentage {
  costGroupCategory: number
  categoryName: string
  aggregatedMass: number
  aggregatedMassPercentage: number
  label: string
}
export interface AggregatedMaterialsData {
  aggretatedByCategoryWithPercentageSorted: AggretatedMaterialsDataByCategoryWithPercentage[]
  totalMass: number
  totalMassPercentage: number
}

export const aggregateMaterialsData = (
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[],
  buildingNrf: number
): AggregatedMaterialsData => {
  // Initialize a map to store aggregated data
  const aggregationMap = new Map<number, { categoryName: string; aggregatedMass: number }>()

  dinEnrichedBuildingComponents.forEach((component) => {
    // din276ComponetTypeName: componentType?.name,
    //   din276GroupName: group?.name,
    //   din276CategoryName

    // costGroupDIN276

    const { dinCategoryLevelNumber, din276CategoryName, layers } = component

    // Calculate the total mass for this component
    const totalMass = layers.reduce((sum, layer) => sum + layer.mass, 0)

    // Check if the costGroupCategory already exists in the map
    if (aggregationMap.has(dinCategoryLevelNumber)) {
      // Update the existing entry
      aggregationMap.get(dinCategoryLevelNumber)!.aggregatedMass += totalMass
    } else {
      // Create a new entry
      aggregationMap.set(dinCategoryLevelNumber, {
        categoryName: din276CategoryName,
        aggregatedMass: totalMass,
      })
    }
  })

  // Convert the map to an array of AggregatedData
  const aggretatedDataArr = Array.from(aggregationMap, ([costGroupCategory, { categoryName, aggregatedMass }]) => ({
    costGroupCategory,
    categoryName,
    aggregatedMass,
  }))

  const totalMass = aggretatedDataArr.reduce((sum, { aggregatedMass }) => sum + aggregatedMass, 0)

  const aggregatedDataArrWithPercentageAndLabel = aggretatedDataArr.map((data) => {
    const aggregatedMassPercentage = (data.aggregatedMass / totalMass) * 100
    return {
      ...data,
      aggregatedMassPercentage,
      label: `${aggregatedMassPercentage.toFixed(2)}% (${data.aggregatedMass.toFixed(2)} t)`,
    }
  })

  const aggretatedByCategoryWithPercentageSorted: AggretatedMaterialsDataByCategoryWithPercentage[] =
    aggregatedDataArrWithPercentageAndLabel.sort((a, b) => a.aggregatedMass - b.aggregatedMass)

  const totalMassPercentage = Math.round((totalMass / buildingNrf) * 100)

  return {
    aggretatedByCategoryWithPercentageSorted,
    totalMass,
    totalMassPercentage,
  }
}
