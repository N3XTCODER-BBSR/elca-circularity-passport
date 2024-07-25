import { PrismaClient } from "@prisma/client"
import { PassportData } from "utils/zod/passportSchema"
import generatePassport from "./passportJsonSeeder"

const prisma = new PrismaClient()

async function main() {
  // const passport1PassDataV1: PassportData = {
  //   dataSchemaVersion: "v1",
  //   uuid: "42d42e5b-5340-4657",
  //   versionTag: "1.0.0",
  //   elcaProjectId: "",
  //   generatorSoftware: {
  //     name: "ELCA Passport Generator",
  //     version: "1.0.0",
  //     url: "",
  //   },
  //   buildingBaseData: {
  //     buildingStructureId: "014061-002-00079/0004",
  //     address: "Musterstrasse 3, 10203 Berlin",
  //     buildingYear: 2025,
  //     buildingType: "9890 - sonstige Gebäude",
  //     numberOfFloors: 3,
  //     plotArea: 1500, // Converting plotArea to a number
  //     nrf: 1067.0,
  //     bgf: 1210.0,
  //     bri: 3327.5,
  //     propertyArea: 1500,
  //     sealedPropertyAreaProportion: 0.822,
  //     totalBuildingMass: 9900000,
  //     dataQuality: "Estimiert",
  //     queryPlanningDocumentsAvailable: false,
  //     planningDocuments: "",
  //     hazardousSubstanceReportAvailable: false,
  //     assessments: "",
  //   },
  //   buildingComponents: [
  //     {
  //       uuid: "7548707",
  //       name: "Kellerboden",
  //       categoryName: "Gründung",
  //       costGroupCategory: 320,
  //       costGroupDIN276: 324,
  //       layers: [
  //         {
  //           // buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
  //           lnr: 0,
  //           floor: "",
  //           room: "",
  //           amount: 252,
  //           componentGeometry: "m2",
  //           mass: 17.64,
  //           materialDescription: "Metalle",
  //           materialDatabase: "OBD_2020_II_A1",
  //           serviceLife: 50,
  //           technicalServiceLife: 50,
  //           uuidProduct: "",
  //           productDescription: "",
  //           manufacturerName: "",
  //           proofDocument: "",
  //           versionDate: "",
  //           wasteCode: "10106",
  //           circularity: {
  //             interferingSubstances: [
  //               // Assuming these are static, can be adjusted as needed
  //               {
  //                 // Sample interfering substance
  //               },
  //             ],
  //             eol: {
  //               points: -91,
  //               className: "A",
  //             },
  //           },
  //           pollutants: {
  //             // Define properties here when they are clear
  //           },
  //           ressources: {
  //             rmiMineral: 100,
  //             rmiMetallic: 2000,
  //             rmiFossil: 300,
  //             rmiForestry: 4000,
  //             rmiAgrar: 500,
  //             rmiAqua: 6000,
  //             gwpAB6C: 700,
  //             penrtAB6C: 8000
  //           },
  //           serviceLifeYear: 50,
  //         },
  //         {
  //           // buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1786",
  //           lnr: 1,
  //           floor: "",
  //           room: "",
  //           amount: 252,
  //           componentGeometry: "m2",
  //           mass: 241,
  //           materialDescription: "Zementestrich",
  //           materialDatabase: "OBD_2020_II_A2",
  //           serviceLife: 50,
  //           technicalServiceLife: 50,
  //           uuidProduct: "",
  //           productDescription: "",
  //           manufacturerName: "",
  //           proofDocument: "",
  //           versionDate: "",
  //           wasteCode: "10105",
  //           circularity: {
  //             interferingSubstances: [
  //               // Assuming these are static, can be adjusted as needed
  //               {
  //                 // Sample interfering substance
  //               },
  //             ],
  //             eol: {
  //               points: 22,
  //               className: "A",
  //             },
  //           },
  //           pollutants: {
  //             // Define properties here when they are clear
  //           },
  //           ressources: {
  //             rmiMineral: 8000,
  //             rmiMetallic: 900,
  //             rmiFossil: 1000,
  //             rmiForestry: 110,
  //             rmiAgrar: 1200,
  //             rmiAqua: 130,
  //             gwpAB6C: 1400,
  //             penrtAB6C: 150
  //           },
  //           serviceLifeYear: 50,
  //         },
  //       ],
  //     },

  //     {
  //       uuid: "2847502",
  //       name: "Innenwand tragend",
  //       categoryName: "Innenwände",
  //       costGroupCategory: 340, // GROUP BY THIS FIELD
  //       costGroupDIN276: 341,
  //       layers: [
  //         {
  //           buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
  //           lnr: 0,
  //           floor: "",
  //           room: "",
  //           amount: 752,
  //           componentGeometry: "m2",
  //           mass: 37.64, // AGGREGATE THIS
  //           materialDescription: "Mineralische Bauprodukte",
  //           materialDatabase: "OBD_2020_II_A1",
  //           serviceLife: 50,
  //           technicalServiceLife: 50,
  //           uuidProduct: "",
  //           productDescription: "",
  //           manufacturerName: "",
  //           proofDocument: "",
  //           versionDate: "",
  //           wasteCode: "10106",
  //           circularity: {
  //             interferingSubstances: [
  //               // Assuming these are static, can be adjusted as needed
  //               {
  //                 // Sample interfering substance
  //               },
  //             ],
  //             eol: {
  //               points: 33,
  //               className: "A",
  //             },
  //           },
  //           pollutants: {
  //             // Define properties here when they are clear
  //           },
  //           ressources: {
  //             rmiMineral: 1000,
  //             rmiMetallic: 1000,
  //             rmiFossil: 1000,
  //             rmiForestry: 1000,
  //             rmiAgrar: 1000,
  //             rmiAqua: 1000,
  //             gwpAB6C: 1000,
  //             penrtAB6C: 1000
  //           },
  //           serviceLifeYear: 50,
  //         },
  //       ],
  //     },

  //     {
  //       uuid: "2847502",
  //       name: "Außenwand N",
  //       categoryName: "Außenwände",
  //       costGroupCategory: 330,
  //       costGroupDIN276: 331,
  //       layers: [
  //         {
  //           buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
  //           lnr: 0,
  //           floor: "",
  //           room: "",
  //           amount: 752,
  //           componentGeometry: "m2",
  //           mass: 29.42,
  //           materialDescription: "Mineralische Bauprodukte",
  //           materialDatabase: "OBD_2020_II_A1",
  //           serviceLife: 50,
  //           technicalServiceLife: 50,
  //           uuidProduct: "",
  //           productDescription: "",
  //           manufacturerName: "",
  //           proofDocument: "",
  //           versionDate: "",
  //           wasteCode: "10106",
  //           circularity: {
  //             interferingSubstances: [
  //               // Assuming these are static, can be adjusted as needed
  //               {
  //                 // Sample interfering substance
  //               },
  //             ],
  //             eol: {
  //               points: 44,
  //               className: "A",
  //             },
  //           },
  //           pollutants: {
  //             // Define properties here when they are clear
  //           },
  //           ressources: {
  //             rmiMineral: 1000,
  //             rmiMetallic: 1000,
  //             rmiFossil: 1000,
  //             rmiForestry: 1000,
  //             rmiAgrar: 1000,
  //             rmiAqua: 1000,
  //             gwpAB6C: 1000,
  //             penrtAB6C: 1000
  //           },
  //           serviceLifeYear: 50,
  //         },
  //       ],
  //     },
  //   ],
  // }

  const passport1PassDataV1 = generatePassport(15, 7)

  const passport1 = await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      uuid: "42d42e5b-5340-4657",
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
