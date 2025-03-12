import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

export const getTotalMassAndVolume = (layers: EnrichedElcaElementComponent[]) => {
  return layers
    .filter((layer) => !layer.isExcluded)
    .reduce(
      (acc, layer) => ({
        totalMass: acc.totalMass + (layer.mass || 0),
        totalVolume: acc.totalVolume + (layer.volume || 0),
      }),
      { totalMass: 0, totalVolume: 0 }
    )
}
