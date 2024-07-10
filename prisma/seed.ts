import fs from 'fs';
import csv from 'csv-parser';

import { PrismaClient } from "@prisma/client"
import { BuildingComponent, Layer, LayerSchema, Passport } from "utils/zod/passportSchema"

// const parseCsv = async (filePath: string): Promise<Layer[]> => {
//   const results: BuildingComponent[] = [];
//   // const buildingComponentsMap: Record<string, BuildingComponent> = {};
//   const layers: Layer[] = [];

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         // Convert CSV row to Layer
//         const layer = LayerSchema.parse({
//           buildingId: data.buildingId,
//           lnr: parseInt(data.lnr, 10),
//           floor: data.floor,
//           room: data.room,
//           componentNumber: data.componentNumber,
//           componentName: data.componentName,
//           costGroupDIN276: data.costGroupDIN276,
//           amount: parseFloat(data.amount),
//           componentGeometry: data.componentGeometry,
//           mass: parseFloat(data.mass),
//           materialDescription: data.materialDescription,
//           materialDatabase: data.materialDatabase,
//           serviceLife: parseInt(data.serviceLife, 10),
//           technicalServiceLife: parseInt(data.technicalServiceLife, 10),
//           uuidProduct: data.uuidProduct,
//           productDescription: data.productDescription,
//           manufacturerName: data.manufacturerName,
//           proofDocument: data.proofDocument,
//           versionDate: data.versionDate,
//           wasteCode: data.wasteCode,
//           circularity: data.circularity ? JSON.parse(data.circularity) : undefined,
//           pollutants: data.pollutants ? JSON.parse(data.pollutants) : undefined,
//           ressources: data.ressources ? JSON.parse(data.ressources) : undefined,
//           serviceLifeYear: data.serviceLifeYear ? parseInt(data.serviceLifeYear, 10) : undefined,
//         });

//         // if (!buildingComponentsMap[data.uuid]) {
//         //   buildingComponentsMap[data.uuid] = {
//         //     id: data.id,
//         //     uuid: data.uuid,
//         //     name: data.name,
//         //     layers: [],
//         //   };
//         // }

//         layers.push(layer);

//         // buildingComponentsMap[data.uuid].layers.push(layer);
//       })
//       .on('end', () => {
//         resolve(Object.values(layers));
//         // resolve(Object.values(buildingComponentsMap));
//       })
//       .on('error', (error) => {
//         reject(error);
//       });
//   });
// }

// // Example usage
// const filePath = './layerSeedingData_2024-07-10.csv';
// parseCsv(filePath)
//   .then((buildingComponents) => {
//     console.log(buildingComponents);
//   })
//   .catch((error) => {
//     console.error('Error parsing CSV:', error);
//   });


const prisma = new PrismaClient()
async function main() {
  const passport1PassDataV1: Passport = {
    dataSchemaVersion: "v1",
    uuid: "42d42e5b-5340-4657",
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
        uuid: "7548707",
        name: "Kellerboden",
        categoryName: "Gründung",
        costGroupCategory: 320,
        costGroupDIN276: 324,
        layers: [
          {
            buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
            lnr: 0,
            floor: "",
            room: "",
            amount: 252,
            componentGeometry: "m2",
            mass: 17.64,
            materialDescription: "Metalle",
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
        ],
      }, 
      
      
      
      
      {
        uuid: "2847502",
        name: "Innenwand tragend",
        categoryName: "Außenwände",
        costGroupCategory: 340, // GROUP BY THIS FIELD
        costGroupDIN276: 341,
        layers: [
          {
            buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
            lnr: 0,
            floor: "",
            room: "",
            amount: 752,
            componentGeometry: "m2",
            mass: 37.64, // AGGREGATE THIS
            materialDescription: "Mineralische Bauprodukte",
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
        ],
      },
      
      {
        uuid: "2847502",
        name: "Außenwand N",
        categoryName: "Außenwände",
        costGroupCategory: 330,
        costGroupDIN276: 331,
        layers: [
          {
            buildingId: "3444a12c-8da3-42b1-88ee-a5d65ade1785",
            lnr: 0,
            floor: "",
            room: "",
            amount: 752,
            componentGeometry: "m2",
            mass: 37.64,
            materialDescription: "Mineralische Bauprodukte",
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
        ],
      },
    ],
  }

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
