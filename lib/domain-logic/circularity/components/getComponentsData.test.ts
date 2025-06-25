import { PrismaClient } from "prisma/generated/client"
import { createTBsProductDefinition, truncateTBsProductDefinition } from "prisma/queries/testUtils"
import { getAvailableTBaustoffProducts } from "./getComponentsData"

const prisma = new PrismaClient()

describe("getAvailableTBaustoffProducts", () => {
  // Clean up after each test
  afterEach(async () => {
    await truncateTBsProductDefinition()
  })

  beforeEach(async () => {
    await truncateTBsProductDefinition()
  })

  it("should return the processCategoryNumber for seeded products", async () => {
    // Create test products
    await Promise.all([
      createTBsProductDefinition(1, "Acetyliertes Holz (1 m3, 510 kg/m3)", "3.5"),
      createTBsProductDefinition(2, "Zement (CEM IV 42,5)", "1.1"),
      createTBsProductDefinition(3, "Zementestrich", "1.4"),
      createTBsProductDefinition(4, "Zinkbleche", null),
    ])

    const products = await getAvailableTBaustoffProducts()
    const findProduct = (name: string) => products.find((p) => p.name === name)

    // Test each product
    expect(findProduct("Acetyliertes Holz (1 m3, 510 kg/m3)")?.processCategoryNumber).toBe("3.5")
    expect(findProduct("Zement (CEM IV 42,5)")?.processCategoryNumber).toBe("1.1")
    expect(findProduct("Zementestrich")?.processCategoryNumber).toBe("1.4")
  })

  it("should return null or empty string for processCategoryNumber if not set (Zinkbleche)", async () => {
    // Create test product with null processCategoryNumber
    await createTBsProductDefinition(4, "Zinkbleche", null)
    const products = await getAvailableTBaustoffProducts()
    const findProduct = (name: string) => products.find((p) => p.name === name)
    const zinkblecheCategory = findProduct("Zinkbleche")?.processCategoryNumber
    expect(zinkblecheCategory === null || zinkblecheCategory === "").toBe(true)
  })
})
