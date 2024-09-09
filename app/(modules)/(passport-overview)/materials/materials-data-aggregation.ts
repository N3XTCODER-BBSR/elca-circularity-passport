import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

export interface AggretatedMaterialsDataByCategoryWithPercentage {
  costGroupCategoryId: number
  costGroupCategoryName: string
  aggregatedMass: number
  aggregatedMassPercentage: number
  label: string
}
export interface AggregatedMaterialsData {
  aggretatedByCategoryWithPercentageSorted: AggretatedMaterialsDataByCategoryWithPercentage[]
  totalMass: number
  totalMassRelativeToNrf: number
}

// TODO: aggregateMaterialsDataByMaterialClass and aggregateMaterialsDataByBuildingComponentCategory are not dry
// Both calculate the same total mass and mass in relation to nrf (on top of the grouped list of mass that each is doing in fact differently, based on different properties)
export const aggregateMaterialsDataByBuildingComponentCategory = (
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[],
  buildingNrf: number
): AggregatedMaterialsData => {
  // Initialize a map to store aggregated data
  const aggregationMap = new Map<number, { costGroupCategoryName: string; aggregatedMass: number }>()

  dinEnrichedBuildingComponents.forEach((component) => {
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
        costGroupCategoryName: din276CategoryName,
        aggregatedMass: totalMass,
      })
    }
  })

  const aggretatedDataArr = Array.from(
    aggregationMap,
    ([costGroupCategoryId, { costGroupCategoryName, aggregatedMass }]) => ({
      costGroupCategoryId,
      costGroupCategoryName,
      aggregatedMass,
    })
  )

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

  const totalMassRelativeToNrf = Math.round((totalMass / buildingNrf) * 100)

  return {
    aggretatedByCategoryWithPercentageSorted,
    totalMass,
    totalMassRelativeToNrf,
  }
}

export interface AggregatedMaterialsDataByMaterialClassWithPercentage {
  materialClassId: string
  materialClassDescription: string
  aggregatedMass: number
  aggregatedMassPercentage: number
  label: string
}

export interface AggregatedMaterialsDataByMaterialClass {
  aggregatedByClassIdWithPercentageSorted: AggregatedMaterialsDataByMaterialClassWithPercentage[]
  totalMass: number
  totalMassRelativeToNrf: number
}

export const aggregateMaterialsDataByMaterialClass = (
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[],
  buildingNrf: number
): AggregatedMaterialsDataByMaterialClass => {
  const aggregationMap = new Map<string, { materialClassDescription: string; aggregatedMass: number }>()

  dinEnrichedBuildingComponents.forEach((component) => {
    component.layers.forEach((layer) => {
      const { material } = layer
      const { materialClassId, materialClassDescription } = material

      // Check if the materialClassId already exists in the map
      if (aggregationMap.has(materialClassId)) {
        // Update the existing entry
        aggregationMap.get(materialClassId)!.aggregatedMass += layer.mass
      } else {
        // Create a new entry
        aggregationMap.set(materialClassId, {
          materialClassDescription,
          aggregatedMass: layer.mass,
        })
      }
    })
  })

  const aggregatedDataArr = Array.from(
    aggregationMap,
    ([materialClassId, { materialClassDescription, aggregatedMass }]) => ({
      materialClassId,
      materialClassDescription,
      aggregatedMass,
    })
  )

  const totalMass = aggregatedDataArr.reduce((sum, { aggregatedMass }) => sum + aggregatedMass, 0)

  const aggregatedDataArrWithPercentageAndLabel = aggregatedDataArr.map((data) => {
    const aggregatedMassPercentage = (data.aggregatedMass / totalMass) * 100
    return {
      ...data,
      aggregatedMassPercentage,
      label: `${aggregatedMassPercentage.toFixed(2)}% (${data.aggregatedMass.toFixed(2)} t)`,
    }
  })

  const aggregatedByClassIdWithPercentageSorted: AggregatedMaterialsDataByMaterialClassWithPercentage[] =
    aggregatedDataArrWithPercentageAndLabel.sort((a, b) => a.aggregatedMass - b.aggregatedMass)

  const totalMassRelativeToNrf = Math.round((totalMass / buildingNrf) * 100)

  return {
    aggregatedByClassIdWithPercentageSorted,
    totalMass,
    totalMassRelativeToNrf,
  }
}
