import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import UnauthenticatedRedirect from "../../../(components)/UnauthenticatedRedirect"

const Page = async ({ params }: { params: { projectId: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthenticatedRedirect />
  }

  return <>Overview</>
}

export default Page
