import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

const calculateVolumeAndMass = (currentLayerData: EnrichedElcaElementComponent) => {
  const volume = currentLayerData.layer_length * currentLayerData.layer_width * currentLayerData.layer_size
  const mass = currentLayerData.process_config_density * volume
  return { volume, mass }
}

export default calculateVolumeAndMass
