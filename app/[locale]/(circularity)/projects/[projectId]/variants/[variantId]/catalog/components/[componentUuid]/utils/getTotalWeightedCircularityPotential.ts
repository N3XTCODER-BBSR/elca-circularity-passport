import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

export const getTotalWeightedCircularityPotential = (layers: EnrichedElcaElementComponent[], totalVolume: number) => {
  return layers.reduce<number | null>((acc, layer) => {
    const circulartyEnrichedLayerData = calculateCircularityDataForLayer(layer)
    const circularityPotential = circulartyEnrichedLayerData.eolBuilt?.points

    if (layer.isExcluded || !layer.volume || !circularityPotential) {
      return acc
    }

    const weightedCircularityPotential = circularityPotential * (layer.volume / totalVolume)

    return weightedCircularityPotential + (acc || 0)
  }, null)
}
