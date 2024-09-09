import getEolClassNameByPoints from "app/(utils)/data-schema/versions/v1/circularityDataUtils"
import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

export type CirculartyDataItem = {
  categoryNumberAndName: string
  aggregatedMass: number
  weightedAvgEolPoints: number
  eolClass: string
}

const aggregateCircularityData = (buildingComponents: DinEnrichedBuildingComponent[]) => {
  // We want to aggregate the EOL points for all layers in all components by the Category / Category name
  // Initialize a map to store aggregated data
  const aggregationMap = new Map<
    number,
    {
      categoryNumberAndName: string
      aggregatedMass: number
      weightedEolPoints: number
      costGroupCategoryNumber: number
    }
  >()
  let totalMass = 0
  let totalWeightedEolPoints = 0

  // TODO: overall improve this logic - we could porbably just create the whole final chart data in just one looping

  buildingComponents.forEach((component) => {
    component.layers.forEach((layer) => {
      totalMass += layer.mass
      totalWeightedEolPoints += layer.circularity!.eolPoints! * layer.mass

      // TODO: improve that; either
      // a) make the circularity.eol.points mandatory in the schema
      // b) kick out the element from the collection by skipping this forEach iteration
      const eolPointsCoefficent = layer.circularity.eolPoints!
      const massCoefficient = layer.mass

      const weightedEolPoints = eolPointsCoefficent * massCoefficient

      // Check if the costGroupCategory already exists in the map
      if (!aggregationMap.has(component.dinComponentLevelNumber)) {
        // Create a new entry
        aggregationMap.set(component.dinCategoryLevelNumber, {
          // TODO: rename categoryName to costGroupCategoryName
          categoryNumberAndName: `${component.dinCategoryLevelNumber} ${component.din276CategoryName}`,
          costGroupCategoryNumber: component.dinCategoryLevelNumber,
          weightedEolPoints: 0,
          aggregatedMass: 0,
        })
      }

      // Update the existing entry
      aggregationMap.get(component.dinCategoryLevelNumber)!.weightedEolPoints += weightedEolPoints
      aggregationMap.get(component.dinCategoryLevelNumber)!.aggregatedMass += massCoefficient
    })
  })
  const aggregationMapWithAvgEolPointsAndClasses = new Map<number, CirculartyDataItem>()
  aggregationMap.forEach((value, key) => {
    const weightedAvgEolPoints = value.weightedEolPoints / value.aggregatedMass

    aggregationMapWithAvgEolPointsAndClasses.set(key, {
      ...value,
      weightedAvgEolPoints,
      eolClass: getEolClassNameByPoints(weightedAvgEolPoints),
    })
  })

  const totalAvgEolPoints = Math.round(totalWeightedEolPoints / totalMass)

  return {
    totalAvgEolPoints,
    totalEolClass: getEolClassNameByPoints(totalAvgEolPoints),
    avgEolPointsPerComponentCostCategory: Array.from(aggregationMapWithAvgEolPointsAndClasses.values()),
  }
}

export default aggregateCircularityData
