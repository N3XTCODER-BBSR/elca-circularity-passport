import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import UnauthorizedRedirect from "../../../(components)/UnauthorizedRedirect"

const Page = async ({ params }: { params: { projectId: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthorizedRedirect />
  }

  return <>Overview</>
}

export default Page
