"use server"

import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getExcludedProductId } from "prisma/queries/db"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

const getElcaComponentDataByLayerId = async (
  variantId: number,
  projectId: number,
  layerId: number
): Promise<EnrichedElcaElementComponent> => {
  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)
  await ensureUserAuthorizationToProject(userId, projectId)

  const newElcaElementComponentData = await fetchElcaComponentById(layerId, variantId, projectId)
  const isExcluded = await getExcludedProductId(newElcaElementComponentData.component_id)
  newElcaElementComponentData.isExcluded = !!isExcluded

  return newElcaElementComponentData
}

export default getElcaComponentDataByLayerId
