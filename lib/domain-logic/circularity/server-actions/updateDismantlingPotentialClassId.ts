"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { DismantlingPotentialClassId } from "../../../../prisma/generated/client"

export async function updateDismantlingPotentialClassId(
  productId: number,
  selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
) {
  z.number().parse(productId)

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToElementComponent(userId, productId)
  await dbDalInstance.upsertUserEnrichedProductDataByLayerId(productId, selectedDismantlingPotentialClassId)
}
