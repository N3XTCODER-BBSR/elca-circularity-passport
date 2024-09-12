import { PrismaClient } from "@prisma/client"
// import { PassportData } from "utils/zod/passportSchema"
import generatePassport from "../../app/[locale]/grp/(utils)/data-schema/versions/v1/passportJsonSeeder"

const prisma = new PrismaClient()

async function main() {
  const passport1PassDataV1 = generatePassport(20, 7)

  await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      uuid: passport1PassDataV1.uuid,
      versionTag: "1",
      passportData: JSON.stringify(passport1PassDataV1),
      issueDate: new Date("2024-04-02"),
      expiryDate: new Date("2029-04-02"),
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
