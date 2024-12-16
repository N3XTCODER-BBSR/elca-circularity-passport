"use server"

import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { toggleExcludedProduct as toggleExcludedProductDao } from "prisma/queries/db"

const toggleExcludedProduct = async (productId: number) => {
  const { user } = await ensureUserIsAuthenticated()
  await ensureUserAuthorizationToElementComponent(Number(user.id), productId)

  await toggleExcludedProductDao(productId)
}

export default toggleExcludedProduct
