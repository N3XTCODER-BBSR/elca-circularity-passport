"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import prisma from "prisma/prismaClient"
import { getElcaComponentDataByLayerIdAndUserId } from "./utils/getElcaComponentDataByLayerIdAndUserId"

export async function updateTBaustoffProduct(
  layerId: number,
  selectedId: number
): Promise<EnrichedElcaElementComponent> {
  if (!layerId || !selectedId) {
    throw new Error("Invalid layerId or selectedId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await prisma.userEnrichedProductData.upsert({
    // TODO: add checks here for:
    // 1. user has access to the project and layer
    // 2. that there is not already a match found by out OBD-tBaustoff mapping
    // 3. if the layerId exists in the database
    where: { elcaElementComponentId: layerId },
    update: {
      tBaustoffProductDefinitionId: selectedId,
      specificEolUnbuiltTotalScenario: null,
      specificEolUnbuiltTotalScenarioProofText: null,
      dismantlingPotentialClassId: null,
    },
    create: {
      elcaElementComponentId: layerId,
      tBaustoffProductDefinitionId: selectedId,
      tBaustoffProductSelectedByUser: true,
    },
  })

  const newElcaElementComponentData = await getElcaComponentDataByLayerIdAndUserId(layerId, session.user.id)
  return newElcaElementComponentData
}
