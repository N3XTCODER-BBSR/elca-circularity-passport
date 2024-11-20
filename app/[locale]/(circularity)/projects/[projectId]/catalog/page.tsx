import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import UnauthenticatedRedirect from "app/[locale]/(circularity)/(components)/UnauthenticatedRedirect"
import { getElcaElementsForProjectId } from "lib/domain-logic/circularity/server-actions/getElcaElementsForProjectId"
import ProjectCatalog from "./(components)/ProjectCatalog"
import { ensureUserAuthToProject } from "lib/ensureAuthorized"
import errorHandler from "app/(utils)/errorHandler"

const Page = async ({ params }: { params: { projectId: string } }) => {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return <UnauthenticatedRedirect />
    }

    await ensureUserAuthToProject(Number(session.user.id), Number(params.projectId))

    const dataResult = await getElcaElementsForProjectId(params.projectId, session.user.id)

    if (!dataResult) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    return <ProjectCatalog projectId={params.projectId} projectComponents={dataResult} />
  })
}

export default Page
