import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

export const getTotalMassAndVolume = (layers: EnrichedElcaElementComponent[]) => {
  return layers
    .filter((layer) => !layer.isExcluded)
    .reduce<{ totalMass: number | null; totalVolume: number | null }>(
      (acc, layer) => ({
        totalMass: acc.totalMass ?? 0 + (layer.mass || 0),
        totalVolume: acc.totalVolume ?? 0 + (layer.volume || 0),
      }),
      { totalMass: null, totalVolume: null }
    )
}
