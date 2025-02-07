"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

const getElcaComponentDataByProductId = async (variantId: number, projectId: number, productId: number) => {
  return withServerActionErrorHandling(async () => {
    z.number().parse(variantId)
    z.number().parse(productId)
    z.number().parse(projectId)

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
