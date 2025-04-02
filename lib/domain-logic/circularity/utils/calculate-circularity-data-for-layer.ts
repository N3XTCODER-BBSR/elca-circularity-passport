/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import calculateEolBuiltData from "lib/domain-logic/circularity/utils/calculateEolBuiltPoints"
import {
  dismantlingPotentialClassIdMapping,
  getEolClassNameByPoints,
  getEolPointsByScenario,
} from "lib/domain-logic/circularity/utils/circularityMappings"
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

const getEolUnbuiltData = (layerData: EnrichedElcaElementComponent): EolUnbuiltData | null => {
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

export type CalculateCircularityDataForLayerReturnType = EnrichedElcaElementComponent & {
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

const calculateCircularityDataForLayer = (
  layerData: EnrichedElcaElementComponent
): CalculateCircularityDataForLayerReturnType => {
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

  const incompleteCircularityRequiredData =
    eolBuilt == null || dismantlingPoints == null || layerData.volume === null || layerData.mass === null

  const circularityIndex = incompleteCircularityRequiredData ? null : dismantlingPoints * 0.3 + eolBuilt.points * 0.7

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
