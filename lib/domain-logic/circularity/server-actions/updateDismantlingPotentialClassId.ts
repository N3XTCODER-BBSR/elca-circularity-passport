"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { upsertUserEnrichedProductDataByLayerId } from "prisma/queries/db"
import { DismantlingPotentialClassId } from "../../../../prisma/generated/client"

export async function updateDismantlingPotentialClassId(
  layerId: number,
  selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
) {
  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)
  await upsertUserEnrichedProductDataByLayerId(layerId, selectedDismantlingPotentialClassId)
}
