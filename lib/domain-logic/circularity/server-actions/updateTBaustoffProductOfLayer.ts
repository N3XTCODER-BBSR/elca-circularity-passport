"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import {
  deleteDisturbingSubstanceSelectionsByLayerId,
  upsertUserEnrichedProductDataWithTBaustoffProduct,
} from "prisma/queries/db"

export async function updateTBaustoffProduct(layerId: number, selectedId: number) {
  console.log("selectedId :>> ", selectedId)
  if (!layerId || !selectedId) {
    throw new Error("Invalid layerId or selectedId")
  }

  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)

  await upsertUserEnrichedProductDataWithTBaustoffProduct(layerId, selectedId)
  await deleteDisturbingSubstanceSelectionsByLayerId(layerId)
}
