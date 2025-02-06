"use server"

import { z } from "zod"
import { serverActionErrorHandler } from "app/(utils)/errorHandler"
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { DisturbingSubstanceClassId, Prisma } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function addOrUpdateDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  productId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
) {
  z.number().parse(variantId)
  z.number().parse(productId)
  z.object({}).passthrough().parse(disturbingSubstanceSelectionWithNullableId)
  z.number().parse(projectId)

  return serverActionErrorHandler(async () => {
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.upsertUserEnrichedProductData(productId)

    if (disturbingSubstanceSelectionWithNullableId.id != null) {
      const { disturbingSubstanceClassId, disturbingSubstanceName } = disturbingSubstanceSelectionWithNullableId

      const updateData: Prisma.DisturbingSubstanceSelectionUpdateInput = {
        disturbingSubstanceClassId,
        disturbingSubstanceName,
      }

      if (disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        updateData.disturbingSubstanceName = null
      }

      await dbDalInstance.updateDisturbingSubstanceSelection(disturbingSubstanceSelectionWithNullableId.id, updateData)
    } else {
      const createData: Prisma.DisturbingSubstanceSelectionCreateInput = {
        disturbingSubstanceClassId: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId || null,
        disturbingSubstanceName: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceName || null,
        userEnrichedProductData: {
          connect: {
            elcaElementComponentId: productId,
          },
        },
      }

      if (disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        createData.disturbingSubstanceName = null
      }

      await dbDalInstance.createDisturbingSubstanceSelection(createData)
    }

    // If there are no S4 disturbing substances, remove the disturbingEolScenarioForS4
    const disturbingSubstances = await dbDalInstance.findDisturbingSubstancesByLayerIdAndClassId(
      productId,
      DisturbingSubstanceClassId.S4
    )
    if (disturbingSubstances.length === 0) {
      await dbDalInstance.updateUserEnrichedProductDataDisturbingEolScenario(productId)
    }

    const elcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
    return elcaElementComponentData
  })
}
