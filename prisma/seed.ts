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
      buildingStructureId: "014061-002-00079/0004",
      address: "Musterstrasse 3, 10203 Berlin",
      buildingYear: 2025,
      buildingType: "9890 - sonstige Gebäude",
      numberOfFloors: 3,
      plotArea: 1500, // Converting plotArea to a number
      nrf: 1067.0,
      bgf: 1210.0,
      bri: 3327.5,
      propertyArea: 1500,
      sealedPropertyAreaProportion: 0.822,
      totalBuildingMass: 9900000,
      dataQuality: "Estimiert",
      queryPlanningDocumentsAvailable: false,
      planningDocuments: "",
      hazardousSubstanceReportAvailable: false,
      assessments: "",
    },
    buildingComponents: [
      {
        uuid: "UUID-12345",
        name: "Fassade",
        layers: [
          {
            buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
            lnr: 0,
            floor: "",
            room: "",
            componentNumber: "7548707",
            componentName: "Kellerboden",
            costGroupDIN276: "324",
            amount: 252,
            componentGeometry: "m2",
            mass: 17.64,
            materialDescription: "PVC Plastisol",
            materialDatabase: "OBD_2020_II_A1",
            serviceLife: 50,
            technicalServiceLife: 50,
            uuidProduct: "",
            productDescription: "",
            manufacturerName: "",
            proofDocument: "",
            versionDate: "",
            wasteCode: "10106",
            circularity: {
              interferingSubstances: [
                // Assuming these are static, can be adjusted as needed
                {
                  // Sample interfering substance
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
          {
            buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1786",
            lnr: 1,
            floor: "",
            room: "",
            componentNumber: "7548707",
            componentName: "Kellerboden",
            costGroupDIN276: "324",
            amount: 252,
            componentGeometry: "m2",
            mass: 24192,
            materialDescription: "Zementestrich",
            materialDatabase: "OBD_2020_II_A2",
            serviceLife: 50,
            technicalServiceLife: 50,
            uuidProduct: "",
            productDescription: "",
            manufacturerName: "",
            proofDocument: "",
            versionDate: "",
            wasteCode: "10105",
            circularity: {
              interferingSubstances: [
                // Assuming these are static, can be adjusted as needed
                {
                  // Sample interfering substance
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
          {
            buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1787",
            lnr: 2,
            floor: "",
            room: "",
            componentNumber: "7548707",
            componentName: "Kellerboden",
            costGroupDIN276: "324",
            amount: 252,
            componentGeometry: "m2",
            mass: 11869.2,
            materialDescription: "Bewehrungsstahl",
            materialDatabase: "OBD_2020_II_A3",
            serviceLife: 50,
            technicalServiceLife: 50,
            uuidProduct: "",
            productDescription: "",
            manufacturerName: "",
            proofDocument: "",
            versionDate: "",
            wasteCode: "10113",
            circularity: {
              interferingSubstances: [
                // Assuming these are static, can be adjusted as needed
                {
                  // Sample interfering substance
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
      id: "1",
      uuid: "UUID-123",
      versionTag: "1",
      passportData: JSON.stringify(passport1PassDataV1),
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
