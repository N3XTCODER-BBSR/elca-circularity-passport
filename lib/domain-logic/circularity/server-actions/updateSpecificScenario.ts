"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { upsertUserEnrichedProductDataWithEolScenario } from "prisma/queries/db"
import { TBs_ProductDefinitionEOLCategoryScenario } from "../../../../prisma/generated/client"

export async function updateSpecificEolScenario(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
  specificEolUnbuiltTotalScenarioProofText: string
) {
  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)
  await upsertUserEnrichedProductDataWithEolScenario(
    layerId,
    specificScenario,
    specificEolUnbuiltTotalScenarioProofText
  )
}
