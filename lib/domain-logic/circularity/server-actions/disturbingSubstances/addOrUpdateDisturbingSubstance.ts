"use server"

import { z } from "zod"
import {
  DisturbingSubstanceSelectionWithNullabelId,
  EnrichedElcaElementComponent,
} from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { DisturbingSubstanceClassId, Prisma } from "prisma/generated/client"
import {
  createDisturbingSubstanceSelection,
  findDisturbingSubstancesByLayerIdAndClassId,
  updateDisturbingSubstanceSelection,
  updateUserEnrichedProductDataDisturbingEolScenario,
  upsertUserEnrichedProductData,
} from "prisma/queries/db"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function addOrUpdateDisturbingSubstanceSelection(
  variantId: number,
  projectId: number,
  productId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
): Promise<EnrichedElcaElementComponent> {
  z.number().parse(variantId)
  z.number().parse(productId)
  z.object({}).passthrough().parse(disturbingSubstanceSelectionWithNullableId)
  z.number().parse(projectId)

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToElementComponent(userId, productId)

  await upsertUserEnrichedProductData(productId)

  try {
    if (disturbingSubstanceSelectionWithNullableId.id != null) {
      const { disturbingSubstanceClassId, disturbingSubstanceName } = disturbingSubstanceSelectionWithNullableId

      const updateData: Prisma.DisturbingSubstanceSelectionUpdateInput = {
        disturbingSubstanceClassId,
        disturbingSubstanceName,
      }

      if (disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        updateData.disturbingSubstanceName = null
      }

      await updateDisturbingSubstanceSelection(disturbingSubstanceSelectionWithNullableId.id, updateData)
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

      await createDisturbingSubstanceSelection(createData)
    }
  } catch (error: any) {
    throw error
  }

  // If there are no S4 disturbing substances, remove the disturbingEolScenarioForS4
  const disturbingSubstances = await findDisturbingSubstancesByLayerIdAndClassId(
    productId,
    DisturbingSubstanceClassId.S4
  )
  if (disturbingSubstances.length === 0) {
    await updateUserEnrichedProductDataDisturbingEolScenario(productId)
  }

  const elcaElementComponentData = await fetchElcaComponentById(productId, variantId, projectId)
  return elcaElementComponentData
}
