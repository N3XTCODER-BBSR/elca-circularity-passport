import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import calculateEolBuiltData from "./calculateEolBuiltPoints"

describe("calculateEolBuiltData", () => {
  test("returns null when no disturbing classes are provided", () => {
    const result = calculateEolBuiltData(100, [], null)
    expect(result).toBeNull()
  })

  test("returns null when eolPointsUnbuilt is undefined", () => {
    const result = calculateEolBuiltData(undefined, ["S1"], null)
    expect(result).toBeNull()
  })

  test("calculates points correctly for S1-S3 substances", () => {
    const result = calculateEolBuiltData(100, ["S1", "S2", "S3"], null)
    expect(result).toEqual({
      points: 75, // 100 - 5 (S2) - 20 (S3)
      className: "C/D",
    })
  })

  test("returns null when S4 substance is present without specific scenario", () => {
    const result = calculateEolBuiltData(100, ["S1", "S4"], null)
    expect(result).toBeNull()
  })

  test("uses specific scenario points when S4 substance is present with scenario", () => {
    const result = calculateEolBuiltData(100, ["S1", "S4"], TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS)
    expect(result).toEqual({
      points: 100, // CL_PLUS = 100 points
      className: "B",
    })
  })

  test("ignores other substances when S4 is present with scenario", () => {
    const result = calculateEolBuiltData(
      100,
      ["S1", "S2", "S3", "S4"],
      TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS
    )
    expect(result).toEqual({
      points: 100, // Only uses CL_PLUS points, ignores deductions from S1-S3
      className: "B",
    })
  })
})
