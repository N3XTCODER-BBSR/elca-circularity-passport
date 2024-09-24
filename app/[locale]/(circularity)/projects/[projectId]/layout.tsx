import "styles/global.css"
import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import NavBar from "./(components)/NavBar"
import { DataResult, fetchProjectDataCachedDuringRequest } from "./(utils)/data-fetcher"
import UnauthorizedInfo from "../../(components)/UnauthorizedInfo"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthorizedInfo />
  }

  const dataResult: DataResult = await fetchProjectDataCachedDuringRequest(params.projectId, session.user.id)

  if (!dataResult) {
    return <div>Projects with this ID not found for the current user.</div>
  }

  return (
    <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
      <NavBar projectInfo={dataResult.projectInfo} />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8">{children}</div>
      </section>
    </div>
  )
}
