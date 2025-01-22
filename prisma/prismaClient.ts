import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const options: Prisma.PrismaClientOptions | undefined =
  process.env.NODE_ENV === "development" ? { log: ["query"] } : undefined

const modifyDatabaseUrlWithLimit = (url: string | undefined, limit: number): string => {
  if (!url) {
    throw new Error("Database URL is undefined. Please provide a valid connection string.")
  }
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}connection_limit=${limit}`
}

const prismaClientSingleton = () => {
  const url = modifyDatabaseUrlWithLimit(
    process.env.DATABASE_URL,
    process.env.POOL_MAX_CONN ? parseInt(process.env.POOL_MAX_CONN) : 5
  )
  console.log(`Connecting to database: ${url}`)
  return new PrismaClient({ ...options, datasourceUrl: url })
}

const prismaLegacyClientSingleton = () => {
  const url = modifyDatabaseUrlWithLimit(
    process.env.ELCA_LEGACY_DATABASE_URL,
    process.env.POOL_MAX_CONN ? parseInt(process.env.POOL_MAX_CONN) : 5
  )
  console.log(`Connecting to database: ${url}`)
  return new PrismaLegacyClient({ ...options, datasourceUrl: url })
}

const prismaLegacySuperUserClientSingleton = () => {
  return new PrismaLegacyClient({
    ...options,
    datasourceUrl: process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING,
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
  prismaLegacyGlobal: ReturnType<typeof prismaLegacyClientSingleton>
  prismaLegacyGlobalSuperUser: ReturnType<typeof prismaLegacySuperUserClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
const prismaLegacy = globalThis.prismaLegacyGlobal ?? prismaLegacyClientSingleton()
const prismaLegacySuperUser = globalThis.prismaLegacyGlobalSuperUser ?? prismaLegacySuperUserClientSingleton()

export { prisma, prismaLegacy, prismaLegacySuperUser }

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
  globalThis.prismaLegacyGlobal = prismaLegacy
  globalThis.prismaLegacyGlobalSuperUser = prismaLegacySuperUser
}
