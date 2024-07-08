import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  const passport1 = await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      name: "Passport Demo 1",
      id: "1",
      passportData: "dasd", 
      buildingYear: 2024,
      buildingStructureId: "UUID-12345",
      buildingType: "Bürogebäude",
      numberOfFloors: 8,
      nrf: "6000 m²",
      bgf: "8600 m²",
      bri: "25500 m³",
      plotArea: "10000 m²",
      percentageOfSealedLandArea: 70,
      totalMassOfBuilding: 20000,
      dataQuality: "geprüft",
      authorName: "Carlos Musterio",
      address: "Mariendorfer Weg 28, 12051 Berlin",
      issueDate: new Date("2024-04-02"),
      expiryDate: new Date("2029-04-02"),
    },
  })
  console.log({ alice: passport1 })
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
