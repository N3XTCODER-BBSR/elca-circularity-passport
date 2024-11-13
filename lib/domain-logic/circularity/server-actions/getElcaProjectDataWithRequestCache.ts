import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import { query } from "lib/elca-legacy-db"

export const getElcaProjectDataWithRequest = async (projectId: string, userId: string): Promise<ElcaProjectInfo> => {
  const result = await query(
    `SELECT id, name AS project_name
  FROM elca.projects
  WHERE owner_id = $1 AND id = $2`,
    [userId, projectId]
  )

  if (result.rows.length < 1) {
    throw new Error(`Project with ID ${projectId} not found for user ${userId}`)
  }

  if (result.rows.length !== 1) {
    throw new Error(`Unexepcted number of query result rows: ${result.rows.length}`)
  }

  if (result.rows[0] == null) {
    throw new Error(`Unexpected query result: ${result.rows[0]}`)
  }
  const projectInfo = result.rows[0]
  console.log("getProjectDataCachedDuringRequest - projectInfo", projectInfo)

  return projectInfo
}
// )
