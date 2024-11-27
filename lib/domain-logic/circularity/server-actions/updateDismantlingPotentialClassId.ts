"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { upsertUserEnrichedProductDataByLayerId } from "prisma/queries/db"
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

  await upsertUserEnrichedProductDataByLayerId(layerId, selectedDismantlingPotentialClassId)
}
