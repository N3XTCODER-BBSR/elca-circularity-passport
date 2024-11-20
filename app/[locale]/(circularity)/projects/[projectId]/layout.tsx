import "styles/global.css"
import { getElcaProjectDataWithRequest } from "lib/domain-logic/circularity/server-actions/getElcaProjectDataWithRequestCache"
import NavBar from "./(components)/NavBar"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    await ensureUserAuthorizationToProject(Number(session.user.id), Number(params.projectId))

    const projectInfo = await getElcaProjectDataWithRequest(params.projectId, session.user.id)

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
