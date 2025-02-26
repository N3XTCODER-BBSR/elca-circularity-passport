import { ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"

// TODO before merge: get share field from component
// write test for calculateVolumeForLayer function
const calculateVolumeForLayer = (layerLength: number, layerWidth: number, layerSize: number) => {
  return layerLength * layerWidth * layerSize
}

export const calculateVolumeForProduct = (component: ElcaProjectComponentRow) => {
  if (component.layer_length !== null && component.layer_width !== null && component.layer_size !== null) {
    return calculateVolumeForLayer(component.layer_length, component.layer_width, component.layer_size)
  }

  return null
}
