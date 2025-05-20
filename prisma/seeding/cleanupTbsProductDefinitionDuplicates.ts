import { prisma } from "../prismaClient"

export async function cleanupTbsProductDefinitionDuplicates() {
  // 1. Fetch all products (outside transaction)
  const allProducts = await prisma.tBs_ProductDefinition.findMany({
    orderBy: { id: "asc" },
  })

  // 2. Group by name, version, and category
  const productGroups: Record<string, number[]> = {}
  for (const p of allProducts) {
    const key = `${p.name}__${p.tBs_version}__${p.tBs_ProductDefinitionEOLCategoryId}`
    if (!productGroups[key]) productGroups[key] = []
    productGroups[key].push(p.id)
  }

  // 3. Map duplicate IDs to canonical ID
  const dupeToCanonical: Record<number, number> = {}
  for (const ids of Object.values(productGroups)) {
    const canonicalId = Math.min(...ids)
    for (const id of ids) {
      if (id !== canonicalId) dupeToCanonical[id] = canonicalId
    }
  }

  const dupeIds = Object.keys(dupeToCanonical).map(Number)

  // 4. Prepare updateMany operations
  const updateUserEnrichedOps = Object.entries(dupeToCanonical).map(([dupeIdStr, canonicalId]) =>
    prisma.userEnrichedProductData.updateMany({
      where: { tBaustoffProductDefinitionId: Number(dupeIdStr) },
      data: { tBaustoffProductDefinitionId: canonicalId },
    })
  )
  const updateOekobaudatMappingOps = Object.entries(dupeToCanonical).map(([dupeIdStr, canonicalId]) =>
    prisma.tBs_OekobaudatMapping.updateMany({
      where: { tBs_productId: Number(dupeIdStr) },
      data: { tBs_productId: canonicalId },
    })
  )

  // 5. Run all DB changes in a single transaction
  await prisma.$transaction([
    ...updateUserEnrichedOps,
    ...updateOekobaudatMappingOps,
    prisma.tBs_OekobaudatMapping.deleteMany({
      where: { tBs_productId: { in: dupeIds } },
    }),
    prisma.tBs_ProductDefinition.deleteMany({
      where: { id: { in: dupeIds } },
    }),
  ])

  console.log("Cleanup completed.")
}

// CLI entry point
if (require.main === module) {
  cleanupTbsProductDefinitionDuplicates()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
