import "styles/global.css"
import errorHandler from "app/(utils)/errorHandler"
import { getElcaProjectData } from "lib/domain-logic/circularity/server-actions/getElcaProjectData"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import NavBar from "./NavBar"

const ProjectLayout = ({
  children,
  projectId,
  variantId,
  showAvatar,
  showBackButton,
  showMenu,
  showProjectAndVariantInfo,
}: {
  children: React.ReactNode
  projectId: number
  variantId?: number
  showAvatar?: boolean
  showBackButton?: boolean
  showMenu?: boolean
  showProjectAndVariantInfo?: boolean
}) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectInfo = await getElcaProjectData(projectId, userId)

    if (!projectInfo) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    const navLinks = [
      { id: "overview", name: "Überblick", href: `/projects/${projectInfo.id}/variants` },
      { id: "catalog", name: "Katalog", href: `/projects/${projectInfo.id}/variants/${variantId}/catalog` },
    ]

    return (
      <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
        <NavBar
          projectInfo={showProjectAndVariantInfo ? projectInfo : undefined}
          navLinks={showMenu ? navLinks : undefined}
          showAvatar={showAvatar}
          showBackButton={showBackButton}
        />
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8">{children}</div>
        </section>
      </div>
    )
  })
}

export default ProjectLayout
