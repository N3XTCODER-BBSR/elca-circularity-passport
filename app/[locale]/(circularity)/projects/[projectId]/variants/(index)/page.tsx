import Link from "next/link"
import errorHandler from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getVariantsByProjectId } from "prisma/queries/legacyDb"

const Page = async ({ params }: { params: { projectId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const projectId = Number(params.projectId)
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const variants = await getVariantsByProjectId(projectId)

    const displayVariants = variants.map((variant) => {
      return (
        <Link key={variant.id} href={`variants/${variant.id}/catalog`} className="block">
          {variant.name}
        </Link>
      )
    })

    return <div>{displayVariants}</div>
  })
}

export default Page
