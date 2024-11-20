import { getElcaElementsForProjectId } from "lib/domain-logic/circularity/server-actions/getElcaElementsForProjectId"
import ProjectCatalog from "./(components)/ProjectCatalog"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"

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
