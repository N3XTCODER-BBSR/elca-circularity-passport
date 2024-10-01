import getEolClassNameByPoints from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

export type CircularityDataItem = {
  aggregatedMass: number
  weightedAvgEolPoints: number
  eolClass: string
  din276CategoryName: string
  dinCategoryLevelNumber: number
}

type AggregationMapValue = {
  din276CategoryName: string
  dinCategoryLevelNumber: number
  totalWeightedEolPoints: number
  totalMass: number
}

const aggregateCircularityData = (buildingComponents: DinEnrichedBuildingComponent[]) => {
  const allLayers = buildingComponents.flatMap((component) =>
    component.layers.map((layer) => ({
      layer,
      dinCategoryLevelNumber: component.dinCategoryLevelNumber,
      din276CategoryName: component.din276CategoryName,
    }))
  )

  const validLayers = allLayers.filter(
    ({ layer }) =>
      layer.mass != null && layer.mass !== 0 && layer.circularity != null && layer.circularity.eolPoints != null
  )

  const layerData = validLayers.map(({ layer, dinCategoryLevelNumber, din276CategoryName }) => {
    const mass = layer.mass!
    const eolPoints = layer.circularity!.eolPoints!
    const weightedEolPoints = eolPoints * mass

    return {
      dinCategoryLevelNumber,
      din276CategoryName,
      mass,
      weightedEolPoints,
    }
  })

  const totalMass = layerData.reduce((sum, { mass }) => sum + mass, 0)
  const totalWeightedEolPoints = layerData.reduce((sum, { weightedEolPoints }) => sum + weightedEolPoints, 0)

  const aggregationMapByDinCatLevelNumber = layerData.reduce((map, data) => {
    const { dinCategoryLevelNumber, din276CategoryName, mass, weightedEolPoints } = data

    if (!map.has(dinCategoryLevelNumber)) {
      map.set(dinCategoryLevelNumber, {
        din276CategoryName,
        dinCategoryLevelNumber,
        totalWeightedEolPoints: 0,
        totalMass: 0,
      })
    }

    const aggregationEntry = map.get(dinCategoryLevelNumber)!
    aggregationEntry.totalWeightedEolPoints += weightedEolPoints
    aggregationEntry.totalMass += mass

    return map
  }, new Map<number, AggregationMapValue>())

  const avgEolPointsPerComponentCostCategory = Array.from(aggregationMapByDinCatLevelNumber.values()).map((value) => {
    const { din276CategoryName, dinCategoryLevelNumber, totalWeightedEolPoints, totalMass } = value
    const weightedAvgEolPoints = totalWeightedEolPoints / totalMass
    const eolClass = getEolClassNameByPoints(weightedAvgEolPoints)

    return {
      din276CategoryName,
      dinCategoryLevelNumber,
      aggregatedMass: totalMass,
      weightedAvgEolPoints,
      eolClass,
    }
  })

  const totalAvgEolPoints = totalWeightedEolPoints / totalMass
  const totalEolClass = getEolClassNameByPoints(totalAvgEolPoints)

  return {
    totalAvgEolPoints,
    totalEolClass,
    avgEolPointsPerComponentCostCategory,
  }
}

export default aggregateCircularityData
