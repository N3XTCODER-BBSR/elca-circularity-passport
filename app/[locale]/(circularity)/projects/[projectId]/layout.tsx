import "styles/global.css"
import errorHandler from "app/(utils)/errorHandler"
import { getElcaProjectData } from "lib/domain-logic/circularity/server-actions/getElcaProjectData"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import NavBar from "./(components)/NavBar"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const projectId = Number(params.projectId)
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectInfo = await getElcaProjectData(projectId, userId)

    if (!projectInfo) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    return (
      <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
        <NavBar projectInfo={projectInfo} />
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8">{children}</div>
        </section>
      </div>
    )
  })
}
