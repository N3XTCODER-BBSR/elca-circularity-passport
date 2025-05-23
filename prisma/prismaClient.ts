/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { Prisma, PrismaClient } from "./generated/client"
import { PrismaClient as PrismaLegacyClient } from "./generated/client-legacy"

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton>
  var prismaLegacyGlobal: ReturnType<typeof prismaLegacyClientSingleton>
  var prismaLegacyGlobalSuperUser: ReturnType<typeof prismaLegacySuperUserClientSingleton>
}

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
    throw new Error(`Error modifying database URL: ${error}`)
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

  const prismaLegacyClient = new PrismaLegacyClient({ ...options, datasourceUrl: url }).$extends({
    query: {
      $executeRaw: () => {
        throw new Error("Write operations are not allowed")
      },
      $queryRaw: ({ args, query }) => {
        const isHealthCheck = args.strings.includes("SELECT 1") && args.strings.length === 1

        if (isHealthCheck) {
          return query(args)
        }

        throw new Error("Write operations are not allowed")
      },
      $executeRawUnsafe: () => {
        throw new Error("Write operations are not allowed")
      },
      $queryRawUnsafe: () => {
        throw new Error("Write operations are not allowed")
      },
      $allModels: {
        $allOperations: ({ query, args, operation }) => {
          const allWriteOperations = [
            "create",
            "createMany",
            "createManyAndReturn",
            "update",
            "updateMany",
            "updateManyAndReturn",
            "upsert",
            "delete",
            "deleteMany",
          ]

          if (allWriteOperations.includes(operation)) {
            throw new Error("Write operations are not allowed")
          }

          return query(args)
        },
      },
    },
  })
  return prismaLegacyClient
}

const prismaLegacySuperUserClientSingleton = () => {
  return new PrismaLegacyClient({
    ...options,
    datasourceUrl: legacyDatabaseUrlSuperUser,
  })
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
const prismaLegacy = globalThis.prismaLegacyGlobal ?? prismaLegacyClientSingleton()
const prismaLegacySuperUser = globalThis.prismaLegacyGlobalSuperUser ?? prismaLegacySuperUserClientSingleton()

export { prisma, prismaLegacy, prismaLegacySuperUser }

globalThis.prismaGlobal = prisma
globalThis.prismaLegacyGlobal = prismaLegacy
globalThis.prismaLegacyGlobalSuperUser = prismaLegacySuperUser
