import { dismantlingPotentialClassIdMapping } from "lib/domain-logic/circularity/utils/circularityMappings"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

export const getTotalWeightedDismantlingPotential = (layers: EnrichedElcaElementComponent[]) => {
  const filteredData = layers
    .filter((layer) => {
      return (
        layer.dismantlingPotentialClassId !== null &&
        layer.dismantlingPotentialClassId !== undefined &&
        layer.volume !== null &&
        !layer.isExcluded
      )
    })
    .map((layer) => {
      return {
        volume: layer.volume!,
        dismantlingPotential: dismantlingPotentialClassIdMapping[layer.dismantlingPotentialClassId!].points,
      }
    })

  const totalVolume = filteredData.reduce((sum, { volume }) => sum + volume, 0)

  return filteredData.reduce<number | null>((acc, { volume, dismantlingPotential }) => {
    const weightedDismantlingPotential = dismantlingPotential * (volume / totalVolume)

    return weightedDismantlingPotential + (acc || 0)
  }, null)
}
