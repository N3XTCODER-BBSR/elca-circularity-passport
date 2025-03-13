import { getEolClassNameByPoints } from "lib/domain-logic/circularity/utils/circularityMappings"
import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNames,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { MetricType } from "lib/domain-logic/shared/basic-types"

export const rmiColorsMapper = (resourceTypeName: MaterialResourceTypeNames) => {
  const colorsMapping = {
    [MaterialResourceTypeNamesSchema.Enum.Forestry]: "#7DC0A6",
    [MaterialResourceTypeNamesSchema.Enum.Aqua]: "#8ECAC4",
    [MaterialResourceTypeNamesSchema.Enum.Agrar]: "#B3DBB8",
    [MaterialResourceTypeNamesSchema.Enum.Mineral]: "#E1E7EF",
    [MaterialResourceTypeNamesSchema.Enum.Metallic]: "#CBD5E1",
    [MaterialResourceTypeNamesSchema.Enum.Fossil]: "#94A3B8",
  }

  return colorsMapping[resourceTypeName]
}

export const lifeCycleSubPhasesColorsMapper = (lifeCycleSubPhaseId: LifeCycleSubPhaseId) => {
  const colorsMapping: Record<LifeCycleSubPhaseId, string> = {
    A1A2A3: "#FFAC81",
    B1: "#E1E4A0",
    B4: "#D1D770",
    B6: "#B8BF36",
    C3: "#C9E5D6",
    C4: "#ACD7C0",
  }

  return colorsMapping[lifeCycleSubPhaseId]
}

export const eolClassColorsMapper = (eolClass: string) => {
  const colors: { [key: string]: string } = {
    A: "#3e5529",
    B: "#eaeee5",
    C: "#b1cf95",
    "C/D": "#b1cf95",
    D: "#E2EFDA",
    "D/E": "#E2EFDA",
    E: "#FFD967",
    "E/F": "#FFD967",
    F: "#E36C0A",
    "F/G": "#E36C0A",
    G: "#8e4d1c",
  }
  return colors[eolClass] || "black"
}

const circularityIndexBarChartColorMapping = (value: number): string => {
  if (value > 60) return "#2B663B"
  if (value >= 40) return "#7CBB6D"
  if (value >= 20) return "#F9E196"
  if (value < 20) return "#C64032"
  return "#FF0000"
}

const blueHexCode = "#08519c"
export const circularityMetricBarChartColorMapping = (datum: number, metricType: MetricType) => {
  switch (metricType) {
    case "eolBuiltPoints":
      return eolClassColorsMapper(getEolClassNameByPoints(datum))
    case "dismantlingPoints":
      return blueHexCode
    default:
      return circularityIndexBarChartColorMapping(datum)
  }
}
