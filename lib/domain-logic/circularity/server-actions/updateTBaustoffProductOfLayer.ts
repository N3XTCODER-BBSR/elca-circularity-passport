"use server"

import { z } from "zod"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import {
  deleteDisturbingSubstanceSelectionsByLayerId,
  upsertUserEnrichedProductDataWithTBaustoffProduct,
} from "prisma/queries/db"

export const updateTBaustoffProduct = async (productId: number, selectedId: number) => {
  z.number().parse(productId)
  z.number().parse(selectedId)

  const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToElementComponent(Number(session.user.id), productId)

  await upsertUserEnrichedProductDataWithTBaustoffProduct(productId, selectedId)
  await deleteDisturbingSubstanceSelectionsByLayerId(productId)
}
