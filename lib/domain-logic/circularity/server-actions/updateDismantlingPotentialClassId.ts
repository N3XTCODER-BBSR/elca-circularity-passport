"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { prisma } from "prisma/prismaClient"
import { DismantlingPotentialClassId } from "../../../../prisma/generated/client"

export async function updateDismantlingPotentialClassId(
  layerId: number,
  selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
) {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

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
}
