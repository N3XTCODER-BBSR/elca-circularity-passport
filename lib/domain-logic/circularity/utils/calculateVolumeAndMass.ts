import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

const calculateVolumeAndMass = (currentLayerData: EnrichedElcaElementComponent) => {
  const volume = currentLayerData.layer_length * currentLayerData.layer_width * currentLayerData.layer_size
  // TODO: URGENT/IMPORTANT: remove the falling-back to 1 for density here as soon as we
  // clarified the handling of missing density values in the backend
  const mass = (currentLayerData.process_config_density || 1) * volume
  return { volume, mass }
}

export default calculateVolumeAndMass
