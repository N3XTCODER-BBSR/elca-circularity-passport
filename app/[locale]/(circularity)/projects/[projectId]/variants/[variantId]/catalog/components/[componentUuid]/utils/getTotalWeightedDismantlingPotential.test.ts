import { dismantlingPotentialClassIdMapping } from "lib/domain-logic/circularity/utils/circularityMappings"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { DismantlingPotentialClassId } from "prisma/generated/client"
import { getTotalWeightedDismantlingPotential } from "./getTotalWeightedDismantlingPotential"
import { layers } from "./testFixtures"

describe("getTotalWeightedDismantlingPotential", () => {
  test("returns weighted average for valid layers", () => {
    const result = getTotalWeightedDismantlingPotential(layers)

    expect(result).toBe(100)
  })

  test("returns data for layer 1 when layer 2 is excluded from calculation", () => {
    const dismantlingPotentialClassIdLayer1 = DismantlingPotentialClassId.II

    const result = getTotalWeightedDismantlingPotential([
      { ...layers[0], dismantlingPotentialClassId: dismantlingPotentialClassIdLayer1 } as EnrichedElcaElementComponent,
      { ...layers[1], isExcluded: true } as EnrichedElcaElementComponent,
    ])

    expect(result).toBe(dismantlingPotentialClassIdMapping[dismantlingPotentialClassIdLayer1].points)
  })

  test("returns null for empty layers", () => {
    const result = getTotalWeightedDismantlingPotential([])

    expect(result).toBeNull()
  })

  test("returns null for layers with no volume", () => {
    const result = getTotalWeightedDismantlingPotential([
      { ...layers[0], volume: null } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })

  test("returns null for layers when dismantlingPotentialClassId is null", () => {
    const result = getTotalWeightedDismantlingPotential([
      {
        ...layers[0],
        dismantlingPotentialClassId: null,
      } as EnrichedElcaElementComponent,
    ])

    expect(result).toBeNull()
  })
})
