import { notFound, redirect } from "next/navigation"
import { NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../lib/errors"
import Unauthorized from "../[locale]/(circularity)/(components)/Unauthorized"
import UnauthenticatedRedirect from "app/[locale]/(circularity)/(components)/UnauthenticatedRedirect"

const errorHandler = async (fn: () => Promise<React.ReactNode>) => {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return <Unauthorized />
    }

    if (error instanceof UnauthenticatedError) {
      return <UnauthenticatedRedirect />
    }

    if (error instanceof NotFoundError) {
      return notFound()
    }

    // will be handled as 500 by client side error boundary (error.tsx)
    throw error
  }
}

export default errorHandler
