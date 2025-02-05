import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

export interface AggregatedMaterialsDataByCategory {
  costGroupCategoryId: number
  costGroupCategoryName: string
  aggregatedMass: number
  aggregatedMassPercentage: number
}

export interface AggregatedMaterialsData {
  aggregatedByCategory: AggregatedMaterialsDataByCategory[]
  totalMass: number
  totalMassRelativeToNrf: number
}

export interface AggregatedMaterialsDataByMaterialClass {
  materialClassId: string
  materialClassDescription: string
  aggregatedMass: number
  aggregatedMassPercentage: number
}

export interface AggregatedMaterialsDataByMaterial {
  aggregatedByClassId: AggregatedMaterialsDataByMaterialClass[]
  totalMass: number
  totalMassRelativeToNrf: number
}

function aggregateMasses(
  entries: { mass: number; groupingKey: string; groupingName: string }[],
  buildingNrf: number
): {
  aggregatedData: {
    groupingKey: string
    groupingName: string
    aggregatedMass: number
    aggregatedMassPercentage: number
  }[]
  totalMass: number
  totalMassRelativeToNrf: number
} {
  const aggregationMap = entries.reduce((acc, { mass, groupingKey, groupingName }) => {
    const existing = acc.get(groupingKey)
    if (existing) {
      acc.set(groupingKey, {
        name: groupingName,
        aggregatedMass: existing.aggregatedMass + mass,
      })
    } else {
      acc.set(groupingKey, {
        name: groupingName,
        aggregatedMass: mass,
      })
    }
    return acc
  }, new Map<string, { name: string; aggregatedMass: number }>())

  const aggregatedDataArr = Array.from(aggregationMap, ([key, { name, aggregatedMass }]) => ({
    groupingKey: key,
    groupingName: name,
    aggregatedMass,
  }))

  const totalMass = aggregatedDataArr.reduce((sum, { aggregatedMass }) => sum + aggregatedMass, 0)

  const aggregatedDataArrWithPercentage = aggregatedDataArr.map((data) => {
    const aggregatedMassPercentage = totalMass !== 0 ? (data.aggregatedMass / totalMass) * 100 : 0
    return {
      ...data,
      aggregatedMassPercentage,
    }
  })

  const aggregatedData = aggregatedDataArrWithPercentage.sort((a, b) => a.aggregatedMass - b.aggregatedMass)

  const totalMassRelativeToNrf = totalMass / buildingNrf

  return {
    aggregatedData,
    totalMass,
    totalMassRelativeToNrf,
  }
}

export const aggregateMaterialsDataByBuildingComponentCategory = (
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[],
  buildingNrf: number
): AggregatedMaterialsData => {
  const entries = dinEnrichedBuildingComponents.map(
    ({ dinCategoryLevelNumber, din276CategoryName, materials: layers }) => ({
      mass: layers.reduce((sum, layer) => sum + layer.massInKg, 0),
      groupingKey: dinCategoryLevelNumber.toString(),
      groupingName: din276CategoryName,
    })
  )

  const { aggregatedData, totalMass, totalMassRelativeToNrf } = aggregateMasses(entries, buildingNrf)

  const aggregatedByCategory: AggregatedMaterialsDataByCategory[] = aggregatedData.map(
    ({ groupingKey, groupingName, aggregatedMass, aggregatedMassPercentage }) => ({
      costGroupCategoryId: parseInt(groupingKey),
      costGroupCategoryName: groupingName,
      aggregatedMass,
      aggregatedMassPercentage,
    })
  )

  return {
    aggregatedByCategory,
    totalMass,
    totalMassRelativeToNrf,
  }
}

export const aggregateMaterialsDataByMaterialClass = (
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[],
  buildingNrf: number
): AggregatedMaterialsDataByMaterial => {
  const entries = dinEnrichedBuildingComponents.flatMap(({ materials }) =>
    materials.map(({ massInKg, genericMaterial }) => ({
      mass: massInKg,
      groupingKey: genericMaterial.classId,
      groupingName: genericMaterial.classDescription,
    }))
  )

  const { aggregatedData, totalMass, totalMassRelativeToNrf } = aggregateMasses(entries, buildingNrf)

  const aggregatedByClassId: AggregatedMaterialsDataByMaterialClass[] = aggregatedData.map(
    ({ groupingKey, groupingName, aggregatedMass, aggregatedMassPercentage }) => ({
      materialClassId: groupingKey,
      materialClassDescription: groupingName,
      aggregatedMass,
      aggregatedMassPercentage,
    })
  )

  return {
    aggregatedByClassId,
    totalMass,
    totalMassRelativeToNrf,
  }
}
