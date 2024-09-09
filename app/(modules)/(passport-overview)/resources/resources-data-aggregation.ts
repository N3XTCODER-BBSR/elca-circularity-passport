import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  ResourcesEmbodiedEmissions,
  ResourcesEmbodiedEnergy,
  ResourcesRawMaterials,
} from "app/(utils)/data-schema/versions/v1/passportSchema"

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
        return sum + (layer.ressources.rawMaterials[propertyName] || 0)
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

// TODO: TECH DEBT - the whole folloing code about PENRT and GWP should:
// be extracted into its own file
// be reviewed and refactored - even thought the goal is achieved to have one method for both PENRT and GWP, the code is not clean and not easy to read
// also, there are two ts-ignore lines
// overall, it needs improvement / proper use of type generics
// also the method signature ("API") is weird at the moment - either:
//   * use just one string to indicate whether its about GWP or PENRT
//   * or use two proxy functions around that generic methods and export/use only the proxy functions

// New resources aggregation //todo: remove old
type AggregatedGwpOrPenrtDataNew = {
  // lifecyclePhase: string
  lifecycleSubphaseId: string
  lifecycleSubphaseName: string
  aggregatedValue: number
  aggregatedValuePercentage: number
  label: string
  // TODO: improve this - it should not be about visual aspects (like patterns), but about semantics on this level
  pattern?: string
}

type GwpLabelsConfig = {
  propertyName: keyof ResourcesEmbodiedEmissions
  labelName: string
  pattern?: string
}

type PenrtLabelsConfig = {
  propertyName: keyof ResourcesEmbodiedEnergy
  labelName: string
  pattern?: string
}

// TODO: extract this out to a separate file
// TODO: use i18n in once it's introduced
const gwpLabelsConfigs: GwpLabelsConfig[] = [
  { propertyName: "gwpA1A2A3", labelName: "Modul A1 - A3", pattern: "dots" },
  { propertyName: "gwpB1", labelName: "Modul B1" },
  { propertyName: "gwpB4", labelName: "Modul B2, B4" },
  { propertyName: "gwpB6", labelName: "Modul B6" },
  { propertyName: "gwpC3", labelName: "Modul C3", pattern: "dots" },
  { propertyName: "gwpC4", labelName: "Modul C4", pattern: "dots" },
]

const penrtLabelsConfig: PenrtLabelsConfig[] = [
  { propertyName: "penrtA1A2A3", labelName: "Modul A1 - A3", pattern: "dots" },
  { propertyName: "penrtB1", labelName: "Modul B1" },
  { propertyName: "penrtB4", labelName: "Modul B2, B4" },
  { propertyName: "penrtB6", labelName: "Modul B6" },
  { propertyName: "penrtC3", labelName: "Modul C3", pattern: "dots" },
  { propertyName: "penrtC4", labelName: "Modul C4", pattern: "dots" },
]

export type GwpAggregationConfig = {
  propertyName: "embodiedEmissions"
  labelsConfig: GwpLabelsConfig[]
}

export type PenrtAggregationConfig = {
  propertyName: "embodiedEnergy"
  labelsConfig: PenrtLabelsConfig[]
}

type AggregationConfig = GwpAggregationConfig | PenrtAggregationConfig

export const penrtAggregationConfig: PenrtAggregationConfig = {
  propertyName: "embodiedEnergy",
  labelsConfig: penrtLabelsConfig,
}

export const gwpAggregationConfig: GwpAggregationConfig = {
  propertyName: "embodiedEmissions",
  labelsConfig: gwpLabelsConfigs,
}

function isGwpAggregationConfig(config: AggregationConfig): config is GwpAggregationConfig {
  return config.propertyName === "embodiedEmissions"
}

export function aggregateGwpOrPenrt(
  buildingComponents: DinEnrichedBuildingComponent[],
  aggregationConfig: AggregationConfig
): AggregatedGwpOrPenrtDataNew[] {
  const aggregationMap = buildingComponents.reduce(
    (acc, component) => {
      const { layers } = component

      aggregationConfig.labelsConfig.forEach(({ propertyName }) => {
        const totalForResource = layers.reduce((sum, layer) => {
          if (isGwpAggregationConfig(aggregationConfig)) {
            // TODO: fix ts issues and remove ts-ignore
            // @ts-ignore
            return sum + (layer.ressources.embodiedEmissions[propertyName] || 0)
          } else {
            // TODO: fix ts issues and remove ts-ignore
            // @ts-ignore
            return sum + (layer.ressources.embodiedEnergy[propertyName] || 0)
          }
        }, 0)

        if (acc[propertyName] == null) {
          acc[propertyName] = 0
        }
        acc[propertyName] += totalForResource
      })

      return acc
    },
    {} as Record<string, number>
  )

  const totalResources = Object.values(aggregationMap).reduce((sum, value) => sum + value, 0)

  return aggregationConfig.labelsConfig.map(({ propertyName, labelName, pattern }) => {
    const aggregatedValue = aggregationMap[propertyName] || 0
    const aggregatedValuePercentage = (aggregatedValue / totalResources) * 100
    return {
      lifecycleSubphaseId: propertyName,
      lifecycleSubphaseName: labelName,
      aggregatedValue,
      label: `${labelName}: ${aggregatedValuePercentage.toFixed(2)}% / ${aggregatedValue.toFixed(2)} ${
        isGwpAggregationConfig(aggregationConfig) ? "kg CO2eq" : "kwH"
      }`,
      aggregatedValuePercentage,
      pattern,
    }
  })
}
