import { calculateBnbDismantlingPoints, calculateBnbCircularityPoints } from "./calculateBnbPoints"

describe("calculateBnbDismantlingPoints", () => {
  it("returns 30 for RGeb >= 50", () => {
    expect(calculateBnbDismantlingPoints(50)).toBe(30)
    expect(calculateBnbDismantlingPoints(60)).toBe(30)
  })
  it("returns 0 for RGeb <= 20", () => {
    expect(calculateBnbDismantlingPoints(20)).toBe(0)
    expect(calculateBnbDismantlingPoints(10)).toBe(0)
  })
  it("interpolates and rounds for 20 < RGeb < 50", () => {
    expect(calculateBnbDismantlingPoints(35)).toBe(15)
    expect(calculateBnbDismantlingPoints(34)).toBe(14)
    expect(calculateBnbDismantlingPoints(21)).toBe(1)
    expect(calculateBnbDismantlingPoints(49)).toBe(29)
  })
})

describe("calculateBnbCircularityPoints", () => {
  it("returns 60 for ZGeb >= 60", () => {
    expect(calculateBnbCircularityPoints(60)).toBe(60)
    expect(calculateBnbCircularityPoints(70)).toBe(60)
  })
  it("returns 0 for ZGeb <= 20", () => {
    expect(calculateBnbCircularityPoints(20)).toBe(0)
    expect(calculateBnbCircularityPoints(10)).toBe(0)
  })
  it("interpolates and rounds for 20 < ZGeb < 60", () => {
    expect(calculateBnbCircularityPoints(40)).toBe(30)
    expect(calculateBnbCircularityPoints(21)).toBe(2)
    expect(calculateBnbCircularityPoints(59)).toBe(59)
  })
})
