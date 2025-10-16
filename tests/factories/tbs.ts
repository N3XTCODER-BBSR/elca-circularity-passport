import { randomUUID } from "node:crypto"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import { prisma } from "prisma/prismaClient"

export async function ensureRelease(uuid: string, tag = "test-tag") {
  await prisma.tBS_Release.upsert({ where: { uuid }, update: {}, create: { uuid, tag } })
}

export async function createEolCategory(name: string, releaseUuid: string) {
  const existing = await prisma.tBs_ProductDefinitionEOLCategory.findFirst({ where: { name } })
  if (existing) return existing.id

  const created = await prisma.tBs_ProductDefinitionEOLCategory.create({
    data: {
      uuid: randomUUID(),
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
      uuid: randomUUID(),
      name,
      processCategoryNumber,
      tBs_ProductDefinitionEOLCategoryId: eolCategoryId,
    },
  })
}

export async function createOekobaudatMapping(productId: number, processUuid?: string, releaseUuid?: string) {
  const oebdProcessUuid = processUuid ?? randomUUID()
  const oebdVersionUuid = releaseUuid ?? randomUUID()
  await prisma.tBs_OekobaudatMapping.upsert({
    where: {
      oebd_processUuid_oebd_versionUuid: {
        oebd_processUuid: oebdProcessUuid,
        oebd_versionUuid: oebdVersionUuid,
      },
    },
    update: { tBs_productId: productId },
    create: { oebd_processUuid: oebdProcessUuid, oebd_versionUuid: oebdVersionUuid, tBs_productId: productId },
  })
}
