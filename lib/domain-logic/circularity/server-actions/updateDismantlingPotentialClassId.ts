"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { prisma } from "prisma/prismaClient"
import { getElcaComponentDataByLayerIdAndUserId } from "./utils/getElcaComponentDataByLayerIdAndUserId"
import { DismantlingPotentialClassId } from "../../../../prisma/generated/client"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"

export async function updateDismantlingPotentialClassId(
  layerId: number,
  selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
): Promise<EnrichedElcaElementComponent> {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), layerId)

  await prisma.userEnrichedProductData.upsert({
    // TODO: IMPORTANT: add checks here for:
    // 1. user has access to the project and layer
    // 2. that there is not already a match found by out OBD-tBaustoff mapping
    // 3. if the layerId exists in the database
    where: { elcaElementComponentId: layerId },
    update: {
      dismantlingPotentialClassId: selectedDismantlingPotentialClassId,
    },
    create: {
      elcaElementComponentId: layerId,
      dismantlingPotentialClassId: selectedDismantlingPotentialClassId,
      tBaustoffProductSelectedByUser: false,
    },
  })

  const elcaElementComponentData = await getElcaComponentDataByLayerIdAndUserId(layerId, session.user.id)
  return elcaElementComponentData
}
