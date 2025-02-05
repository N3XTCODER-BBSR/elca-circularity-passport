"use server"

import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function removeDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  layerId: number,
  disturbingSubstanceSelectionId: number
): Promise<EnrichedElcaElementComponent> {
  if (!layerId || !disturbingSubstanceSelectionId) {
    throw new Error("Invalid layerId or disturbingSubstanceSelectionId")
  }

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToProject(userId, projectId)

  await dbDalInstance.deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)

  const elcaElementComponentData = await fetchElcaComponentById(layerId, variantId, projectId)
  return elcaElementComponentData
}
