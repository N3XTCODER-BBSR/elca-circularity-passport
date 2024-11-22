"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import {
  DisturbingSubstanceSelectionWithNullabelId,
  EnrichedElcaElementComponent,
} from "lib/domain-logic/types/domain-types"
import { DisturbingSubstanceClassId, Prisma } from "prisma/generated/client"
import { prisma } from "prisma/prismaClient"
import { getElcaComponentDataByLayerIdAndUserId } from "../utils/getElcaComponentDataByLayerIdAndUserId"

export async function addOrUpdateDisturbingSubstanceSelection(
  layerId: number,
  disturbingSubstanceSelectionWithNullableId: DisturbingSubstanceSelectionWithNullabelId
): Promise<EnrichedElcaElementComponent> {
  if (!layerId || !disturbingSubstanceSelectionWithNullableId) {
    throw new Error("Invalid layerId or disturbingSubstanceId")
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await prisma.userEnrichedProductData.upsert({
    where: { elcaElementComponentId: layerId },
    update: {},
    create: {
      elcaElementComponentId: layerId,
      tBaustoffProductSelectedByUser: false,
    },
  })

  try {
    if (disturbingSubstanceSelectionWithNullableId.id != null) {
      const { disturbingSubstanceClassId, disturbingSubstanceName } = disturbingSubstanceSelectionWithNullableId

      const updateData: Prisma.DisturbingSubstanceSelectionUpdateInput = {
        disturbingSubstanceClassId,
        disturbingSubstanceName,
      }

      if (disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        updateData.disturbingSubstanceName = null
      }

      await prisma.disturbingSubstanceSelection.update({
        where: {
          id: disturbingSubstanceSelectionWithNullableId.id,
        },
        data: updateData,
      })
    } else {
      const createData: Prisma.DisturbingSubstanceSelectionCreateInput = {
        disturbingSubstanceClassId: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId || null,
        disturbingSubstanceName: disturbingSubstanceSelectionWithNullableId.disturbingSubstanceName || null,
        userEnrichedProductData: {
          connect: {
            elcaElementComponentId: layerId,
          },
        },
      }

      if (disturbingSubstanceSelectionWithNullableId.disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
        createData.disturbingSubstanceName = null
      }

      await prisma.disturbingSubstanceSelection.create({
        data: createData,
      })
    }
  } catch (error: any) {
    throw error
  }

  // If there are no S4 disturbing substances, remove the disturbingEolScenarioForS4
  const disturbingSubstances = await prisma.disturbingSubstanceSelection.findMany({
    where: {
      userEnrichedProductDataElcaElementComponentId: layerId,
      disturbingSubstanceClassId: DisturbingSubstanceClassId.S4,
    },
  })
  if (disturbingSubstances.length === 0) {
    await prisma.userEnrichedProductData.update({
      where: {
        elcaElementComponentId: layerId,
      },
      data: {
        disturbingEolScenarioForS4: null,
      },
    })
  }

  const elcaElementComponentData = await getElcaComponentDataByLayerIdAndUserId(layerId, session.user.id)
  return elcaElementComponentData
}
