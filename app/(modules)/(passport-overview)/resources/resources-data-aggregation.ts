import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { ResourcesRawMaterials, Ressources } from "app/(utils)/data-schema/versions/v1/passportSchema"

type ResourceConfig = {
  propertyName: keyof ResourcesRawMaterials
  labelName: string
}

type AggretatedByByResourceTypeWithPercentage = {
  resourceTypeName: string
  // propertyName: string
  aggregatedValue: number
  percentageValue: number
  label: string
}

type AggregatedRmiData = {
  aggretatedByByResourceTypeWithPercentage: AggretatedByByResourceTypeWithPercentage[]
  aggregatedDataTotal: number
  aggregatedDataTotalPerNrf2m: number
}

type AggregatedGwpOrPenrtData = {
  costGroupCategory: number
  categoryName: string
  aggregatedValue: number
  aggregatedValuePercentage: number
  label: string
}

export const aggregateGwpOrPenrt = (
  buildingComponents: DinEnrichedBuildingComponent[],
  propertyToAggregate: "gwpAB6C" | "penrtAB6C"
): AggregatedGwpOrPenrtData[] => {
  const propertyAccessor =
    propertyToAggregate === "gwpAB6C"
      ? (layerRessources: Ressources) => layerRessources.embodiedEmissions.gwpAB6C
      : (layerRessources: Ressources) => layerRessources.embodiedEnergy.penrtAB6C

  const aggregationMap = new Map<number, { categoryName: string; aggregatedValue: number }>()

  buildingComponents.forEach((component) => {
    // TODO: Fix
    const { layers, din276CategoryName, dinGroupLevelNumber } = component

    const aggregatedValue = layers.reduce((sum, layer) => sum + propertyAccessor(layer.ressources), 0)

    // Check if the costGroupCategory already exists in the map
    if (aggregationMap.has(dinGroupLevelNumber)) {
      // Update the existing entry
      aggregationMap.get(dinGroupLevelNumber)!.aggregatedValue += aggregatedValue
    } else {
      // Create a new entry
      aggregationMap.set(dinGroupLevelNumber, {
        categoryName: din276CategoryName,
        aggregatedValue,
      })
    }
  })

  // Convert the map to an array of AggregatedData
  const aggretatedDataArr = Array.from(aggregationMap, ([costGroupCategory, { categoryName, aggregatedValue }]) => ({
    costGroupCategory,
    categoryName,
    aggregatedValue,
  }))

  const totalValue = aggretatedDataArr.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)

  const aggregatedDataArrWithPercentageAndLabel = aggretatedDataArr.map((data) => {
    const aggregatedValuePercentage = (data.aggregatedValue / totalValue) * 100
    return {
      ...data,
      costGroupCategoryNumberAndName: `${data.costGroupCategory} ${data.categoryName}`,
      aggregatedValuePercentage,
      label: `${aggregatedValuePercentage.toFixed(2)}% (${data.aggregatedValue.toFixed(2)} t)`,
    }
  })

  const aggretatedDataWithPercentageSorted = aggregatedDataArrWithPercentageAndLabel.sort(
    (a, b) => a.aggregatedValue - b.aggregatedValue
  )

  return aggretatedDataWithPercentageSorted
}

export const aggregateRmiData = (
  buildingComponents: DinEnrichedBuildingComponent[],
  resourceConfigs: ResourceConfig[],
  nrf: number
): AggregatedRmiData => {
  const initialResourceMap: Record<string, number> = {}

  const aggregatedResourceMap = buildingComponents.reduce((acc, component) => {
    const { layers } = component

    resourceConfigs.forEach(({ propertyName, labelName }) => {
      const totalForResource = layers.reduce((sum, layer) => {
        return sum + (layer.ressources?.rawMaterials![propertyName] || 0)
      }, 0)

      if (acc[labelName] == null) {
        acc[labelName] = 0
      }
      acc[labelName] += totalForResource
    })

    return acc
  }, initialResourceMap)

  const totalResources = Object.values(aggregatedResourceMap).reduce((sum, value) => sum + value, 0)

  const aggretatedByByResourceTypeWithPercentage: AggretatedByByResourceTypeWithPercentage[] = Object.entries(
    aggregatedResourceMap
  ).map(([resourceTypeName, aggregatedValue]) => {
    const percentageValue = (aggregatedValue / totalResources) * 100

    const label = `${aggregatedValue
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Tonnen - ${percentageValue.toFixed(2)}%`

    return {
      resourceTypeName,
      aggregatedValue,
      percentageValue,
      label,
    }
  })

  const aggregatedDataTotal = Math.round(
    aggretatedByByResourceTypeWithPercentage.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )

  const aggregatedDataTotalPerNrf2m = Math.round(aggregatedDataTotal / nrf)

  return {
    aggretatedByByResourceTypeWithPercentage,
    aggregatedDataTotal,
    aggregatedDataTotalPerNrf2m,
  }
}
