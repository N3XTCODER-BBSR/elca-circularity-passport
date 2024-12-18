import { getTranslations } from "next-intl/server"
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

    const t = await getTranslations("Grp.Web.sections.projects")

    if (projects.length === 0) {
      return <>No projects found</>
    }

    const projectList = await ProjectList({ projects })

    return (
      <div className="mb-4 flex flex-col">
        <h3 className="mb-8 text-2xl font-bold">{t("yourProjects")}</h3>
        {projectList}
      </div>
    )
  })
}

const ProjectList: FC<{ projects: Awaited<ReturnType<typeof getProjectsByOwnerId>> }> = async ({ projects }) => {
  const t = await getTranslations("Grp.Web.sections.projects")

  return (
    <ul>
      {projects.map((project) => {
        const description = `${t("createdOn")} ${project.created.toLocaleDateString()} • ${t("createdBy")} ${
          project.users.auth_name
        }`

        const variantsCount = project.project_variants_project_variants_project_idToprojects.length
        const badgeText = variantsCount > 0 ? `${variantsCount} ${t("variants")}` : undefined
        const linkTo = `projects/${project.id}/variants`

        return (
          <ListItemLink
            key={project.id}
            linkTo={linkTo}
            title={project.name}
            description={description}
            badgeText={badgeText}
          />
        )
      })}
    </ul>
  )
}

export default Page
