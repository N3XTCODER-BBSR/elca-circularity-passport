"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export async function updateTBaustoffProduct(layerId: number, selectedId: number) {
  if (!layerId || !selectedId) {
    throw new Error("Invalid layerId or selectedId")
  }

  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)

  await dbDalInstance.upsertUserEnrichedProductDataWithTBaustoffProduct(layerId, selectedId)
  await dbDalInstance.deleteDisturbingSubstanceSelectionsByLayerId(layerId)
}
