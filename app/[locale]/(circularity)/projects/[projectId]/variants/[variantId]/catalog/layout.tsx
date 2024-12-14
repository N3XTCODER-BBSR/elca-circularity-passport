import "styles/global.css"
import ProjectLayout from "../../../(components)/ProjectLayout"

export default async function CatalogueLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string; variantId: string }
}) {
  const projectId = Number(params.projectId)
  const variantId = Number(params.variantId)

  const projectLayout = await ProjectLayout({
    children,
    projectId,
    variantId,
    showAvatar: true,
    showMenu: true,
    showProjectAndVariantInfo: true,
  })

  return <>{projectLayout}</>
}
