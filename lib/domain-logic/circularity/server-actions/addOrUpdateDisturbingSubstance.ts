"use server"

import {
  DisturbingSubstanceSelectionWithNullabelId,
  EnrichedElcaElementComponent,
} from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { DisturbingSubstanceClassId, Prisma } from "prisma/generated/client"
import { fetchElcaComponentById } from "../utils/getElcaComponentDataByLayerIdAndUserId"
import { dbDalInstance } from "prisma/queries/dalSingletons"

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

  await dbDalInstance.upsertUserEnrichedProductData(layerId)

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
          elcaElementComponentId: layerId,
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
    layerId,
    DisturbingSubstanceClassId.S4
  )
  if (disturbingSubstances.length === 0) {
    await dbDalInstance.updateUserEnrichedProductDataDisturbingEolScenario(layerId)
  }

  const elcaElementComponentData = await fetchElcaComponentById(layerId, variantId, projectId)
  return elcaElementComponentData
}
