import calculateEolBuiltData from "lib/domain-logic/circularity/utils/calculateEolBuiltPoints"
import dismantlingPotentialClassIdMapping from "lib/domain-logic/circularity/utils/dismantlingPotentialClassIdMapping"
import getEolClassNameByPoints, {
  getEolPointsByScenario,
} from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { EnrichedProduct } from "lib/domain-logic/types/domain-types"
import { DisturbingSubstanceClassId } from "prisma/generated/client"

export enum SpecificOrTotal {
  Specific = "Specific",
  Total = "Total",
}

export interface EolUnbuiltData {
  specificOrTotal: SpecificOrTotal
  points: number
  className: string
}

const getEolUnbuiltData = (layerData: EnrichedProduct): EolUnbuiltData | null => {
  if (layerData.eolUnbuiltSpecificScenario) {
    const points = getEolPointsByScenario(layerData.eolUnbuiltSpecificScenario)
    const className = getEolClassNameByPoints(points)
    return {
      specificOrTotal: SpecificOrTotal.Specific,
      points,
      className: className,
    }
  } else if (layerData.tBaustoffProductData?.eolData) {
    const { eolUnbuiltTotalPoints, eolUnbuiltTotalClassName } = layerData.tBaustoffProductData.eolData
    return {
      specificOrTotal: SpecificOrTotal.Total,
      points: eolUnbuiltTotalPoints,
      className: eolUnbuiltTotalClassName,
    }
  } else {
    return null
  }
}

export type CalculateCircularityDataForLayerReturnType = EnrichedProduct & {
  circularityIndex: number | null | undefined
  dismantlingPoints: number | null | undefined
  disturbingSubstances: {
    noDisturbingSubstancesOrOnlyNullClassesSelected: boolean
    hasS4DisturbingSubstance: boolean
  }
  eolUnbuilt: EolUnbuiltData | null
  eolBuilt: {
    points: number
    className: string
  } | null
}
const calculateCircularityDataForLayer = (layerData: EnrichedProduct): CalculateCircularityDataForLayerReturnType => {
  const dismantlingPoints =
    layerData.dismantlingPotentialClassId &&
    dismantlingPotentialClassIdMapping[layerData.dismantlingPotentialClassId].points

  const noDisturbingSubstancesOrOnlyNullClassesSelected =
    layerData.disturbingSubstanceSelections.length === 0 ||
    layerData.disturbingSubstanceSelections.every((selection) => selection.disturbingSubstanceClassId == null)

  const hasS4DisturbingSubstance = layerData.disturbingSubstanceSelections.some(
    (selection) => selection.disturbingSubstanceClassId === DisturbingSubstanceClassId.S4
  )

  const nonNullDisturbingSubstanceClassId = layerData.disturbingSubstanceSelections
    .map((s) => s.disturbingSubstanceClassId)
    .filter((s) => s != null) as DisturbingSubstanceClassId[]

  const eolUnbuilt = getEolUnbuiltData(layerData)

  const eolBuilt = calculateEolBuiltData(
    eolUnbuilt?.points,
    nonNullDisturbingSubstanceClassId,
    layerData.disturbingEolScenarioForS4
  )

  const circularityIndex =
    eolBuilt == null || dismantlingPoints == null ? null : dismantlingPoints * 0.3 + eolBuilt.points * 0.7

  return {
    ...layerData,
    circularityIndex,
    dismantlingPoints,
    disturbingSubstances: {
      noDisturbingSubstancesOrOnlyNullClassesSelected,
      hasS4DisturbingSubstance,
    },
    eolUnbuilt: eolUnbuilt,
    eolBuilt: eolBuilt,
  }
}

export default calculateCircularityDataForLayer
