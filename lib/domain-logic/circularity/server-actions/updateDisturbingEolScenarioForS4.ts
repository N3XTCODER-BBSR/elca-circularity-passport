"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { dbDalInstance } from "prisma/queries/dalSingletons"

export async function updateDisturbingEolScenarioForS4(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
) {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await dbDalInstance.upsertDisturbingEolScenarioForS4(layerId, specificScenario)
}
