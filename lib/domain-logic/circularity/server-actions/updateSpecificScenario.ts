"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { TBs_ProductDefinitionEOLCategoryScenario } from "../../../../prisma/generated/client"

export async function updateSpecificEolScenario(
  productId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
  specificEolUnbuiltTotalScenarioProofText: string
) {
  return withServerActionErrorHandling(async () => {
    z.number().parse(productId)
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.upsertUserEnrichedProductDataWithEolScenario(
      productId,
      specificScenario,
      specificEolUnbuiltTotalScenarioProofText
    )
  })
}
