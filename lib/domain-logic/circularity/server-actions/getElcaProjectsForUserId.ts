import { getProjectsByOwnerId, ProjectWithUserName } from "prisma/queries/legacyDb"

const getElcaProjectsForUserId = async (userId: string): Promise<ProjectWithUserName[]> => {
  const projects = await getProjectsByOwnerId(Number(userId))

  if (projects === null) {
    throw new Error("No projects found for user")
  }

  return projects
}

export default getElcaProjectsForUserId
