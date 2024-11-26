"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { prisma } from "prisma/prismaClient"
import { getElcaComponentDataByLayerIdAndUserId } from "../utils/getElcaComponentDataByLayerIdAndUserId"

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

  await prisma.disturbingSubstanceSelection.delete({
    where: {
      id: disturbingSubstanceSelectionId,
    },
  })

  const elcaElementComponentData = await getElcaComponentDataByLayerIdAndUserId(layerId, session.user.id)
  return elcaElementComponentData
}
