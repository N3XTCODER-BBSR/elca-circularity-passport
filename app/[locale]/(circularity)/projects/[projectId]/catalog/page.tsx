import errorHandler from "app/(utils)/errorHandler"
import { getElcaElementsForProjectId } from "lib/domain-logic/circularity/server-actions/getElcaElementsForProjectId"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import ProjectCatalog from "./(components)/ProjectCatalog"

const Page = async ({ params }: { params: { projectId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    await ensureUserAuthorizationToProject(Number(session.user.id), Number(params.projectId))

    const dataResult = await getElcaElementsForProjectId(params.projectId, session.user.id)

    if (!dataResult) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    return <ProjectCatalog projectId={params.projectId} projectComponents={dataResult} />
  })
}

export default Page
