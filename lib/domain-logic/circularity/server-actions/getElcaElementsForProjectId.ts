import { prismaLegacy } from "prisma/prismaClient"

export type ElcaProjectElementRow = {
  element_uuid: string
  element_name: string
  project_variant_id: string
  din_code: string
}

// TODO: Switch to project-variant here
export const getElcaElementsForProjectId = async (
  projectId: string,
  userId: string
): Promise<ElcaProjectElementRow[]> => {
  const projectElements = await fetchElcaProjectElementsByProjectIdAndUserId(projectId, userId)

  return projectElements
}

// Other functions remain the same but with adjusted types where necessary
async function fetchElcaProjectElementsByProjectIdAndUserId(
  projectId: string,
  userId: string
): Promise<ElcaProjectElementRow[]> {
  const result = await prismaLegacy.elca_elements.findMany({
    where: {
      project_variants: {
        projects_project_variants_project_idToprojects: {
          id: Number(projectId),
          owner_id: Number(userId),
        },
      },
    },
    select: {
      uuid: true,
      name: true,
      project_variant_id: true,
      element_types: {
        select: {
          din_code: true,
        },
      },
    },
  })

  // TODO: ideally also add project-variant id/uuid here to ensure correctness
  // const result = await query(
  //   `
  //   select
  //   element.uuid AS element_uuid,
  //   element.name as element_name,
  //   element.project_variant_id,
  //   element_type.din_code AS din_code
  //   FROM elca.elements element
  //   JOIN elca.project_variants project_variant ON project_variant.id = element.project_variant_id
  //   JOIN elca.projects project ON project.current_variant_id = project_variant.id
  //   JOIN elca.element_types element_type ON element_type.node_id = element.element_type_node_id
  //   -- join public."groups" groups on groups.id = element.access_group_id
  //   --join public.group_members group_member on group_member.group_id = groups.id
  //   WHERE project.id = $1 and project.owner_id = $2 --and group_member.user_id = $2
  // `,
  //   [projectId, userId]
  // )

  const mappedResult: ElcaProjectElementRow[] = result.map((element) => ({
    element_uuid: element.uuid,
    element_name: element.name,
    project_variant_id: String(element.project_variant_id),
    din_code: String(element.element_types || ""),
  }))

  return mappedResult as ElcaProjectElementRow[]
}
