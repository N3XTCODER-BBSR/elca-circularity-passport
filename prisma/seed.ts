import { PrismaClient } from "@prisma/client"
import { Passport } from "utils/zod/passportSchema"
const prisma = new PrismaClient()
async function main() {
  const passport1PassDataV1: Passport = {
    dataSchemaVersion: "v1",
    passportId: "1",
    versionTag: "1.0.0",
    elcaProjectId: "",
    generatorSoftware: {
      name: "ELCA Passport Generator",
      version: "1.0.0",
      url: "",
    },
    buildingBaseData: {
      buildingStructureId: "UUID-123",
      address: "Mariendorfer Weg 28, 12051 Berlin",
      buildingYear: 2024,
      buildingType: "Bürogebäude",
      numberOfFloors: 8,
      plotArea: "10000 m²",
    },
    buildingComponents: [
      {
        uuid: "UUID-12345",
        name: "Fassade",
        layers: [
          {
            mass: 1000,
            material: {
              uuid: "UUID-12345",
              description: "Beton C30/37",
              materialReferenceDatabase: {
                name: "Ökobau.dat",
                version: "2021",
                url: "https://www.oekobaudat.de/",
              },
            },
            circularity: {
              interferingSubstances: [
                {
                  name: "Stahl",
                  description: "Stahl",
                  category: "Metall",
                  subCategory: "Stahl",
                  resource: "Metall",
                  resourceCategory: "Metall",
                  resourceSubCategory: "Stahl",
                  resourceUnit: "kg",
                  resourceUnitValue: 1,
                  resourceUnitConversion: 1,
                  resourceUnitConversionValue: 1,
                },
              ],
              circularityIndex: {
                points: 10,
                className: "A",
              },
            },
            pollutants: {
              // Define properties here when they are clear
            },
            ressources: {
              rmiMineralKg: "1000",
              rmiMetallic: "1000",
              rmiFossil: "1000",
              rmiForestry: "1000",
              rmiAgrar: "1000",
              rmiAqua: "1000",
            },
            serviceLifeYear: 50,
          },
        ],
      },
    ],
  }

  const passport1 = await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      name: "Passport Demo 1",
      id: "1",
      passportData: JSON.stringify(passport1PassDataV1),
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
