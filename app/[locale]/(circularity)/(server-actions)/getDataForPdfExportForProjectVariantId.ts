"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/auth/ensureAuthorized"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"

/**
 * Server action for retrieving data for PDF export for a project variant
 * Handles validation, authentication, and authorization, then delegates to DAL
 */
const getDataForPdfExportForProjectVariantId = async (variantId: number, projectId: number) => {
  return withServerActionErrorHandling(async () => {
    // Input validation
    z.number().parse(variantId)
    z.number().parse(projectId)

    // Authentication and authorization
    const session = await ensureUserIsAuthenticated()
    const userId = Number(session.user.id)
    await ensureUserAuthorizationToProject(userId, projectId)

    // Delegate to DAL
    return legacyDbDalInstance.getPassportRelevantDataForProjectVariantFromLegacyDb(variantId)
  })
}

export default getDataForPdfExportForProjectVariantId
