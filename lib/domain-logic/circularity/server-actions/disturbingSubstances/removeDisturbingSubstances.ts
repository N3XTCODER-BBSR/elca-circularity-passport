"use server"

import { z } from "zod"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { deleteDisturbingSubstanceSelectionById } from "prisma/queries/db"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function removeDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  productId: number,
  disturbingSubstanceSelectionId: number
): Promise<EnrichedElcaElementComponent> {
  z.number().parse(productId)
  z.number().parse(disturbingSubstanceSelectionId)

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToElementComponent(userId, productId)

  await deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)

  const elcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
  return elcaElementComponentData
}
