import _ from "lodash"
import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "../utils/calculate-circularity-data-for-layer"

type ProjectCircularityIndexData = {
  projectId: string
  projectName: string
  components: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
}

export const getProjectCircularityIndexData = async (
  projectId: string,
  userId: string
): Promise<ProjectCircularityIndexData[]> => {
  return null
  // const circulartyEnrichedLayerData = calculateCircularityDataForLayer(props.layerData)
}
