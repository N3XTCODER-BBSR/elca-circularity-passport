"use server"

import { z } from "zod"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getExcludedProductId } from "prisma/queries/db"
import { fetchElcaComponentById } from "./utils/getElcaComponentDataByLayerIdAndUserId"

const getElcaComponentDataByProductId = async (
  variantId: number,
  projectId: number,
  productId: number
): Promise<EnrichedElcaElementComponent> => {
  z.number().parse(variantId)
  z.number().parse(productId)
  z.number().parse(projectId)

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)
  await ensureUserAuthorizationToProject(userId, projectId)

  const newElcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
  const isExcluded = await getExcludedProductId(newElcaElementComponentData.component_id)
  newElcaElementComponentData.isExcluded = !!isExcluded

  return newElcaElementComponentData
}

export default getElcaComponentDataByProductId
