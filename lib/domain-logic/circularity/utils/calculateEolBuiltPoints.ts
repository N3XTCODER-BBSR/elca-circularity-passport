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
import { getEolClassNameByPoints, getEolPointsByScenario } from "lib/domain-logic/circularity/utils/circularityMappings"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"

type DisturbingSubstanceClassIdWithoutS4 = "S0" | "S1" | "S2" | "S3"
type DisturbingSubstanceClassId = DisturbingSubstanceClassIdWithoutS4 | "S4"

function calculateEolBuiltPoints(
  eolPointsUnbuilt: number | undefined,
  disturbingClasses: DisturbingSubstanceClassId[],
  s4SpecificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
): number | null {
  if (eolPointsUnbuilt == null) {
    return null
  }

  if (disturbingClasses.length === 0) {
    return null
  }

  // Check if any disturbing substance is classified as 'S4'
  if (disturbingClasses.includes("S4")) {
    if (s4SpecificScenario != null) {
      // Calculate the eolBuiltPoints based on the specific S4 scenario
      return getEolPointsByScenario(s4SpecificScenario)
    }
    // No calculation possible; EOL scenario must be set manually
    return null
  }

  const disturbingClassesWithoudS4 = disturbingClasses as DisturbingSubstanceClassIdWithoutS4[]

  const eolBuiltMinusPointsTable = [
    {
      from: 120,
      to: 105,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: 0,
        S3: 0,
      },
    },
    {
      from: 105,
      to: 95,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -5,
        S3: -20,
      },
    },
    {
      from: 95,
      to: 85,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -5,
        S3: -20,
      },
    },
    {
      from: 85,
      to: 75,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -5,
        S3: -20,
      },
    },
    {
      from: 75,
      to: 65,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -5,
        S3: -20,
      },
    },
    {
      from: 65,
      to: 50,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -10,
        S3: -20,
      },
    },
    {
      from: 50,
      to: 30,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -10,
        S3: -20,
      },
    },
    {
      from: 30,
      to: 10,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -10,
        S3: -20,
      },
    },
    {
      from: 10,
      to: -10,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: -10,
        S3: -20,
      },
    },
    {
      from: -10,
      to: -30,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: 0,
        S3: -20,
      },
    },
    {
      from: -30,
      to: -50,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: 0,
        S3: -10,
      },
    },
    {
      from: -50,
      to: -60,
      minusPoints: {
        S0: 0,
        S1: 0,
        S2: 0,
        S3: 0,
      },
    },
  ]

  // Find the applicable minus points based on the eolPointsUnbuilt
  const getMinusPoints = (eolPointsUnbuilt: number, disturbingClass: DisturbingSubstanceClassIdWithoutS4): number => {
    const entry = eolBuiltMinusPointsTable.find(
      (entry) => eolPointsUnbuilt <= entry.from && eolPointsUnbuilt > entry.to
    )
    return entry && entry.minusPoints[disturbingClass] !== undefined ? entry.minusPoints[disturbingClass] : 0
  }

  // Calculate the total minus points for all disturbing substances using reduce
  const totalMinusPoints = disturbingClassesWithoudS4.reduce((sum, disturbingClass) => {
    const minusPoints = getMinusPoints(eolPointsUnbuilt, disturbingClass)
    return sum + minusPoints
  }, 0)

  // Calculate the final eolBuiltPoints
  const eolBuiltPoints = eolPointsUnbuilt + totalMinusPoints
  return eolBuiltPoints
}

function calculateEolBuiltData(
  eolPointsUnbuilt: number | undefined,
  disturbingClasses: DisturbingSubstanceClassId[],
  s4SpecificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
): { points: number; className: string } | null {
  const points = calculateEolBuiltPoints(eolPointsUnbuilt, disturbingClasses, s4SpecificScenario)
  if (points == null) {
    return null
  }
  const className = getEolClassNameByPoints(points)
  return { points, className }
}

export default calculateEolBuiltData
