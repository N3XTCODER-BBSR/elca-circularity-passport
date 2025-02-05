import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const databasePoolMaxConn = Number(process.env.DATABASE_POOL_MAX_CONN)
const databasePoolTimeout = Number(process.env.DATABASE_POOL_TIMEOUT)
const databaseUrl = process.env.DATABASE_URL || ""
const legacyDatabasePoolMaxConn = Number(process.env.LEGACY_DATABASE_POOL_MAX_CONN)
const legacyDatabasePoolTimeout = Number(process.env.LEGACY_DATABASE_POOL_TIMEOUT)
const legacyDatabaseUrl = process.env.ELCA_LEGACY_DATABASE_URL || ""
const legacyDatabaseUrlSuperUser = process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING || ""

const modifyDatabaseUrl = (urlString: string, maxConnection: number, timeOut: number): string => {
  try {
    const url = new URL(urlString)
    const searchParams = url.searchParams

    searchParams.set("connection_limit", maxConnection.toString())
    searchParams.set("pool_timeout", timeOut.toString())

    url.search = searchParams.toString()

    return url.toString()
  } catch (error) {
    throw new Error(`Error modifying database URL: ${urlString}\n${error}`)
  }
}

const options: Prisma.PrismaClientOptions | undefined =
  process.env.NODE_ENV === "development" ? { log: ["query"] } : undefined

const prismaClientSingleton = () => {
  const url = modifyDatabaseUrl(databaseUrl, databasePoolMaxConn, databasePoolTimeout)
  return new PrismaClient({ ...options, datasourceUrl: url })
}

const prismaLegacyClientSingleton = () => {
  const url = modifyDatabaseUrl(legacyDatabaseUrl, legacyDatabasePoolMaxConn, legacyDatabasePoolTimeout)
  return new PrismaLegacyClient({ ...options, datasourceUrl: url })
}

const prismaLegacySuperUserClientSingleton = () => {
  return new PrismaLegacyClient({
    ...options,
    datasourceUrl: legacyDatabaseUrlSuperUser,
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
