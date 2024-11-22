import "server-only"

import { prismaLegacy } from "prisma/prismaClient"
import { UnauthorizedError } from "./errors"

/**
 * ensure that the user is authorized to access the project with the given id or throw an error
 * @param userId
 * @param projectId
 */
export const ensureUserAuthorizationToProject = async (userId: number, projectId: number) => {
  const isAuthorized = await prismaLegacy.projects.findFirst({
    where: {
      id: projectId,
      OR: getProjectAuthorizationConditions(userId),
    },
    select: { id: true },
  })

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
  const isAuthorized = await prismaLegacy.elca_element_components.findFirst({
    where: {
      id: elementComponentId,
      OR: [
        // Element is public
        {
          elements: {
            is_public: true,
          },
        },
        // User is authorized via project
        {
          elements: {
            project_variants: {
              projects_project_variants_project_idToprojects: {
                OR: getProjectAuthorizationConditions(userId),
              },
            },
          },
        },
      ],
    },
    select: { id: true },
  })

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }
}

const getProjectAuthorizationConditions = (userId: number) => [
  // User is the owner of the project
  { owner_id: userId },
  // User is a member of the project's access group
  {
    groups: {
      group_members: {
        some: {
          user_id: userId,
        },
      },
    },
  },
  // User has a confirmed access token for the project
  {
    project_access_tokens: {
      some: {
        user_id: userId,
        is_confirmed: true,
        can_edit: true,
      },
    },
  },
]
