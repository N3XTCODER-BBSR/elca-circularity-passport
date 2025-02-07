"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export async function removeDisturbingSubstanceSelection(productId: number, disturbingSubstanceSelectionId: number) {
  return withServerActionErrorHandling(async () => {
    z.number().parse(productId)
    z.number().parse(disturbingSubstanceSelectionId)

    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)
  })
}
