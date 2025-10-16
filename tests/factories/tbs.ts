import { prisma } from "prisma/prismaClient"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"

export async function ensureRelease(uuid: string, tag = "test-tag") {
  await prisma.tBS_Release.upsert({ where: { uuid }, update: {}, create: { uuid, tag } })
}

export async function createEolCategory(name: string, releaseUuid: string) {
  const existing = await prisma.tBs_ProductDefinitionEOLCategory.findFirst({ where: { name } })
  if (existing) return existing.id

  const created = await prisma.tBs_ProductDefinitionEOLCategory.create({
    data: {
      name,
      eolScenarioUnbuiltReal: TBs_ProductDefinitionEOLCategoryScenario.WV,
      eolScenarioUnbuiltPotential: TBs_ProductDefinitionEOLCategoryScenario.WV,
      technologyFactor: 0.5,
      release: { connect: { uuid: releaseUuid } },
    },
  })
  return created.id
}

export async function createProduct(name: string, eolCategoryId: number, processCategoryNumber: string | null) {
  return prisma.tBs_ProductDefinition.create({
    data: {
      name,
      processCategoryNumber,
      tBs_ProductDefinitionEOLCategoryId: eolCategoryId,
    },
  })
}
