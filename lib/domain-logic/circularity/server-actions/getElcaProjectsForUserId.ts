import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import { getProjectsByOwnerId } from "prisma/queries/legacyDb"

const getElcaProjectsForUserId = async (userId: string): Promise<ElcaProjectInfo[]> => {
  const projects = await getProjectsByOwnerId(Number(userId))

  return projects.map<ElcaProjectInfo>((project) => ({
    id: project.id,
    project_name: project.name,
    created_at: project.created,
    created_by_user_name: project.users.auth_name,
  }))
}

export default getElcaProjectsForUserId
