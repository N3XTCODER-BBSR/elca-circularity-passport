import { getMetaDataForAllPassportsForProjectVariantId, PassportMetadata } from "prisma/queries/db"

export const getPassportsForProjectVariantId = async (projectVariantId: number): Promise<PassportMetadata[]> => {
  const result = await getMetaDataForAllPassportsForProjectVariantId(String(projectVariantId))

  return result
}
