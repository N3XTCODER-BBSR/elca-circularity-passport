import errorHandler from "app/(utils)/errorHandler"
import { getPassportsForProjectVariantId } from "lib/domain-logic/circularity/misc/getPassportsForProjectVariantId"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { PassportMetadata } from "prisma/queries/db"
import ProjectPassports from "./(components)/ProjectPassports"

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    await ensureUserAuthorizationToProject(Number(session.user.id), Number(params.projectId))

    const passportsMetadataForProjectVariant: PassportMetadata[] = await getPassportsForProjectVariantId(
      params.variantId
    )

    return (
      <ProjectPassports
        passportsMetadata={passportsMetadataForProjectVariant}
        projectVariantId={params.variantId}
        projectId={params.projectId}
      />
    )
  })
}

export default Page
