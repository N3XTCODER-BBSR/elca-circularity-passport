import { TBs_ProductDefinitionEOLCategoryScenario } from "@prisma/client"

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

// TODO: reconsider the location of this file
// reason: the more proper source of truth for this mapping is most likely the circularity tool (not the GRP)
// then we might want to think though also about versioning of schema and logic for the circularity tool
// Same goes very likely for other logic/schema aspects like RMI, PENRT, etc. which is currently
// 'owned' by the GRP schema/logic

// TODO: imeplemnet here scenario to points (bc. user can only select on scenario level, not on class or points)

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
// ...

// TODO: add also scenario/category here (because also for category, the source of truth is points)
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
  return EolClasses.J
}

export default getEolClassNameByPoints
