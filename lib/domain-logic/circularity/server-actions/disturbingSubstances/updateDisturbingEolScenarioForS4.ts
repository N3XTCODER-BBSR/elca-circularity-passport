"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { upsertDisturbingEolScenarioForS4 } from "prisma/queries/db"

export async function updateDisturbingEolScenarioForS4(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
) {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  await ensureUserIsAuthenticated()

  await upsertDisturbingEolScenarioForS4(layerId, specificScenario)
}
