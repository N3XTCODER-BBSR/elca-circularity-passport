import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const modifyDatabaseUrl = (urlString: string | undefined): string | undefined => {
  if (!urlString) return undefined

  try {
    const url = new URL(urlString)
    const searchParams = url.searchParams

    if (process.env.DATABASE_POOL_MAX_CONN) {
      searchParams.set("connection_limit", process.env.DATABASE_POOL_MAX_CONN)
    }
    if (process.env.DATABASE_POOL_TIMEOUT) {
      searchParams.set("pool_timeout", process.env.DATABASE_POOL_TIMEOUT)
    }

    url.search = searchParams.toString()

    return url.toString()
  } catch (error) {
    console.error("Error modifying database URL:", error)
    return undefined
  }
}

const options: Prisma.PrismaClientOptions | undefined =
  process.env.NODE_ENV === "development" ? { log: ["query"] } : undefined

const prismaClientSingleton = () => {
  const url = modifyDatabaseUrl(process.env.DATABASE_URL)
  return new PrismaClient({ ...options, datasourceUrl: url })
}

const prismaLegacyClientSingleton = () => {
  const url = modifyDatabaseUrl(process.env.ELCA_LEGACY_DATABASE_URL)
  return new PrismaLegacyClient({ ...options, datasourceUrl: url })
}

const prismaLegacySuperUserClientSingleton = () => {
  const url = modifyDatabaseUrl(process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING)
  return new PrismaLegacyClient({
    ...options,
    datasourceUrl: url,
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
