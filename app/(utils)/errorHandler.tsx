import { notFound } from "next/navigation"
import { ZodError } from "zod"
import UnauthenticatedRedirect from "app/[locale]/(circularity)/(components)/UnauthenticatedRedirect"
import { ActionResponse } from "lib/domain-logic/shared/basic-types"
import { DatabaseError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../lib/errors"
import Unauthorized from "../[locale]/(circularity)/(components)/Unauthorized"
import { getRequestId } from "./getRequestId"

export const withServerComponentErrorHandling = async (fn: () => Promise<React.ReactNode>) => {
  try {
    return await fn()
  } catch (error) {
    console.error(`Error in server component (requestId: ${getRequestId()})`, error)

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

export const withServerActionErrorHandling = async <TData = unknown,>(
  fn: () => Promise<TData>
): Promise<ActionResponse<TData>> => {
  try {
    const result = await fn()
    return { success: true, data: result }
  } catch (error: unknown) {
    console.error(`Error in server action (requestId: ${getRequestId()})`, error)
    if (error instanceof UnauthorizedError) {
      return { success: false, errorI18nKey: "errors.unauthorized", errorLevel: "error" }
    }
    if (error instanceof DatabaseError) {
      return { success: false, errorI18nKey: "errors.db", errorLevel: "error" }
    }
    if (error instanceof ZodError) {
      return { success: false, errorI18nKey: "errors.validation", errorLevel: "error", details: error.issues }
    }

    return { success: false, errorI18nKey: "errors.unknown" }
  }
}
