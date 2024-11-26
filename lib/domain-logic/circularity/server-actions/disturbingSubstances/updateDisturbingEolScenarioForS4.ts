"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { prisma } from "prisma/prismaClient"

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

  await prisma.userEnrichedProductData.upsert({
    // TODO: add checks here for:
    // 1. user has access to the project and layer
    // 2. that there is not already a match found by out OBD-tBaustoff mapping
    // 3. if the layerId exists in the database
    where: { elcaElementComponentId: layerId },
    update: {
      disturbingEolScenarioForS4: specificScenario,
    },
    create: {
      elcaElementComponentId: layerId,
      disturbingEolScenarioForS4: specificScenario,
      tBaustoffProductSelectedByUser: false,
    },
  })
}
