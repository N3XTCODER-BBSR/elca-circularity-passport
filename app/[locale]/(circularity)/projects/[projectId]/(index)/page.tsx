import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import { getElcaProjectData } from "lib/domain-logic/circularity/server-actions/getElcaProjectData"
import BuildingOverview from "./(components)/BuildingOverview"
import UnauthenticatedRedirect from "../../../(components)/UnauthenticatedRedirect"

const Page = async ({ params }: { params: { projectId: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthenticatedRedirect />
  }

  const projectInfo = await getElcaProjectData(params.projectId, session.user.id)

  if (!projectInfo) {
    return <div>Projects with this ID not found for the current user.</div>
  }

  return <BuildingOverview projectName={projectInfo.project_name} projectId={projectInfo.id} />
}

export default Page
