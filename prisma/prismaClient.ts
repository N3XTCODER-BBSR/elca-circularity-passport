import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const options: Prisma.PrismaClientOptions | undefined =
  process.env.NODE_ENV === "development" ? { log: ["query"] } : undefined

const prismaClientSingleton = () => {
  return new PrismaClient({ ...options, datasourceUrl: process.env.DATABASE_URL })
}

const prismaLegacyClientSingleton = () => {
  return new PrismaLegacyClient({ ...options, datasourceUrl: process.env.ELCA_LEGACY_DATABASE_URL })
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
