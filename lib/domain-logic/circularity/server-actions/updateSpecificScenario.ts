"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { prisma } from "prisma/prismaClient"
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

  await prisma.userEnrichedProductData.upsert({
    // TODO: add checks here for:
    // 1. user has access to the project and layer
    // 2. that there is not already a match found by out OBD-tBaustoff mapping
    // 3. if the layerId exists in the database
    where: { elcaElementComponentId: layerId },
    update: {
      specificEolUnbuiltTotalScenario: specificScenario,
      specificEolUnbuiltTotalScenarioProofText,
    },
    create: {
      elcaElementComponentId: layerId,
      specificEolUnbuiltTotalScenario: specificScenario,
      tBaustoffProductSelectedByUser: false,
    },
  })
}
