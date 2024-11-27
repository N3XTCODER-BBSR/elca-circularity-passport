"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { DisturbingSubstanceSelectionWithNullabelId, EnrichedProduct } from "lib/domain-logic/types/domain-types"
import { DisturbingSubstanceClassId, Prisma } from "prisma/generated/client"
import {
  createDisturbingSubstanceSelection,
  findDisturbingSubstancesByLayerIdAndClassId,
  updateDisturbingSubstanceSelection,
  updateUserEnrichedProductDataDisturbingEolScenario,
  upsertUserEnrichedProductData,
} from "prisma/queries/db"
import { fetchElcaComponentByIdAndUserId } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function addOrUpdateDisturbingSubstanceSelection(
  layerId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
): Promise<EnrichedProduct> {
  if (!layerId || !disturbingSubstanceSelectionWithNullableId) {
    throw new Error("Invalid layerId or disturbingSubstanceId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

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

  const elcaElementComponentData = await fetchElcaComponentByIdAndUserId(layerId, session.user.id)
  return elcaElementComponentData
}
