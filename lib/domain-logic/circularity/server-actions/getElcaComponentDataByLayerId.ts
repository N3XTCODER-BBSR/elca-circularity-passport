"use server"

import { serverActionErrorHandler } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

const getElcaComponentDataByLayerId = async (variantId: number, projectId: number, layerId: number) => {
  return serverActionErrorHandler(async () => {
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)
    await ensureUserAuthorizationToProject(userId, projectId)

    const newElcaElementComponentData = await fetchElcaComponentById(layerId, variantId, projectId)
    const isExcluded = await dbDalInstance.getExcludedProductId(newElcaElementComponentData.component_id)
    newElcaElementComponentData.isExcluded = !!isExcluded

    return newElcaElementComponentData
  })
}

export default getElcaComponentDataByLayerId
