import { getElcaProjectElementsByProjectIdAndUserId } from "prisma/queries/legacyDb"

export type ElcaProjectElementRow = {
  element_uuid: string
  element_name: string
  project_variant_id: string
  din_code: string
}

// TODO: Switch to project-variant here
export const getElcaElementsForProjectId = async (projectId: string, userId: string) => {
  // TODO: ideally also add project-variant id/uuid here to ensure correctness
  const result = await getElcaProjectElementsByProjectIdAndUserId(Number(projectId), Number(userId))

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
