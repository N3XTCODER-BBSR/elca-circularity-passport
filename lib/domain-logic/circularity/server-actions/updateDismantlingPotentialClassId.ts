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

  // TODO: IMPORTANT: add checks here for:
  // 1. user has access to the project and layer
  // 2. that there is not already a match found by out OBD-tBaustoff mapping
  // 3. if the layerId exists in the database
  await upsertUserEnrichedProductDataByLayerId(layerId, selectedDismantlingPotentialClassId)
}
