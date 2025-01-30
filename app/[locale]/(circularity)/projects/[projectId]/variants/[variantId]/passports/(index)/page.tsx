import errorHandler from "app/(utils)/errorHandler"
import { getPassportsForProjectVariantId } from "lib/domain-logic/circularity/server-actions/passports/getPassportsForProjectVariantId"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { PassportMetadata } from "prisma/queries/db"
import ProjectPassports from "./(components)/ProjectPassports"
import { getVariantById } from "prisma/queries/legacyDb"
import { NotFoundError, UnauthorizedError } from "lib/errors"

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)

    await ensureUserAuthorizationToProject(userId, projectId)

    const variant = await getVariantById(variantId)
    if (!variant) {
      throw new NotFoundError()
    }
    if (variant.project_id !== projectId) {
      throw new UnauthorizedError()
    }

    const passportsMetadataForProjectVariant: PassportMetadata[] = await getPassportsForProjectVariantId(variantId)

    return (
      <ProjectPassports
        passportsMetadata={passportsMetadataForProjectVariant}
        projectVariantId={variantId}
        projectId={projectId}
      />
    )
  })
}

export default Page
