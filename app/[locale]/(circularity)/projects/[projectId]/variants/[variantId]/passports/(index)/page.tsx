import { ensureVariantAccessible } from "app/(utils)/ensureAccessible"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { PassportMetadata } from "prisma/queries/db"
import ProjectPassports from "./(components)/ProjectPassports"

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return withServerComponentErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)

    await ensureUserAuthorizationToProject(userId, projectId)

    await ensureVariantAccessible(variantId, projectId)

    const passportsMetadataForProjectVariant: PassportMetadata[] =
      await dbDalInstance.getMetaDataForAllPassportsForProjectVariantId(variantId)

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
