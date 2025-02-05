"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { TBs_ProductDefinitionEOLCategoryScenario } from "../../../../prisma/generated/client"

export async function updateSpecificEolScenario(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
  specificEolUnbuiltTotalScenarioProofText: string
) {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)
  await dbDalInstance.upsertUserEnrichedProductDataWithEolScenario(
    layerId,
    specificScenario,
    specificEolUnbuiltTotalScenarioProofText
  )
}
