"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { upsertUserEnrichedProductDataWithEolScenario } from "prisma/queries/db"
import { TBs_ProductDefinitionEOLCategoryScenario } from "../../../../prisma/generated/client"

export async function updateSpecificEolScenario(
  layerId: number,
  specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
  specificEolUnbuiltTotalScenarioProofText: string
) {
  if (!layerId) {
    throw new Error("Invalid layerId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await upsertUserEnrichedProductDataWithEolScenario(
    layerId,
    specificScenario,
    specificEolUnbuiltTotalScenarioProofText
  )
}
