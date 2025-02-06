import { getTranslations } from "next-intl/server"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import BuildingOverview from "./(components)/BuildingOverview"

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)
    const t = await getTranslations("CircularityTool.sections.overview")

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectInfo = await legacyDbDalInstance.getProjectById(projectId)

    if (!projectInfo) {
      return <div>{t("projectNotFound")}</div>
    }

    return <BuildingOverview projectName={projectInfo.name} projectId={projectInfo.id} variantId={variantId} />
  })
}

export default Page
