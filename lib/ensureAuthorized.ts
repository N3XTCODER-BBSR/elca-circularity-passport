import { isUserAuthorizedToElementComponent, isUserAuthorizedToProject } from "prisma/queries/legacyDb"
import { UnauthorizedError } from "./errors"

/**
 * ensure that the user is authorized to access the project with the given id or throw an error
 * @param userId
 * @param projectId
 */
export const ensureUserAuthorizationToProject = async (userId: number, projectId: number) => {
  const isAuthorized = isUserAuthorizedToProject(userId, projectId)

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }
}

/**
 * ensure that the user is authorized to access the element with the given id or throw an error
 * @param userId
 * @param elementId
 */
export const ensureUserAuthorizationToElementComponent = async (userId: number, elementComponentId: number) => {
  const isAuthorized = await isUserAuthorizedToElementComponent(userId, elementComponentId)

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }
}
