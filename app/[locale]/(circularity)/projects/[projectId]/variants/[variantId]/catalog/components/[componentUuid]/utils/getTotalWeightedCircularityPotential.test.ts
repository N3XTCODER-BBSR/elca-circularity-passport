import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { getTotalWeightedCircularityPotential } from "./getTotalWeightedCircularityPotential"
import { layers } from "./testFixtures"

describe("getTotalWeightedCircularityPotential", () => {
  test("returns weighted average for valid layers", () => {
    const result = getTotalWeightedCircularityPotential(layers)

    expect(result).toBeCloseTo(-10.24, 2)
  })

  test("returns data for layer 1 when layer 2 is excluded from calculation", () => {
    const result = getTotalWeightedCircularityPotential([
      { ...layers[0] } as EnrichedElcaElementComponent,
      { ...layers[1], isExcluded: true } as EnrichedElcaElementComponent,
    ])

    expect(result).toBe(-60)
  })

  test("returns null for empty layers", () => {
    const result = getTotalWeightedCircularityPotential([])

    expect(result).toBeNull()
  })

  test("returns null for layers with no volume", () => {
    const result = getTotalWeightedCircularityPotential([
      { ...layers[0], volume: null } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })

  test("returns null for layers with no circularity potential", () => {
    const result = getTotalWeightedCircularityPotential([
      {
        ...layers[0],
        tBaustoffProductData: { ...layers[0]?.tBaustoffProductData, eolData: {} },
      } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })
})
