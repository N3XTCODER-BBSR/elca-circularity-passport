/**
 * @jest-environment node
 */
/**
 * HTTP-level tests for products endpoint using in-process Next server.
 */
import type { StartedTestContainer } from "testcontainers"
import { setupPassportTestDB } from "tests/setUpDbs"
import { type StartedNextServer, startNextForTests } from "./nextServer"

let server: StartedNextServer
let dbContainer: StartedTestContainer
let ensureRelease: (uuid: string, tag?: string) => Promise<void>
let createEolCategory: (name: string, releaseUuid: string) => Promise<number>
let createProduct: (name: string, eolCategoryId: number, processCategoryNumber: string | null) => Promise<any>
let createOekobaudatMapping: (productId: number, processUuid?: string, releaseUuid?: string) => Promise<void>

describe("GET /api/(tb-api)/v1/releases/:releaseUuid/products", () => {
  beforeAll(async () => {
    // start Postgres test DB and set DATABASE_URL env
    const { container, dbUrl } = await setupPassportTestDB()
    dbContainer = container
    process.env.DATABASE_URL = dbUrl

    // start Next server in-process with DB env so app connects to containerized DB
    server = await startNextForTests({ DATABASE_URL: dbUrl })

    // import factories AFTER DATABASE_URL is set to ensure prisma connects to test DB
    const factories = await import("tests/factories/tbs")
    ensureRelease = factories.ensureRelease
    createEolCategory = factories.createEolCategory
    createProduct = factories.createProduct
    createOekobaudatMapping = factories.createOekobaudatMapping
  }, 120_000)

  afterAll(async () => {
    if (server) await server.close()
    if (dbContainer) await dbContainer.stop()
  })

  test("false releaseUuid -> 404", async () => {
    const url = `${server.url}/api/v1/releases/nonexistent-release/products`
    const resp = await fetch(url)
    expect(resp.status).toBe(404)
  })

  test("valid releaseUuid -> 200 + JSON", async () => {
    const releaseUuid = "release-xyz"
    await ensureRelease(releaseUuid)
    const eolId = await createEolCategory("EOL-A", releaseUuid)
    const product = await createProduct("Product A", eolId, "1.2.3")
    await createOekobaudatMapping(product.id)

    const url = `${server.url}/api/v1/releases/${releaseUuid}/products`
    const resp = await fetch(url)
    expect(resp.status).toBe(200)
    type ProductsResponse = { data: unknown[] }
    const json = (await resp.json()) as ProductsResponse
    expect(json).toHaveProperty("data")
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data.length).toBeGreaterThan(0)
  })

  test("test data structure", async () => {
    const releaseUuid = "release-xyz"
    const url = `${server.url}/api/v1/releases/${releaseUuid}/products`
    const resp = await fetch(url)
    expect(resp.status).toBe(200)
    const json = (await resp.json()) as { data: any[] }
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data.length).toBeGreaterThan(0)
    const item = json.data[0]

    console.log(item)

    // Product keys
    expect(item).toHaveProperty("uuid")
    expect(typeof item.uuid).toBe("string")
    expect(item).toHaveProperty("releaseUuid")
    expect(typeof item.releaseUuid).toBe("string")
    expect(item).toHaveProperty("name")
    expect(typeof item.name).toBe("string")

    // OekobaudatMapping array
    expect(item).toHaveProperty("oekobaudatMappings")
    expect(Array.isArray(item.oekobaudatMappings)).toBe(true)

    // EOLCategory object or null; if present, check required keys
    expect(item).toHaveProperty("eolCategory")
    expect(item.eolCategory).toHaveProperty("name")
    expect(item.eolCategory).toHaveProperty("categoryUuid")
    expect(item.eolCategory).toHaveProperty("eolScenarioUnbuiltReal")
    expect(item.eolCategory).toHaveProperty("eolScenarioUnbuiltPotential")
    expect(item.eolCategory).toHaveProperty("technologyFactor")
  })

  test("single product data structure", async () => {
    const releaseUuid = "release-xyz"
    // seed a second product to fetch directly
    const eolId = await createEolCategory("EOL-B", releaseUuid)
    const product = await createProduct("Product B", eolId, null)
    await createOekobaudatMapping(product.id)

    const url = `${server.url}/api/v1/releases/${releaseUuid}/products/${product.uuid}`
    const resp = await fetch(url)
    expect(resp.status).toBe(200)
    const json = (await resp.json()) as { data: any }
    const item = json.data

    console.log(item)

    // Product keys
    expect(item).toHaveProperty("uuid")
    expect(typeof item.uuid).toBe("string")
    expect(item).toHaveProperty("releaseUuid")
    expect(typeof item.releaseUuid).toBe("string")
    expect(item).toHaveProperty("name")
    expect(typeof item.name).toBe("string")

    // OekobaudatMapping array
    expect(item).toHaveProperty("oekobaudatMappings")
    expect(Array.isArray(item.oekobaudatMappings)).toBe(true)

    // EOLCategory object
    expect(item).toHaveProperty("eolCategory")
    expect(item.eolCategory).toHaveProperty("name")
    expect(item.eolCategory).toHaveProperty("categoryUuid")
    expect(item.eolCategory).toHaveProperty("eolScenarioUnbuiltReal")
    expect(item.eolCategory).toHaveProperty("eolScenarioUnbuiltPotential")
    expect(item.eolCategory).toHaveProperty("technologyFactor")
  })
})

describe("GET /api/(tb-api)/v1/releases", () => {
  beforeAll(async () => {
    // Ensure Next server and DB are running from previous suite
    if (!server || !dbContainer) {
      const { container, dbUrl } = await setupPassportTestDB()
      dbContainer = container
      process.env.DATABASE_URL = dbUrl
      server = await startNextForTests({ DATABASE_URL: dbUrl })
    }
  }, 120_000)

  afterAll(async () => {
    // Keep teardown managed by the previous suite's afterAll to avoid double-closing
  })

  test("list releases -> 200 + JSON array data", async () => {
    const url = `${server.url}/api/v1/releases`
    const resp = await fetch(url)
    expect(resp.status).toBe(200)
    const json = (await resp.json()) as { data: any[] }
    expect(json).toHaveProperty("data")
    expect(Array.isArray(json.data)).toBe(true)
  })

  test("each item matches basic Release shape", async () => {
    const url = `${server.url}/api/v1/releases`
    const resp = await fetch(url)
    expect(resp.status).toBe(200)
    const json = (await resp.json()) as { data: any[] }
    const item = json.data[0]
    if (item) {
      // Minimal checks derived from the OpenAPI schema
      expect(item).toHaveProperty("uuid")
      expect(typeof item.uuid).toBe("string")
      expect(item).toHaveProperty("tag")
      expect(typeof item.tag === "string" || item.tag == null).toBe(true)
      expect(item).toHaveProperty("createdAt")
      expect(typeof item.createdAt === "string" || item.createdAt == null).toBe(true)
    }
  })
})
