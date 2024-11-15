import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import { prismaLegacy } from "prisma/prismaClient"

const getElcaProjectsForUserId = async (userId: string): Promise<ElcaProjectInfo[]> => {
  const projects = await prismaLegacy.projects.findMany({
    where: {
      owner_id: Number(userId),
    },
    select: {
      id: true,
      name: true,
      created: true,
      users: {
        select: {
          auth_name: true,
        },
      },
    },
  })

  return projects.map<ElcaProjectInfo>((project) => ({
    id: project.id,
    project_name: project.name,
    created_at: project.created,
    created_by_user_name: project.users.auth_name,
  }))
}

export default getElcaProjectsForUserId
