import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import { query } from "lib/elca-legacy-db"

const getElcaProjectsForUserId = async (userId: string): Promise<ElcaProjectInfo[]> => {
  const result = await query(
    `
SELECT us.auth_name as created_by_user_name, 
proj.id as id, 
process_db_id, 
current_variant_id, 
access_group_id, 
"name" as project_name, 
description, 
project_nr, 
constr_measure, 
life_time, 
proj.created as created_at, 
constr_class_id, 
editor, 
is_reference, 
benchmark_version_id, 
"password", 
owner_id, 
assessment_system_id, 
din277_version
FROM elca.projects as proj
inner join public.users us on us.id = proj.owner_id 
    WHERE proj.owner_id = $1
    `,
    [userId]
  )

  return result.rows
}

export default getElcaProjectsForUserId
