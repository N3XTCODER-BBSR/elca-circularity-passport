import { ResourceTypeNames } from "domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"

export const PALETTE_LIFECYCLE_PHASES = ["#FFAC81", "#E1E4A0", "#D1D770", "#B8BF36", "#C9E5D6", "#ACD7C0"]

export const rmiColorsMapper = (resourceTypeName: ResourceTypeNames) => {
  const colorsMapping = {
    rmiForestry: "#7DC0A6",
    rmiAqua: "#8ECAC4",
    rmiAgrar: "#B3DBB8",
    rmiMineral: "#E1E7EF",
    rmiMetallic: "#CBD5E1",
    rmiFossil: "#94A3B8",
  }

  return colorsMapping[resourceTypeName]
}
