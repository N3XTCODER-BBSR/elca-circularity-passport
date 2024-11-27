"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { deleteDisturbingSubstanceSelectionById } from "prisma/queries/db"
import { fetchElcaComponentByIdAndUserId } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function removeDisturbingSubstanceSelection(
  layerId: number,
  disturbingSubstanceSelectionId: number
): Promise<EnrichedElcaElementComponent> {
  if (!layerId || !disturbingSubstanceSelectionId) {
    throw new Error("Invalid layerId or disturbingSubstanceSelectionId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await deleteDisturbingSubstanceSelectionById(disturbingSubstanceSelectionId)

  const elcaElementComponentData = await fetchElcaComponentByIdAndUserId(layerId, session.user.id)
  return elcaElementComponentData
}
