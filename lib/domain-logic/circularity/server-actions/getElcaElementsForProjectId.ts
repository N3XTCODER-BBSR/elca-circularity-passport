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
  // TODO: ideally also add project-variant id/uuid here to ensure correctness
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

  return result.map<ElcaProjectElementRow>((element) => {
    const projectVariantId = element.project_variant_id === null ? "" : String(element.project_variant_id)
    const dinCode = element.element_types?.din_code === null ? "" : String(element.element_types?.din_code)

    return {
      element_uuid: element.uuid,
      element_name: element.name,
      project_variant_id: projectVariantId,
      din_code: dinCode,
    }
  })
}
