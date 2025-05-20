import { prisma } from "../prismaClient"

export async function cleanupTbsProductDefinitionDuplicates() {
  await prisma.$transaction(async (tx) => {
    // 1. Fetch all products
    const allProducts = await tx.tBs_ProductDefinition.findMany({
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

    // 4. Update UserEnrichedProductData to point to canonical IDs
    for (const [dupeIdStr, canonicalId] of Object.entries(dupeToCanonical)) {
      const dupeId = Number(dupeIdStr)
      await tx.userEnrichedProductData.updateMany({
        where: { tBaustoffProductDefinitionId: dupeId },
        data: { tBaustoffProductDefinitionId: canonicalId },
      })
    }

    // 5. Update tBs_OekobaudatMapping to point to canonical IDs
    for (const [dupeIdStr, canonicalId] of Object.entries(dupeToCanonical)) {
      const dupeId = Number(dupeIdStr)
      await tx.tBs_OekobaudatMapping.updateMany({
        where: { tBs_productId: dupeId },
        data: { tBs_productId: canonicalId },
      })
    }

    // 6. Delete duplicate entries in tBs_OekobaudatMapping (ensure no more references to duplicates)
    await tx.tBs_OekobaudatMapping.deleteMany({
      where: { tBs_productId: { in: dupeIds } },
    })

    // 7. Delete duplicate entries in tBs_ProductDefinition
    await tx.tBs_ProductDefinition.deleteMany({
      where: { id: { in: dupeIds } },
    })
  })

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
