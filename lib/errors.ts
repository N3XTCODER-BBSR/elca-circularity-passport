import { getErrorMessage } from "app/(utils)/getErrorMessage"

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message)
  }
}

export class UnauthenticatedError extends Error {
  constructor(message = "Unauthenticated") {
    super(message)
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message)
  }
}

export class DatabaseError extends Error {
  constructor(error: unknown) {
    const message = `Error in DAL function: ${getErrorMessage(error)}`
    super(message)
  }
}

export class CallServerActionError extends Error {
  constructor(errorI18nKey = "errors.unknown") {
    super("CallServerActionError")
    this.errorI18nKey = errorI18nKey
  }

  errorI18nKey: string
}
