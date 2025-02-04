import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const DATABASE_POOL_MAX_CONN = process.env.DATABASE_POOL_MAX_CONN || 2
const DATABASE_POOL_TIMEOUT = process.env.DATABASE_POOL_TIMEOUT || 20000
const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://building_passport:password@localhost:65432/building_passport"
const LEGACY_DATABASE_POOL_MAX_CONN = process.env.LEGACY_DATABASE_POOL_MAX_CONN || 2
const LEGACY_DATABASE_POOL_TIMEOUT = process.env.LEGACY_DATABASE_POOL_TIMEOUT || 20000
const LEGACY_DATABASE_URL =
  process.env.ELCA_LEGACY_DATABASE_URL || "postgres://elca_read_only:password@localhost:65433/elca"
const LEGACY_DATABASE_SUPERUSER_FOR_TESTING_POOL_MAX_CONN = 1
const LEGACY_DATABASE_UPERUSER_FOR_TESTING_TIMEOUT = 20000
const LEGACY_DATABASE_SUPERUSER_FOR_TESTING_URL =
  process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING || "postgres://elca:password@localhost:65433/elca"

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
  const url = modifyDatabaseUrl(DATABASE_URL, DATABASE_POOL_MAX_CONN, DATABASE_POOL_TIMEOUT)
  return new PrismaClient({ ...options, datasourceUrl: url })
}

const prismaLegacyClientSingleton = () => {
  const url = modifyDatabaseUrl(LEGACY_DATABASE_URL, LEGACY_DATABASE_POOL_MAX_CONN, LEGACY_DATABASE_POOL_TIMEOUT)
  return new PrismaLegacyClient({ ...options, datasourceUrl: url })
}

const prismaLegacySuperUserClientSingleton = () => {
  const url = modifyDatabaseUrl(
    LEGACY_DATABASE_SUPERUSER_FOR_TESTING_URL,
    LEGACY_DATABASE_SUPERUSER_FOR_TESTING_POOL_MAX_CONN,
    LEGACY_DATABASE_UPERUSER_FOR_TESTING_TIMEOUT
  )
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
