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

export const getErrorMessage = (error: unknown): string => {
  let message: string
  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message)
  } else if (typeof error == "string") {
    message = error
  } else {
    message = "Something went wrong"
  }
  return message
}
