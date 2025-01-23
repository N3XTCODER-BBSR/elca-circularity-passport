"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { upsertUserEnrichedProductDataWithEolScenario } from "prisma/queries/db"
import { TBs_ProductDefinitionEOLCategoryScenario } from "../../../../prisma/generated/client"

export async function updateSpecificEolScenario(
  productId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
  specificEolUnbuiltTotalScenarioProofText: string
) {
  z.number().parse(productId)
  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), productId)
  await upsertUserEnrichedProductDataWithEolScenario(
    productId,
    specificScenario,
    specificEolUnbuiltTotalScenarioProofText
  )
}
