import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  Layer,
  LifeCycleSubPhaseId,
  LifeCycleSubPhaseIdSchema,
  MaterialResourceTypeNames,
  MaterialResourceTypeNamesSchema,
  Ressources,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

const resourceTypesRenewable: MaterialResourceTypeNames[] = [
  MaterialResourceTypeNamesSchema.Enum.Forestry,
  MaterialResourceTypeNamesSchema.Enum.Agrar,
  MaterialResourceTypeNamesSchema.Enum.Aqua,
]

const resourceTypesNonRenewable: MaterialResourceTypeNames[] = [
  MaterialResourceTypeNamesSchema.Enum.Mineral,
  MaterialResourceTypeNamesSchema.Enum.Metallic,
  MaterialResourceTypeNamesSchema.Enum.Fossil,
]

const resourceTypesCategoryToNamesMapping = {
  renewable: resourceTypesRenewable,
  nonRenewable: resourceTypesNonRenewable,
  all: [...resourceTypesRenewable, ...resourceTypesNonRenewable],
}

type aggregatedByByResourceTypeWithPercentage = {
  resourceTypeName: MaterialResourceTypeNames
  aggregatedValue: number
  percentageValue: number
}

export type AggregatedRmiData = {
  aggregatedByByResourceTypeWithPercentage: aggregatedByByResourceTypeWithPercentage[]
  aggregatedDataTotal: number
  aggregatedDataTotalPerNrf2m: number
}

// Helper function to aggregate layer properties
function aggregateLayerProperties<T extends Record<string, number>>(
  buildingComponents: DinEnrichedBuildingComponent[],
  getLayerValues: (layer: Layer) => T,
  propertyNames: (keyof T)[]
): Record<string, number> {
  return buildingComponents.reduce(
    (acc, component) => {
      const { layers } = component

      propertyNames.forEach((propertyName) => {
        const totalForProperty = layers.reduce((sum, layer) => {
          const layerValues = getLayerValues(layer)
          return sum + (layerValues[propertyName] || 0)
        }, 0)

        const key = propertyName as string
        if (acc[key] == null) {
          acc[key] = 0
        }
        acc[key] += totalForProperty
      })

      return acc
    },
    {} as Record<string, number>
  )
}

// RMI Aggregation Function
export const aggregateRmiData = (
  buildingComponents: DinEnrichedBuildingComponent[],
  resourceTypesCategory: "renewable" | "nonRenewable" | "all",
  nrf: number
): AggregatedRmiData => {
  const resourceNames = resourceTypesCategoryToNamesMapping[resourceTypesCategory]

  const aggregatedResourceMap = aggregateLayerProperties(
    buildingComponents,
    (layer) => layer.ressources.rawMaterials,
    resourceNames
  )

  const totalResources = Object.values(aggregatedResourceMap).reduce((sum, value) => sum + value, 0)

  const aggregatedByByResourceTypeWithPercentage: aggregatedByByResourceTypeWithPercentage[] = (
    Object.entries(aggregatedResourceMap) as [MaterialResourceTypeNames, number][]
  ).map(([resourceTypeName, aggregatedValue]) => {
    const percentageValue = totalResources > 0 ? (aggregatedValue / totalResources) * 100 : 0

    return {
      resourceTypeName,
      aggregatedValue,
      percentageValue,
    }
  })

  const aggregatedDataTotal = Math.round(
    aggregatedByByResourceTypeWithPercentage.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )

  const aggregatedDataTotalPerNrf2m = nrf > 0 ? Math.round(aggregatedDataTotal / nrf) : 0

  return {
    aggregatedByByResourceTypeWithPercentage,
    aggregatedDataTotal,
    aggregatedDataTotalPerNrf2m,
  }
}

type LabelsConfig = {
  propertyName: LifeCycleSubPhaseId
  isGray?: boolean
}

const gwpConfigs: LabelsConfig[] = [
  { propertyName: "A1A2A3", isGray: true },
  { propertyName: "B1" },
  { propertyName: "B4" },
  { propertyName: "B6" },
  { propertyName: "C3", isGray: true },
  { propertyName: "C4", isGray: true },
]

const penrtConfigs: LabelsConfig[] = [
  { propertyName: "A1A2A3", isGray: true },
  { propertyName: "B1" },
  { propertyName: "B4" },
  { propertyName: "B6" },
  { propertyName: "C3", isGray: true },
  { propertyName: "C4", isGray: true },
]

export type AggregatedGwpOrPenrtData = {
  lifecycleSubphaseId: LifeCycleSubPhaseId
  aggregatedValue: number
  aggregatedValuePercentage: number
  isGray?: boolean
}

export type AggregatedGwpOrPenrtDataResult = {
  aggregatedData: AggregatedGwpOrPenrtData[]
  aggregatedDataTotal: number
  aggregatedDataTotalPerNrf: number
  aggregatedDataGrayTotal: number
}

// Generic function to aggregate resource data
function aggregateResourceData(
  buildingComponents: DinEnrichedBuildingComponent[],
  getLayerValues: (layer: Layer) => Record<LifeCycleSubPhaseId, number>,
  configs: LabelsConfig[]
): AggregatedGwpOrPenrtData[] {
  const propertyNames = configs.map((config) => config.propertyName)

  const aggregationMap = aggregateLayerProperties(buildingComponents, getLayerValues, propertyNames)

  const totalResources = Object.values(aggregationMap).reduce((sum, value) => sum + value, 0)

  return configs.map(({ propertyName, isGray }) => {
    const aggregatedValue = aggregationMap[propertyName as LifeCycleSubPhaseId] || 0
    const aggregatedValuePercentage = totalResources > 0 ? (aggregatedValue / totalResources) * 100 : 0
    return {
      lifecycleSubphaseId: propertyName,
      aggregatedValue,
      aggregatedValuePercentage,
      isGray,
    }
  })
}

export function aggregateGwpData(
  buildingComponents: DinEnrichedBuildingComponent[],
  nrf: number
): AggregatedGwpOrPenrtDataResult {
  const aggregatedData = aggregateResourceData(
    buildingComponents,
    (layer) => layer.ressources.embodiedEmissions,
    gwpConfigs
  )

  const aggregatedDataTotal = aggregatedData.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  const aggregatedDataTotalPerNrf = nrf > 0 ? aggregatedDataTotal / nrf : 0

  const aggregatedDataGrayTotal = aggregatedData
    .filter((data) => data.isGray)
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  return {
    aggregatedData,
    aggregatedDataTotal,
    aggregatedDataTotalPerNrf,
    aggregatedDataGrayTotal,
  }
}

export function aggregatePenrtData(
  buildingComponents: DinEnrichedBuildingComponent[],
  nrf: number
): AggregatedGwpOrPenrtDataResult {
  const aggregatedData = aggregateResourceData(
    buildingComponents,
    (layer) => layer.ressources.embodiedEnergy,
    penrtConfigs
  )

  const aggregatedDataTotal = aggregatedData.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)

  // Calculate Gray Energy Total
  const aggregatedDataGrayTotal = aggregatedData
    .filter((data) => data.isGray)
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const aggregatedDataTotalPerNrf = nrf > 0 ? aggregatedDataTotal / nrf : 0

  return {
    aggregatedData,
    aggregatedDataTotal,
    aggregatedDataTotalPerNrf,
    aggregatedDataGrayTotal,
  }
}
export function calculateRmiTotal(resources: Ressources): number {
  const rawMaterials = resources?.rawMaterials || {}
  const total = Object.values(rawMaterials).reduce((sum, value) => sum + (value || 0), 0)
  return Math.round(total)
}

export function calculateQpABC(resources: Ressources): number {
  const phases = LifeCycleSubPhaseIdSchema.options
  const embodiedEnergy = resources?.embodiedEnergy || {}
  const total = phases.reduce((sum, phase) => sum + (embodiedEnergy[phase] || 0), 0)
  return total
}

export function calculateGwpABC(resources: Ressources): number {
  const phases = LifeCycleSubPhaseIdSchema.options
  const embodiedEmissions = resources?.embodiedEmissions || {}
  const total = phases.reduce((sum, phase) => sum + (embodiedEmissions[phase] || 0), 0)
  return total
}
