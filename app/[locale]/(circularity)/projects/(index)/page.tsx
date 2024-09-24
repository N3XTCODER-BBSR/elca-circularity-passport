import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import { query } from "lib/elca-legacy-db"
import ProjectLinksList from "./(components)/ProjectsLinkList"
import UnauthorizedInfo from "../../(components)/UnauthorizedInfo"
import { ElcaProjectInfo } from "../../(utils)/types"

const getUsersProjects = async (): Promise<ElcaProjectInfo[] | null> => {
  const session = await getServerSession(authOptions)

  if (session?.user == null) {
    return null
  }

  const result = await query(
    `
SELECT us.auth_name as created_by_user_name, proj.id as id, process_db_id, current_variant_id, access_group_id, "name" as project_name, description, project_nr, constr_measure, life_time, proj.created as created_at, constr_class_id, editor, is_reference, benchmark_version_id, "password", owner_id, assessment_system_id, din277_version
FROM elca.projects as proj
inner join public.users us on us.id = proj.owner_id 
    WHERE proj.owner_id = $1
    `,
    [session.user.id]
  )

  return result.rows
}

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (session == null) {
    return <UnauthorizedInfo />
  }
  const usersProjects = await getUsersProjects()

  if (usersProjects == null) {
    return <>No projects found</>
  }

  return (
    <div className="mb-4 flex flex-col">
      <h3 className="mb-8 text-2xl font-bold">Your projects</h3>
      <ProjectLinksList projects={usersProjects} />
    </div>
  )
}
export default Page
