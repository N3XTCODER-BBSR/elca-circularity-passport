import errorHandler from "app/(utils)/errorHandler"
import { getElcaElementsForVariantId } from "lib/domain-logic/circularity/server-actions/getElcaElementsForProjectId"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import ProjectCatalog from "./(components)/ProjectCatalog"

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)

    await ensureUserAuthorizationToProject(userId, projectId)

    const dataResult = await getElcaElementsForVariantId(variantId, projectId)

    if (!dataResult) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    return <ProjectCatalog projectId={projectId} variantId={variantId} projectComponents={dataResult} />
  })
}

export default Page
