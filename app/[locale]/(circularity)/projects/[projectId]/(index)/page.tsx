import errorHandler from "app/(utils)/errorHandler"
import { getElcaProjectData } from "lib/domain-logic/circularity/server-actions/getElcaProjectData"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import BuildingOverview from "./(components)/BuildingOverview"
import ProjectLayout from "../(components)/ProjectLayout"

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

    return <BuildingOverview projectName={projectInfo.project_name} projectId={projectInfo.id} />
  })
}

const PageWithLayout = async ({ params }: { params: { projectId: string } }) => {
  const projectId = Number(params.projectId)
  const page = await Page({ params })

  const projectLayout = await ProjectLayout({
    children: page,
    projectId,
    showAvatar: true,
    showBackButton: true,
  })

  return <>{projectLayout}</>
}

export default PageWithLayout
