"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"
import { serverActionErrorHandler } from "../utils/serverActionHandler"

const getElcaComponentDataByProductId = async (variantId: number, projectId: number, productId: number) => {
  z.number().parse(variantId)
  z.number().parse(productId)
  z.number().parse(projectId)

  return serverActionErrorHandler(async () => {
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)
    await ensureUserAuthorizationToProject(userId, projectId)

    const newElcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
    const isExcluded = await dbDalInstance.getExcludedProductId(newElcaElementComponentData.component_id)
    newElcaElementComponentData.isExcluded = !!isExcluded

    return newElcaElementComponentData
  })
}

export default getElcaComponentDataByProductId
