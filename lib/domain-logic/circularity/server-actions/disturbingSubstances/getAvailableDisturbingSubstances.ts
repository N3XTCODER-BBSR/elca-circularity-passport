import { DisturbingSubstanceClassId } from "prisma/generated/client"
import { prisma } from "prisma/prismaClient"

export async function getDisturbingSubstanceIdByClassId(classId: DisturbingSubstanceClassId): Promise<number> {
  const substance = await prisma.disturbingSubstanceSelection.findFirst({
    where: { disturbingSubstanceClassId: classId },
  })
  if (!substance) {
    throw new Error(`Disturbing substance with class ${classId} not found`)
  }
  return substance.id
}
