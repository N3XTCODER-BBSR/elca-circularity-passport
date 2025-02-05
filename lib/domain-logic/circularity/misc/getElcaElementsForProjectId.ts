import { legacyDbDalInstance } from "prisma/queries/dalSingletons"

export type ElcaProjectElementRow = {
  element_uuid: string
  element_name: string
  din_code: string
}

export const getElcaElementsForVariantId = async (variantId: number, projectId: number) => {
  const result = await legacyDbDalInstance.getComponentsByVariantId(variantId, projectId)

  return result.map<ElcaProjectElementRow>((element) => {
    const dinCode = element.element_types?.din_code === null ? "" : String(element.element_types?.din_code)

    return {
      element_uuid: element.uuid,
      element_name: element.name,
      din_code: dinCode,
    }
  })
}
