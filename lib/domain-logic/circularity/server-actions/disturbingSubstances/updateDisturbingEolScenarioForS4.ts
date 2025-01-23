"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { upsertDisturbingEolScenarioForS4 } from "prisma/queries/db"

export async function updateDisturbingEolScenarioForS4(
  productId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
) {
  z.number().parse(productId)

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)
  await ensureUserAuthorizationToElementComponent(userId, productId)

  await upsertDisturbingEolScenarioForS4(productId, specificScenario)
}
