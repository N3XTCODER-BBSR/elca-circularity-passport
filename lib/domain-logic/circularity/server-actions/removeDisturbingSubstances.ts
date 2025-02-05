"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export async function removeDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  layerId: number,
  disturbingSubstanceSelectionId: number
) {
  if (!layerId || !disturbingSubstanceSelectionId) {
    throw new Error("Invalid layerId or disturbingSubstanceSelectionId")
  }

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToProject(userId, projectId)

  await dbDalInstance.deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)
}
