import errorHandler from "app/(utils)/errorHandler"
import { getElcaProjectData } from "lib/domain-logic/circularity/server-actions/getElcaProjectData"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import BuildingOverview from "./(components)/BuildingOverview"

const Page = async ({ params }: { params: { projectId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectInfo = await getElcaProjectData(projectId, userId)

    if (!projectInfo) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    return <BuildingOverview projectName={projectInfo.name} projectId={projectInfo.id} />
  })
}

export default Page
