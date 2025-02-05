import UnauthenticatedRedirect from "app/[locale]/(circularity)/(components)/UnauthenticatedRedirect"
import { UnauthenticatedError, UnauthorizedError } from "../../lib/errors"
import Unauthorized from "../[locale]/(circularity)/(components)/Unauthorized"

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

    // will be handled as 500 by client side error boundary (error.tsx)
    throw error
  }
}

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  level?: "info" | "warning" | "error"
  message?: string // i18n key
}

export const serverActionErrorHandler = async <TData = unknown,>(
  fn: () => Promise<TData>
): Promise<ActionResponse<TData>> => {
  try {
    const result = await fn()
    return { success: true, data: result }
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return { success: false, message: error.message, level: "error" }
    }
    if (error instanceof Error) {
      return { success: false, message: error.message, level: "error" }
    }

    return { success: false, message: "An unknown error occurred" } // TODO before merge: define generic i18n error message key
  }
}

export default errorHandler
