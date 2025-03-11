import { dismantlingPotentialClassIdMapping } from "lib/domain-logic/circularity/utils/circularityMappings"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

export const getTotalWeightedDismantlingPotential = (layers: EnrichedElcaElementComponent[], totalVolume: number) => {
  return layers.reduce<number | null>((acc, layer) => {
    if (
      layer.dismantlingPotentialClassId === null ||
      layer.dismantlingPotentialClassId === undefined ||
      !layer.volume ||
      layer.isExcluded
    ) {
      return acc
    }

    const dismantlingPotential = dismantlingPotentialClassIdMapping[layer.dismantlingPotentialClassId].points

    const weightedDismantlingPotential = dismantlingPotential * (layer.volume / totalVolume)

    return weightedDismantlingPotential + (acc || 0)
  }, null)
}
