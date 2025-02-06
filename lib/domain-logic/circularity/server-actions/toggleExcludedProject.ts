"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

const toggleExcludedProduct = async (productId: number) => {
  const { user } = await ensureUserIsAuthenticated()
  await ensureUserAuthorizationToElementComponent(Number(user.id), productId)

  await dbDalInstance.toggleExcludedProduct(productId)
}

export default toggleExcludedProduct
