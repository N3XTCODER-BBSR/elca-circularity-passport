import prisma from "prisma/prismaClient"

export const getAvailableTBaustoffProducts = async (): Promise<{ id: number; name: string }[]> => {
  const tBaustoffProducts = await prisma.tBs_ProductDefinition.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return tBaustoffProducts
}
