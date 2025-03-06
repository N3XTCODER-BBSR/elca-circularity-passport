const calculateVolumeForLayer = (layerLength: number, layerWidth: number, layerSize: number, share: number) => {
  return layerLength * layerWidth * layerSize * share
}

export const calculateVolumeForProduct = (
  layerLength: number | null,
  layerWidth: number | null,
  layerSize: number | null,
  share: number | null
) => {
  if (layerLength === null || layerWidth === null || layerSize === null) {
    return null
  }

  if (share === null) {
    share = 1
  }

  return calculateVolumeForLayer(layerLength, layerWidth, layerSize, share)
}
