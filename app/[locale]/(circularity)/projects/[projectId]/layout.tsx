import "styles/global.css"
import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import { getElcaProjectDataWithRequest } from "lib/domain-logic/circularity/server-actions/getElcaProjectDataWithRequestCache"
import NavBar from "./(components)/NavBar"
import UnauthenticatedRedirect from "../../(components)/UnauthenticatedRedirect"
import { ensureUserAuthToProject } from "lib/ensureAuthorized"
import errorHandler from "app/(utils)/errorHandler"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return <UnauthenticatedRedirect />
    }

    await ensureUserAuthToProject(Number(session.user.id), Number(params.projectId))

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
