import getElcaProjectsForUserId from "lib/domain-logic/circularity/server-actions/getElcaProjectsForUserId"
import ProjectLinksList from "./(components)/ProjectsLinkList"
import errorHandler from "app/(utils)/errorHandler"
import ensureAuthenticated from "lib/ensureAuthenticated"

const Page = async () => {
  return errorHandler(async () => {
    const session = await ensureAuthenticated()

    const usersProjects = await getElcaProjectsForUserId(session.user.id)

    if (usersProjects === null) {
      return <>No projects found</>
    }

    return (
      <div className="mb-4 flex flex-col">
        <h3 className="mb-8 text-2xl font-bold">Your projects</h3>
        <ProjectLinksList projects={usersProjects} />
      </div>
    )
  })
}

export default Page
