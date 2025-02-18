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
