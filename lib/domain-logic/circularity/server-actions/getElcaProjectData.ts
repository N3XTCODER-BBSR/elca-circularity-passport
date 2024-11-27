import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import { prismaLegacy } from "prisma/prismaClient"

export const getElcaProjectData = async (projectId: string, userId: string): Promise<ElcaProjectInfo> => {
  const projects = await prismaLegacy.projects.findMany({
    where: {
      id: Number(projectId),
      owner_id: Number(userId),
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (projects.length < 1) {
    throw new Error(`Project with ID ${projectId} not found for user ${userId}`)
  }

  if (projects.length !== 1) {
    throw new Error(`Unexepcted number of query result rows: ${projects.length}`)
  }

  if (!projects[0]) {
    throw new Error(`no projects found for user ${userId}`)
  }

  const projectInfo: ElcaProjectInfo = {
    id: projects[0].id,
    project_name: projects[0].name,
  }

  console.log("getProjectDataCachedDuringRequest - projectInfo", projectInfo)

  return projectInfo
}
