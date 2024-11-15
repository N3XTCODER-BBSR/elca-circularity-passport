import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

const options: Prisma.PrismaClientOptions | undefined =
  process.env.NODE_ENV === "development" ? { log: ["query"] } : undefined

const prismaClientSingleton = () => {
  return new PrismaClient(options)
}

const prismaLegacyClientSingleton = () => {
  return new PrismaLegacyClient(options)
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
  prismaLegacyGlobal: ReturnType<typeof prismaLegacyClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
const prismaLegacy = globalThis.prismaLegacyGlobal ?? prismaLegacyClientSingleton()

export { prisma, prismaLegacy }

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
  globalThis.prismaLegacyGlobal = prismaLegacy
}
