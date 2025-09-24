import { CalculateCircularityDataForLayerReturnType } from "../circularity/utils/calculate-circularity-data-for-layer"

const isLayerIncompleteAndNotExcluded = (circulartyEnrichedLayerData: CalculateCircularityDataForLayerReturnType) =>
  !circulartyEnrichedLayerData.isExcluded &&
  (circulartyEnrichedLayerData.volume == null ||
    circulartyEnrichedLayerData.dismantlingPoints == null ||
    circulartyEnrichedLayerData.eolBuilt?.points == null ||
    circulartyEnrichedLayerData.disturbingSubstanceSelections.some((s) => s.disturbingSubstanceClassId == null))

export default isLayerIncompleteAndNotExcluded
