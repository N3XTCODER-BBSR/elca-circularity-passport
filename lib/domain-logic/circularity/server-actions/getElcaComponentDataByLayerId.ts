"use server"

import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { fetchElcaComponentByIdAndUserId } from "./utils/getElcaComponentDataByLayerIdAndUserId"

const getElcaComponentDataByLayerId = async (layerId: number): Promise<EnrichedElcaElementComponent> => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  const newElcaElementComponentData = await fetchElcaComponentByIdAndUserId(layerId, session.user.id)
  return newElcaElementComponentData
}

export default getElcaComponentDataByLayerId
