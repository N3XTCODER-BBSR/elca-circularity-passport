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
import { getEolClassNameByPoints } from "lib/domain-logic/circularity/utils/circularityMappings"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

export type CircularityDataItem = {
  aggregatedMass: number
  weightedAvgEolPoints: number
  eolClass: string
  din276CategoryName: string
  dinCategoryLevelNumber: number
}

type AggregationMapValue = {
  din276CategoryName: string
  dinCategoryLevelNumber: number
  totalWeightedEolPoints: number
  totalMass: number
}

const aggregateCircularityData = (buildingComponents: DinEnrichedBuildingComponent[]) => {
  const allLayers = buildingComponents.flatMap((component) =>
    component.materials.map((layer) => ({
      layer,
      dinCategoryLevelNumber: component.dinCategoryLevelNumber,
      din276CategoryName: component.din276CategoryName,
    }))
  )

  const validLayers = allLayers.filter(
    ({ layer }) =>
      layer.massInKg != null && layer.massInKg !== 0 && layer.circularity != null && layer.circularity.eolPoints != null
  )

  const layerData = validLayers.map(({ layer, dinCategoryLevelNumber, din276CategoryName }) => {
    const mass = layer.massInKg!
    const eolPoints = layer.circularity!.eolPoints!
    const weightedEolPoints = eolPoints * mass

    return {
      dinCategoryLevelNumber,
      din276CategoryName,
      mass,
      weightedEolPoints,
    }
  })

  const totalMass = layerData.reduce((sum, { mass }) => sum + mass, 0)
  const totalWeightedEolPoints = layerData.reduce((sum, { weightedEolPoints }) => sum + weightedEolPoints, 0)

  const aggregationMapByDinCatLevelNumber = layerData.reduce((map, data) => {
    const { dinCategoryLevelNumber, din276CategoryName, mass, weightedEolPoints } = data

    if (!map.has(dinCategoryLevelNumber)) {
      map.set(dinCategoryLevelNumber, {
        din276CategoryName,
        dinCategoryLevelNumber,
        totalWeightedEolPoints: 0,
        totalMass: 0,
      })
    }

    const aggregationEntry = map.get(dinCategoryLevelNumber)!
    aggregationEntry.totalWeightedEolPoints += weightedEolPoints
    aggregationEntry.totalMass += mass

    return map
  }, new Map<number, AggregationMapValue>())

  const avgEolPointsPerComponentCostCategory = Array.from(aggregationMapByDinCatLevelNumber.values()).map((value) => {
    const { din276CategoryName, dinCategoryLevelNumber, totalWeightedEolPoints, totalMass } = value
    const weightedAvgEolPoints = totalWeightedEolPoints / totalMass
    const eolClass = getEolClassNameByPoints(weightedAvgEolPoints)

    return {
      din276CategoryName,
      dinCategoryLevelNumber,
      aggregatedMass: totalMass,
      weightedAvgEolPoints,
      eolClass,
    }
  })

  const totalAvgEolPoints = totalWeightedEolPoints / totalMass
  const totalEolClass = getEolClassNameByPoints(totalAvgEolPoints)

  return {
    totalAvgEolPoints,
    totalEolClass,
    avgEolPointsPerComponentCostCategory,
  }
}

export default aggregateCircularityData
