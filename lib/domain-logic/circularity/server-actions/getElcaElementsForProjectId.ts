import { getComponentsByVariantId } from "prisma/queries/legacyDb"

export type ElcaProjectElementRow = {
  element_uuid: string
  element_name: string
  din_code: string
}

export const getElcaElementsForVariantId = async (variantId: number, projectId: number) => {
  // TODO: ideally also add project-variant id/uuid here to ensure correctness
  const result = await getComponentsByVariantId(variantId, projectId)

  return result.map<ElcaProjectElementRow>((element) => {
    const dinCode = element.element_types?.din_code === null ? "" : String(element.element_types?.din_code)

    return {
      element_uuid: element.uuid,
      element_name: element.name,
      din_code: dinCode,
    }
  })
}
