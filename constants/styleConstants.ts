import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
  MaterialResourceTypeNames,
} from "domain-logic/grp/data-schema/versions/v1/passportSchema"

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
