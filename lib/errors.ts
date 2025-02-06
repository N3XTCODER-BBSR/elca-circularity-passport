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

export class InvalidParameterError extends Error {
  constructor(resourceName: string, id: string | number) {
    const message = `Invalid Parameter: id '${id}' for resource '${resourceName}'`
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
  constructor(i18nErrorKey = "errors.unknown") {
    super("CallServerActionError")
    this.i18nErrorKey = i18nErrorKey
  }

  i18nErrorKey: string
}

// TODO: implement more advanced error handling
export class DalError extends Error {
  constructor(message = "Dal Error") {
    super(message)
  }
}
