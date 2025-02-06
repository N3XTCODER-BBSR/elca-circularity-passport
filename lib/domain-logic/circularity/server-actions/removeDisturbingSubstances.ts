"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export async function removeDisturbingSubstanceSelection(productId: number, disturbingSubstanceSelectionId: number) {
  z.number().parse(productId)
  z.number().parse(disturbingSubstanceSelectionId)

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToElementComponent(userId, productId)

  await dbDalInstance.deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)
}
