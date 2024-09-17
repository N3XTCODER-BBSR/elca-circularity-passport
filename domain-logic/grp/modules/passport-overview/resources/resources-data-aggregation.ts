import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  ResourcesEmbodiedEmissions,
  ResourcesEmbodiedEnergy,
  ResourcesRawMaterials,
} from "domain-logic/grp/data-schema/versions/v1/passportSchema"

type ResourceConfig = {
  propertyName: keyof ResourcesRawMaterials
  labelName: string
}

const resourceTypesRenewable: ResourceConfig[] = [
  { propertyName: "rmiForestry", labelName: "Forst" },
  { propertyName: "rmiAgrar", labelName: "Agrar" },
  { propertyName: "rmiAqua", labelName: "Wasser" },
]

const resourceTypesNonRenewable: ResourceConfig[] = [
  { propertyName: "rmiFossil", labelName: "Fossil" },
  { propertyName: "rmiMetallic", labelName: "Metallisch" },
  { propertyName: "rmiMineral", labelName: "Mineralisch" },
]

const resourceTypesCategoryMapping = {
  renewable: resourceTypesRenewable,
  nonRenewable: resourceTypesNonRenewable,
  all: [...resourceTypesRenewable, ...resourceTypesNonRenewable],
}

type AggretatedByByResourceTypeWithPercentage = {
  resourceTypeName: string
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
  // resourceConfigs: ResourceConfig[],
  resourceTypesCategory: "renewable" | "nonRenewable" | "all",
  nrf: number
): AggregatedRmiData => {
  const resourceConfigs = resourceTypesCategoryMapping[resourceTypesCategory]

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
      // TODO: extract this out to presentation logic
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

// TODO: TECH DEBT - the whole following code about PENRT and GWP should:
// be extracted into its own file
// be reviewed and refactored - even thought the goal is achieved to have one method for both PENRT and GWP, the code is not clean and not easy to read
// also, there are two ts-ignore lines
// overall, it needs improvement / proper use of type generics
// also the method signature ("API") is weird at the moment - either:
//   * use just one string to indicate whether its about GWP or PENRT
//   * or use two proxy functions around that generic methods and export/use only the proxy functions

// New resources aggregation
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

// TODO: Don't export this - handle this better here in domain logic code
export const penrtAggregationConfig: PenrtAggregationConfig = {
  propertyName: "embodiedEnergy",
  labelsConfig: penrtLabelsConfig,
}

// TODO: Don't export this - handle this better here in domain logic code
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
            const typedPropertyName = propertyName as keyof ResourcesEmbodiedEmissions
            return sum + (layer.ressources.embodiedEmissions[typedPropertyName] || 0)
          } else {
            const typedPropertyName = propertyName as keyof ResourcesEmbodiedEnergy
            return sum + (layer.ressources.embodiedEnergy[typedPropertyName] || 0)
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
