"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import {
  deleteDisturbingSubstanceSelectionsByLayerId,
  upsertUserEnrichedProductDataWithTBaustoffProduct,
} from "prisma/queries/db"

export async function updateTBaustoffProduct(layerId: number, selectedId: number) {
  if (!layerId || !selectedId) {
    throw new Error("Invalid layerId or selectedId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await upsertUserEnrichedProductDataWithTBaustoffProduct(layerId, selectedId)
  await deleteDisturbingSubstanceSelectionsByLayerId(layerId)
}
