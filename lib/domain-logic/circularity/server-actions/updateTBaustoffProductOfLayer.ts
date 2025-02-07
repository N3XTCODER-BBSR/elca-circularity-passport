"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export const updateTBaustoffProduct = async (productId: number, selectedId: number) => {
  return withServerActionErrorHandling(async () => {
    z.number().parse(productId)
    z.number().parse(selectedId)

    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.upsertUserEnrichedProductDataWithTBaustoffProduct(productId, selectedId)
    await dbDalInstance.deleteDisturbingSubstanceSelectionsByLayerId(productId)
  })
}
