import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import UnauthorizedRedirect from "app/[locale]/(circularity)/(components)/UnauthorizedRedirect"
import ProjectCatalog from "./(components)/ProjectCatalog"
import { DataResult, fetchProjectDataCachedDuringRequest } from "../(utils)/data-fetcher"

const Page = async ({ params }: { params: { projectId: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthorizedRedirect />
  }

  const dataResult: DataResult = await fetchProjectDataCachedDuringRequest(params.projectId, session.user.id)

  if (!dataResult) {
    return <div>Projects with this ID not found for the current user.</div>
  }

  return <ProjectCatalog projectId={params.projectId} projectComponents={dataResult.projectComponents} />
}

export default Page
