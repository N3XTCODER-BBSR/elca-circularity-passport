import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import getElcaProjectsForUserId from "lib/domain-logic/circularity/server-actions/getElcaProjectsForUserId"
import ProjectLinksList from "./(components)/ProjectsLinkList"
import UnauthorizedRedirect from "../../(components)/UnauthorizedRedirect"
import { ElcaProjectInfo } from "../../../../../lib/domain-logic/types/domain-types"

const getUsersProjects = async (): Promise<ElcaProjectInfo[] | null> => {
  const session = await getServerSession(authOptions)

  if (session?.user == null) {
    return null
  }

  return getElcaProjectsForUserId(session.user.id)
}

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (session == null) {
    return <UnauthorizedRedirect />
  }
  const usersProjects = await getUsersProjects()

  if (usersProjects == null) {
    return <>No projects found</>
  }

  return (
    <div className="mb-4 flex flex-col">
      <h3 className="mb-8 text-2xl font-bold">Your projects</h3>
      <ProjectLinksList projects={usersProjects} />
    </div>
  )
}
export default Page
