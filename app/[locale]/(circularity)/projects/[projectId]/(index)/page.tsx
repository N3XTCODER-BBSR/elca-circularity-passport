import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import { DataResult, fetchProjectDataCachedDuringRequest } from "../(utils)/data-fetcher"
import UnauthorizedInfo from "../../../(components)/UnauthorizedInfo"

const Page = async ({ params }: { params: { projectId: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthorizedInfo />
  }

  const dataResult: DataResult = await fetchProjectDataCachedDuringRequest(params.projectId, session.user.id)

  if (!dataResult) {
    return <div>Projects with this ID not found for the current user.</div>
  }

  return <>Overview</>
}

export default Page
