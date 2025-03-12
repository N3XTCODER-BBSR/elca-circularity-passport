import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

export const getTotalWeightedCircularityPotential = (layers: EnrichedElcaElementComponent[]) => {
  const filteredData = layers
    .map((layer) => {
      const circularData = calculateCircularityDataForLayer(layer)
      const circularityPotential = circularData.eolBuilt?.points ?? null
      return { layer, circularityPotential }
    })
    .filter(
      ({ layer, circularityPotential }) => !layer.isExcluded && layer.volume !== null && circularityPotential !== null
    )
    .map(({ layer, circularityPotential }) => ({ volume: layer.volume!, circularityPotential: circularityPotential! }))

  if (filteredData.length === 0) {
    return null
  }

  const totalVolume = filteredData.reduce((sum, { volume }) => sum + volume, 0)

  return filteredData.reduce((acc, { volume, circularityPotential }) => {
    return acc + circularityPotential! * (volume / totalVolume)
  }, 0)
}
