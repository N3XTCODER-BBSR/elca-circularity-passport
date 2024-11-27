import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import { UnauthenticatedError } from "./errors"

/**
 * verify that the user is authenticated and if not throw an error
 * @returns user session
 */
const ensureUserIsAuthenticated = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    throw new UnauthenticatedError()
  }

  return session
}

export default ensureUserIsAuthenticated
