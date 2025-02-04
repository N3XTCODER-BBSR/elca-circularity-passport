"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { DismantlingPotentialClassId } from "../../../../prisma/generated/client"

export async function updateDismantlingPotentialClassId(
  layerId: number,
  selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
) {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)
  await dbDalInstance.upsertUserEnrichedProductDataByLayerId(layerId, selectedDismantlingPotentialClassId)
}
