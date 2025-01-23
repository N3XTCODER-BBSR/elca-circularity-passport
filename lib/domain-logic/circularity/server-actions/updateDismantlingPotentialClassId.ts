"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { upsertUserEnrichedProductDataByLayerId } from "prisma/queries/db"
import { DismantlingPotentialClassId } from "../../../../prisma/generated/client"

export async function updateDismantlingPotentialClassId(
  prodcutId: number,
  selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
) {
  z.number().parse(prodcutId)

  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), prodcutId)

  await upsertUserEnrichedProductDataByLayerId(prodcutId, selectedDismantlingPotentialClassId)
}
