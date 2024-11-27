import _ from "lodash"
import {
  ElcaElementWithComponents,
  ElcaProjectComponentRow,
  EnrichedElcaElementComponent,
  TBaustoffProductData,
  UserEnrichedProductDataWithDisturbingSubstanceSelection,
} from "lib/domain-logic/types/domain-types"
import { query } from "lib/elca-legacy-db"
import { prisma } from "prisma/prismaClient"
import { Prisma, TBs_OekobaudatMapping, UserEnrichedProductData } from "../../../../prisma/generated/client"
import { calculateEolDataByEolCateogryData } from "../utils/calculateEolDataByEolCateogryData"
import { CalculateCircularityDataForLayerReturnType } from "../utils/calculate-circularity-data-for-layer"

type ProjectCircularityIndexData = {
  projectId: string
  projectName: string
  totalCircularityIndex: number
  components: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
}

export const getProjectCircularityIndexData = async (
  projectId: string,
  userId: string
): Promise<ProjectCircularityIndexData[]> => {
  return null
  // const circulartyEnrichedLayerData = calculateCircularityDataForLayer(props.layerData)
}
