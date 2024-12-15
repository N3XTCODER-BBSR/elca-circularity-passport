import "styles/global.css"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getProjectDataWithVariants } from "prisma/queries/legacyDb"
import NavBar from "./NavBar"

const ProjectLayout = ({
  children,
  projectId,
  variantId,
  showAvatar,
  backButtonTo,
  showMenu,
  showProjectAndVariantInfo,
}: {
  children: React.ReactNode
  projectId: number
  variantId?: number
  showAvatar?: boolean
  backButtonTo?: string
  showMenu?: boolean
  showProjectAndVariantInfo?: boolean
}) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectData = await getProjectDataWithVariants(projectId)
    const variantName =
      projectData?.project_variants_project_variants_project_idToprojects.find((v) => v.id === variantId)?.name || ""

    if (!projectData) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    const navLinks = [
      { id: "overview", name: "Überblick", href: `/projects/${projectData.id}/variants` },
      { id: "catalog", name: "Katalog", href: `/projects/${projectData.id}/variants/${variantId}/catalog` },
    ]

    return (
      <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
        <NavBar
          projectInfo={
            showProjectAndVariantInfo
              ? {
                  projectName: projectData.name,
                  variantName: variantName,
                  projectId: projectData.id,
                }
              : undefined
          }
          navLinks={showMenu ? navLinks : undefined}
          showAvatar={showAvatar}
          backButtonTo={backButtonTo}
        />
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8">{children}</div>
        </section>
      </div>
    )
  })
}

export default ProjectLayout
