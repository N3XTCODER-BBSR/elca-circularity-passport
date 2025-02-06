import { dbDalInstance } from "prisma/queries/dalSingletons"
import { PassportMetadata } from "prisma/queries/db"

export const getPassportsForProjectVariantId = async (projectVariantId: string): Promise<PassportMetadata[]> => {
  const result = await dbDalInstance.getMetaDataForAllPassportsForProjectVariantId(projectVariantId)

  return result
}
