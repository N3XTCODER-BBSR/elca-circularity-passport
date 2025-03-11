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
import { DismantlingPotentialClassId } from "prisma/generated/client"
import { TBs_ProductDefinitionEOLCategoryScenario } from "../../../../prisma/generated/client"

export enum EolClasses {
  NA = "N/A",
  A = "A",
  B = "B",
  C = "C",
  CD = "C/D",
  D = "D",
  DE = "D/E",
  E = "E",
  EF = "E/F",
  F = "F",
  FG = "F/G",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
}

export const EOLScenarioMap = {
  CL_PLUS: "CL+",
  CL_MINUS: "CL-",
  RC_PLUS: "RC+",
  RC_MINUS: "RC-",
  EV_PLUS: "EV+",
  EV_MINUS: "EV-",
  DEP_PLUS: "Dep+",
  DEP_MINUS: "Dep-",
  WV: "WV",
  SV: "SV",
  EB: "EB",
}

export function getEolPointsByScenario(scenario: TBs_ProductDefinitionEOLCategoryScenario): number {
  switch (scenario) {
    case TBs_ProductDefinitionEOLCategoryScenario.WV:
      return 140
    case TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS:
      return 100
    case TBs_ProductDefinitionEOLCategoryScenario.CL_MINUS:
      return 80
    case TBs_ProductDefinitionEOLCategoryScenario.RC_PLUS:
      return 80
    case TBs_ProductDefinitionEOLCategoryScenario.RC_MINUS:
      return 60
    case TBs_ProductDefinitionEOLCategoryScenario.SV:
      return 20
    case TBs_ProductDefinitionEOLCategoryScenario.EV_PLUS:
      return 20
    case TBs_ProductDefinitionEOLCategoryScenario.EV_MINUS:
      return -20
    case TBs_ProductDefinitionEOLCategoryScenario.EB:
      return -60
    case TBs_ProductDefinitionEOLCategoryScenario.DEP_PLUS:
      return -20
    case TBs_ProductDefinitionEOLCategoryScenario.DEP_MINUS:
      return -60
    default:
      return 0
  }
}

// TODO (M): add also scenario/category here (because also for category, the source of truth is points)
export function getEolClassNameByPoints(points?: number): EolClasses {
  if (points == null || Number.isNaN(points)) return EolClasses.NA
  if (points >= 140) return EolClasses.A
  if (points >= 100) return EolClasses.B
  if (points >= 80) return EolClasses.C
  if (points >= 70) return EolClasses.CD
  if (points >= 60) return EolClasses.D
  if (points >= 40) return EolClasses.DE
  if (points >= 20) return EolClasses.E
  if (points >= 0) return EolClasses.EF
  if (points >= -20) return EolClasses.F
  if (points >= -40) return EolClasses.FG
  if (points >= -60) return EolClasses.G
  if (points >= -80) return EolClasses.H
  if (points >= -100) return EolClasses.I
  if (points >= -140) return EolClasses.J
  // TODO (L): probably better to throw an exception instead of just return J-class as fallback
  return EolClasses.J
}

export const eolClassMapping = {
  [EolClasses.A]: {
    badgeBgHexColorCode: "2B663B",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.B]: {
    badgeBgHexColorCode: "479657",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.C]: {
    badgeBgHexColorCode: "B1D878",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.CD]: {
    badgeBgHexColorCode: "DDEE97",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.D]: {
    badgeBgHexColorCode: "FFFFC6",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.DE]: {
    badgeBgHexColorCode: "F9E196",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.E]: {
    badgeBgHexColorCode: "F2B26E",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.EF]: {
    badgeBgHexColorCode: "E3754F",
    badgeTextHexColorCode: "001C06",
  },
  [EolClasses.F]: {
    badgeBgHexColorCode: "C64032",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.FG]: {
    badgeBgHexColorCode: "A43A45",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.G]: {
    badgeBgHexColorCode: "7E0C19",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.H]: {
    badgeBgHexColorCode: "7E0C19",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.I]: {
    badgeBgHexColorCode: "7E0C19",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.J]: {
    badgeBgHexColorCode: "7E0C19",
    badgeTextHexColorCode: "ffffff",
  },
  [EolClasses.NA]: {
    badgeBgHexColorCode: "7E0C19",
    badgeTextHexColorCode: "ffffff",
  },
}

export const dismantlingPotentialClassIdMapping = {
  [DismantlingPotentialClassId.I]: {
    translationKey: 1,
    points: 100,
    badgeBgHexColorCode: "586632",
    badgeTextHexColorCode: "FFFFFF",
  },
  [DismantlingPotentialClassId.II]: {
    translationKey: 2,
    points: 75,
    badgeBgHexColorCode: "899D59",
    badgeTextHexColorCode: "001C06",
  },
  [DismantlingPotentialClassId.III]: {
    translationKey: 3,
    points: 50,
    badgeBgHexColorCode: "C6D5A1",
    badgeTextHexColorCode: "001C06",
  },
  [DismantlingPotentialClassId.IV]: {
    translationKey: 4,
    points: 0,
    badgeBgHexColorCode: "F5C242",
    badgeTextHexColorCode: "001C06",
  },
}
