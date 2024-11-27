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
