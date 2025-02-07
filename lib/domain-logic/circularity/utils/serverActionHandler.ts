import { ActionResponse } from "lib/domain-logic/shared/basic-types"
import { DatabaseError, UnauthorizedError } from "lib/errors"

export const serverActionErrorHandler = async <TData = unknown>(
  fn: () => Promise<TData>
): Promise<ActionResponse<TData>> => {
  try {
    const result = await fn()
    return { success: true, data: result }
  } catch (error: unknown) {
    console.error("Error in server action", error)
    if (error instanceof UnauthorizedError) {
      return { success: false, errorI18nKey: "errors.unauthorized", errorLevel: "error" }
    }
    if (error instanceof DatabaseError) {
      return { success: false, errorI18nKey: "errors.db", errorLevel: "error" }
    }

    return { success: false, errorI18nKey: "errors.unknown" }
  }
}
