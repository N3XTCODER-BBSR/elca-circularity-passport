import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const DATABASE_POOL_MAX_CONN = process.env.DATABASE_POOL_MAX_CONN
const DATABASE_POOL_TIMEOUT = process.env.DATABASE_POOL_TIMEOUT
const DATABASE_URL = process.env.DATABASE_URL
const LEGACY_DATABASE_POOL_MAX_CONN = process.env.LEGACY_DATABASE_POOL_MAX_CONN
const LEGACY_DATABASE_POOL_TIMEOUT = process.env.LEGACY_DATABASE_POOL_TIMEOUT
const LEGACY_DATABASE_URL = process.env.ELCA_LEGACY_DATABASE_URL
const LEGACY_DATABASE_SUPERUSER_FOR_TESTING_POOL_MAX_CONN = 1
const LEGACY_DATABASE_UPERUSER_FOR_TESTING_TIMEOUT = 20000
const LEGACY_DATABASE_SUPERUSER_FOR_TESTING_URL = process.env.ELCA_LEGACY_DATABASE_URL_SUPERUSER_FOR_TESTING

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
  const url = modifyDatabaseUrl(DATABASE_URL as string, Number(DATABASE_POOL_MAX_CONN), Number(DATABASE_POOL_TIMEOUT))
  return new PrismaClient({ ...options, datasourceUrl: url })
}

const prismaLegacyClientSingleton = () => {
  const url = modifyDatabaseUrl(
    LEGACY_DATABASE_URL as string,
    Number(LEGACY_DATABASE_POOL_MAX_CONN),
    Number(LEGACY_DATABASE_POOL_TIMEOUT)
  )
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
