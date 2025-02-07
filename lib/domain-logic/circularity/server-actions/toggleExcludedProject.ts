"use server"

import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementComponent } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"

const toggleExcludedProduct = async (productId: number) => {
  return withServerActionErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToElementComponent(userId, productId)

    await dbDalInstance.toggleExcludedProduct(productId)
  })
}

export default toggleExcludedProduct
