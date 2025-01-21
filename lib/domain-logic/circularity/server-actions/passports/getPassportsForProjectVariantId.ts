import { getMetaDataForAllPassportsForProjectVariantId, PassportMetadata } from "prisma/queries/db"

export const getPassportsForProjectVariantId = async (projectVariantId: string): Promise<PassportMetadata[]> => {
  const result = await getMetaDataForAllPassportsForProjectVariantId(projectVariantId)

  return result
}
