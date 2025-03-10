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
import { prismaLegacy } from "./prismaClient"

describe("read-only operations for prisma legacy client on Prisma client level", () => {
  it("should throw NoWriteDBOperations if an operation is attempted using a raw SQL query", async () => {
    await expect(prismaLegacy.$executeRaw`SELECT * FROM users`).rejects.toThrow("Write operations are not allowed")
  })
  it("should throw NoWriteDBOperations if a write operation is attempted using a transaction query", async () => {
    await expect(
      prismaLegacy.$transaction(async (tx) => {
        await tx.users.create({
          data: {
            auth_name: "test",
            group_id: 1,
            auth_key: "$1$6a7aabf1$tHpd7.FjG03D18kbREnsa1", // hashed "password1!"
          },
        })
      })
    ).rejects.toThrow("Write operations are not allowed")
  })
  it("should throw NoWriteDbOperations if a write operation is attempted using Prisma DSL", async () => {
    await expect(
      prismaLegacy.users.create({
        data: {
          auth_name: "test",
          group_id: 1,
          auth_key: "$1$6a7aabf1$tHpd7.FjG03D18kbREnsa1", // hashed "password1!"
        },
      })
    ).rejects.toThrow("Write operations are not allowed")
  })
  it("should return the resource if a read operation is attempted using wrapped in a transaction", async () => {
    const user = await prismaLegacy.$transaction(async (tx) => {
      return tx.users.findUnique({ where: { id: 1 } })
    })

    expect(user).not.toBeNull()
  })
})
