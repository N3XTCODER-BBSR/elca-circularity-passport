const calculateVolumeForLayer = (layerLength: number, layerWidth: number, layerSize: number) => {
  return layerLength * layerWidth * layerSize
}

export const calculateVolumeForProduct = (
  layerLength: number | null,
  layerWidth: number | null,
  layerSize: number | null
) => {
  if (layerLength === null || layerWidth === null || layerSize === null) {
    return null
  }

  return calculateVolumeForLayer(layerLength, layerWidth, layerSize)
}
