import { FC } from "react"
import ListItemLink from "app/(components)/generic/ListItemLink"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { getProjectsByOwnerId } from "prisma/queries/legacyDb"

const Page = async () => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)

    const projects = await getProjectsByOwnerId(userId)

    if (projects.length === 0) {
      return <>No projects found</>
    }

    return (
      <div className="mb-4 flex flex-col">
        <h3 className="mb-8 text-2xl font-bold">Your projects</h3>
        <ProjectList projects={projects} />
      </div>
    )
  })
}

const ProjectList: FC<{ projects: Awaited<ReturnType<typeof getProjectsByOwnerId>> }> = ({ projects }) => {
  return (
    <div>
      {projects.map((project) => {
        const description = `Created on ${project.created.toLocaleDateString()} • Created by ${project.users.auth_name}`

        const variantsCount = project.project_variants_project_variants_project_idToprojects.length
        const badgeText = variantsCount > 0 ? `${variantsCount} variants` : undefined

        return (
          <ListItemLink
            key={project.id}
            linkTo={`projects/${project.id}`}
            title={project.name}
            description={description}
            badgeText={badgeText}
          />
        )
      })}
    </div>
  )
}

export default Page
