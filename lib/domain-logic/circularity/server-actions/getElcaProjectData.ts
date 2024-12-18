import { getProjectsByIdAndOwnerId, Project } from "prisma/queries/legacyDb"

export const getElcaProjectData = async (projectId: number, userId: number): Promise<Project> => {
  const projects = await getProjectsByIdAndOwnerId(projectId, userId)

  if (projects.length < 1) {
    throw new Error(`Project with ID ${projectId} not found for user ${userId}`)
  }

  if (projects.length !== 1) {
    throw new Error(`Unexepcted number of query result rows: ${projects.length}`)
  }

  if (!projects[0]) {
    throw new Error(`no projects found for user ${userId}`)
  }

  const projectInfo: Project = projects[0]

  return projectInfo
}
