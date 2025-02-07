"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export async function updateDisturbingEolScenarioForS4(
  productId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
) {
  return withServerActionErrorHandling(async () => {
    z.number().parse(productId)

    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.upsertDisturbingEolScenarioForS4(productId, specificScenario)
  })
}
