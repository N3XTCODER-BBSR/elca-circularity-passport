import ListItemLink from "app/(components)/generic/ListItemLink"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getProjectDataWithVariants } from "prisma/queries/legacyDb"
import ProjectLayout from "../../(components)/ProjectLayout"

const Page = async ({ params }: { params: { projectId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const projectId = Number(params.projectId)
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectData = await getProjectDataWithVariants(projectId)
    const variants = projectData?.project_variants_project_variants_project_idToprojects || []

    const displayVariants = variants.map((variant) => {
      return (
        <ListItemLink
          dateText={`Created on ${variant.created.toLocaleDateString()}`}
          linkTo={`variants/${variant.id}/catalog`}
          key={variant.id}
          title={variant.name}
        />
      )
    })

    return (
      <div>
        <h4 className="mb-1 text-sm font-semibold uppercase text-bbsr-blue-600">Projekt:</h4>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">{projectData?.name || "unnamed"}</h1>
        {displayVariants}
      </div>
    )
  })
}

const PageWithLayout = async ({ params }: { params: { projectId: string } }) => {
  const projectId = Number(params.projectId)
  const page = await Page({ params })

  const projectLayout = await ProjectLayout({
    children: page,
    projectId,
    showAvatar: true,
    showBackButton: true,
  })

  return <>{projectLayout}</>
}

export default PageWithLayout
