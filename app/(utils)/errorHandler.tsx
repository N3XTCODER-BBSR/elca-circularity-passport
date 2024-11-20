import { UnauthorizedError } from "../../lib/errors"
import Unauthorized from "../[locale]/(circularity)/(components)/Unauthorized"

const errorHandler = async (fn: () => Promise<React.ReactNode>) => {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return <Unauthorized />
    }

    // will be handled as 500 by client side error boundary (error.tsx)
    throw error
  }
}

export default errorHandler
