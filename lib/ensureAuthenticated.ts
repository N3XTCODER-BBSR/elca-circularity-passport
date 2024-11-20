import authOptions from "app/(utils)/authOptions"
import { getServerSession } from "next-auth"
import { UnauthenticatedError } from "./errors"

const ensureAuthenticated = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    throw new UnauthenticatedError()
  }

  return session
}

export default ensureAuthenticated
