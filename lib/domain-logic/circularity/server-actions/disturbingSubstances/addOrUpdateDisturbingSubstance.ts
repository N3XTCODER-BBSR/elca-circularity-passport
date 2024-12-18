"use server"

import {
  DisturbingSubstanceSelectionWithNullabelId,
  EnrichedElcaElementComponent,
} from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
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
  layerId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
): Promise<EnrichedElcaElementComponent> {
  if (!layerId || !disturbingSubstanceSelectionWithNullableId) {
    throw new Error("Invalid layerId or disturbingSubstanceId")
  }

  const session = await ensureUserIsAuthenticated()
  const userId = Number(session.user.id)

  await ensureUserAuthorizationToProject(userId, projectId)

  await upsertUserEnrichedProductData(layerId)

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
            elcaElementComponentId: layerId,
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
  const disturbingSubstances = await findDisturbingSubstancesByLayerIdAndClassId(layerId, DisturbingSubstanceClassId.S4)
  if (disturbingSubstances.length === 0) {
    await updateUserEnrichedProductDataDisturbingEolScenario(layerId)
  }

  const elcaElementComponentData = await fetchElcaComponentById(layerId, variantId, projectId)
  return elcaElementComponentData
}
