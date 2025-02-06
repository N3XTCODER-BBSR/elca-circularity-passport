import generatePassport from "../../lib/domain-logic/grp/data-schema/versions/v1/passportJsonSeeder"
import { prisma } from "../prismaClient" // needs to be relative path

const seedPassport = async () => {
  const passport1PassDataV1 = generatePassport(20, 7)

  await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      uuid: passport1PassDataV1.uuid,
      projectVariantId: "1",
      versionTag: "1",
      passportData: JSON.stringify(passport1PassDataV1),
      issueDate: new Date("2024-04-02"),
      expiryDate: new Date("2029-04-02"),
    },
  })
}

async function main() {
  if (process.env.SEED_DEMO_DATA !== "true") {
    console.log('env variable "SEED_DEMO_DATA" not set to "true" - will abort demo seeding...')
    return
  }

  try {
    await seedPassport()
    console.log("Demo data seeding completed successfully.")
  } catch (error) {
    console.error("Error during demo data seeding:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
