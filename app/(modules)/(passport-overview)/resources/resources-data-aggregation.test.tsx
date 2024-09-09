import { cloneDeep } from "lodash"
import { BuildingComponent } from "app/(utils)/data-schema/versions/v1/passportSchema"
import { aggregateGwpOrPenrt } from "./resources-data-aggregation"

// describe("Resources aggregation logic", () => {
//   it("should aggregate data correctly", () => {
//     const layerBaseData = {
//       serviceLife: 45,
//       technicalServiceLife: 64,
//       productDescription:
//         "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
//       manufacturerName: "Camara-Urbansky",
//       proofDocument: "Neongelb",
//       versionDate: "2023-12-31T01:13:30.546Z",
//       wasteCode: "Coordinator",
//     }

//     const innenwand1Layer1 = 79
//     const innenwand1Layer2 = 153.2443
//     const innenwand2Layer1 = 1449.1
//     const innenwand2Layer2 = 9876.123

//     const aussenwand1Layer1 = 14.3
//     const aussenwand1Layer2 = 3288.124

//     const buildingNrf = 1000

//     const buildingComponents: BuildingComponent[] = [
//       {
//         uuid: "dfabb2e6-45f4-49c9-b7c4-5f31aa47dbe4",
//         name: "Innenwand tragend",
//         costGroupDIN276: 341,
//         // costGroupCategory: 340,
//         // costGroupCategoryName: "Innenwände",
//         layers: [
//           {
//             ...layerBaseData,
//             index: 8,
//             floor: "Anthrazit",
//             room: "generating",
//             componentGeometry: "m2",
//             mass: innenwand1Layer1,
//             material: {
//               materialClassDescription: "Material xy",
//               materialClassId: "1.3.2",
//               classification: "Holz",
//               materialDatabase: "OBD_2020_II_A1",
//             },
//             uuidProduct: "f3b9803a-e942-44e0-b7c0-c253f92cd6e3",
//           },
//           {
//             ...layerBaseData,
//             index: 10,
//             floor: "Espenweg",
//             room: "Coupe",
//             componentGeometry: "m2",
//             mass: innenwand1Layer2,
//             material: {
//               materialClassDescription: "Beton C25/30 (Normalgewicht)",
//               materialClassId: "1.1.01",
//               classification: "Mineralische Bauprodukte",
//               materialDatabase: "OBD_2020_II_A1",
//             },
//             uuidProduct: "2ed80ab1-2a15-41e5-8d5d-23654593e59a",
//           },
//         ],
//       },
//       {
//         uuid: "dfabb2e6-45f4-49c9-b7c4-5f31aa47dbe4",
//         name: "Innenwand tragend",
//         costGroupDIN276: 341,
//         // costGroupCategory: 340,
//         // costGroupCategoryName: "Innenwände",
//         layers: [
//           {
//             ...layerBaseData,
//             index: 8,
//             floor: "Anthrazit",
//             room: "generating",
//             componentGeometry: "m2",
//             mass: innenwand2Layer1,
//             material: {
//               materialClassDescription: "Kreuzlagenholz (CLT)",
//               materialClassId: "3.4.01",
//               classification: "Holz",
//               materialDatabase: "OBD_2020_II_A1",
//             },
//             uuidProduct: "f3b9803a-e942-44e0-b7c0-c253f92cd6e3",
//           },
//           {
//             ...layerBaseData,
//             index: 10,
//             floor: "Espenweg",
//             room: "Coupe",
//             componentGeometry: "m2",
//             mass: innenwand2Layer2,
//             material: {
//               materialClassDescription: "Beton C25/30 (Normalgewicht)",
//               materialClassId: "1.1.01",
//               classification: "Mineralische Bauprodukte",
//               materialDatabase: "OBD_2020_II_A1",
//             },
//             uuidProduct: "2ed80ab1-2a15-41e5-8d5d-23654593e59a",
//           },
//         ],
//       },
//       {
//         uuid: "78cd6fbb-c6c6-49cb-a1f5-129331005057",
//         name: "Außenwand N",
//         costGroupDIN276: 331,
//         // costGroupCategory: 330,
//         // costGroupCategoryName: "Außenwände",
//         layers: [
//           {
//             ...layerBaseData,
//             index: 6,
//             floor: "West",
//             room: "Rolls",
//             componentGeometry: "m2",
//             mass: aussenwand1Layer1,
//             material: {
//               materialClassDescription: "Mechanische Lüftung mit Wärmerückgewinnung (MVHR)",
//               materialClassId: "8.1.01",
//               classification: "Gebäudetechnik",
//               materialDatabase: "OBD_2020_II_A1",
//             },
//             uuidProduct: "7a40b9c6-b4de-457e-9db2-69ff199eb68e",
//             wasteCode: "enable",
//           },
//           {
//             ...layerBaseData,
//             index: 1,
//             componentGeometry: "m2",
//             mass: aussenwand1Layer2,
//             material: {
//               materialClassDescription: "Mineralwolle-Dämmung",
//               materialClassId: "2.2.01",
//               classification: "Isoliermaterialien",
//               materialDatabase: "OBD_2020_II_A1",
//             },
//             uuidProduct: "c1ef0a6c-e781-4100-9037-c161d83a93bf",
//           },
//         ],
//       },
//     ]

//     // TODO : fix
//     const aggregatedData = aggregateData(buildingComponents, buildingNrf)

//     const expectedInnenwaendeMass = innenwand1Layer1 + innenwand1Layer2 + innenwand2Layer1 + innenwand2Layer2
//     const expectedAussenwaendeMass = aussenwand1Layer1 + aussenwand1Layer2

//     const totalMass = expectedAussenwaendeMass + expectedInnenwaendeMass

//     const expectedInnenwaendeMassPercentage = (expectedInnenwaendeMass / totalMass) * 100
//     const aggregatedForInnenwaende = aggregatedData.aggretatedDataWithPercentageSorted.find(
//       (data) => data.costGroupCategory === 340
//     )
//     expect(aggregatedForInnenwaende?.aggregatedMass).toEqual(expectedInnenwaendeMass)
//     expect(aggregatedForInnenwaende?.aggregatedMassPercentage).toEqual(expectedInnenwaendeMassPercentage)

//     const expectedAussenwaendeMassPercentage = (expectedAussenwaendeMass / totalMass) * 100
//     const aggregatedForAussenwaende = aggregatedData.aggretatedDataWithPercentageSorted.find(
//       (data) => data.costGroupCategory === 330
//     )
//     expect(aggregatedForAussenwaende?.aggregatedMass).toEqual(expectedAussenwaendeMass)
//     expect(aggregatedForAussenwaende?.aggregatedMassPercentage).toEqual(expectedAussenwaendeMassPercentage)

//     expect(aggregatedData.totalMass).toEqual(totalMass)

//     const expectedTotalMassPercentage = Math.round((totalMass / buildingNrf) * 100)
//     expect(aggregatedData.totalMassPercentage).toEqual(expectedTotalMassPercentage)
//   })
// })

// todo: move to factory, re-use accross tests
const layerBaseData = {
  serviceLife: 45,
  technicalServiceLife: 64,
  productDescription:
    "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
  manufacturerName: "Camara-Urbansky",
  proofDocument: "Neongelb",
  versionDate: "2023-12-31T01:13:30.546Z",
  wasteCode: "Coordinator",
}
const innenwand1Layer1 = 79
const innenwand1Layer2 = 153.2443
const innenwand2Layer1 = 1449.1
const resources = {
  rawMaterials: {
    rmiMineral: 2.1,
    rmiMetallic: 23,
    rmiFossil: 2.028,
    rmiForestry: 12.028,
    rmiAgrar: 542.028,
    rmiAqua: 0,
  },
  embodiedEnergy: {
    penrtA1A2A3: 12,
    penrtB1: 812.123,
    penrtB4: 132.123,
    penrtB6: 12.123,
    penrtC3: 17.23,
    penrtC4: 112.123,
  },
  embodiedEmissions: {
    gwpA1A2A3: 531.321,
    gwpB1: 31.321,
    gwpB4: 51.321,
    gwpB6: 53.021,
    gwpC3: 531.32,
    gwpC4: 0,
  },
}

const buildingComponents: BuildingComponent[] = [
  {
    uuid: "dfabb2e6-45f4-49c9-b7c4-5f31aa47dbe4",
    name: "Innenwand tragend",
    costGroupDIN276: 341,
    layers: [
      {
        ...layerBaseData,
        index: 8,
        name: "Material xy",
        floor: "Anthrazit",
        room: "generating",
        componentGeometry: "m2",
        mass: innenwand1Layer1,
        material: {
          materialClassDescription: "Material xy",
          materialClassId: "1.3.2",
          materialClassDescription: "Holz",
          materialDatabase: "OBD_2020_II_A1",
        },
        ressources: resources,
        uuidProduct: "f3b9803a-e942-44e0-b7c0-c253f92cd6e3",
      },
      {
        ...layerBaseData,
        index: 10,
        name: "Beton C25/30 (Normalgewicht)",
        floor: "Espenweg",
        room: "Coupe",
        componentGeometry: "m2",
        mass: innenwand1Layer2,
        material: {
          materialClassDescription: "Beton C25/30 (Normalgewicht)",
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
          materialDatabase: "OBD_2020_II_A1",
        },
        ressources: resources,
        uuidProduct: "2ed80ab1-2a15-41e5-8d5d-23654593e59a",
      },
    ],
  },
  {
    uuid: "dfabb2e6-45f4-49c9-b7c4-5f31aa47dbe4",
    name: "Außenwand tragend",
    costGroupDIN276: 331,
    layers: [
      {
        ...layerBaseData,
        index: 8,
        name: "Kreuzlagenholz (CLT)",
        floor: "Anthrazit",
        room: "generating",
        componentGeometry: "m2",
        mass: innenwand2Layer1,
        material: {
          materialClassDescription: "Kreuzlagenholz (CLT)",
          materialClassId: "3.4.01",
          materialClassDescription: "Holz",
          materialDatabase: "OBD_2020_II_A1",
        },
        ressources: resources,
        uuidProduct: "f3b9803a-e942-44e0-b7c0-c253f92cd6e3",
      },
    ],
  },
]

describe("gwp aggregation", () => {
  it("returns an array with the correct amount of items", () => {
    const aggregation = aggregateGwpOrPenrt(buildingComponents, "embodiedEmissions")

    const numLifeCycles = Object.keys(buildingComponents[0].layers[0].ressources.embodiedEmissions).length
    expect(aggregation.length).toEqual(numLifeCycles)
  })
  it("aggregates gwp correctly for data with multiple components", () => {
    const aggregation = aggregateGwpOrPenrt(buildingComponents, "embodiedEmissions")
    const expectedAggregation = [
      {
        aggregatedValue: "1593.96",
        aggregatedValuePercentage: "44.34",
        label: "gwpA1A2A3",
        lifecycleSubphase: "gwpA1A2A3",
      },
      { aggregatedValue: "93.96", aggregatedValuePercentage: "2.61", label: "gwpB1", lifecycleSubphase: "gwpB1" },
      { aggregatedValue: "153.96", aggregatedValuePercentage: "4.28", label: "gwpB4", lifecycleSubphase: "gwpB4" },
      { aggregatedValue: "159.06", aggregatedValuePercentage: "4.42", label: "gwpB6", lifecycleSubphase: "gwpB6" },
      { aggregatedValue: "1593.96", aggregatedValuePercentage: "44.34", label: "gwpC3", lifecycleSubphase: "gwpC3" },
      { aggregatedValue: "0.00", aggregatedValuePercentage: "0.00", label: "gwpC4", lifecycleSubphase: "gwpC4" },
    ]
    expect(aggregation).toEqual(expectedAggregation)
  })
  it("throws in case of missing lifecycle phases", () => {
    // type checking does not happen in runtime, we need to validate
    const incompleteBuildingComponents = cloneDeep(buildingComponents)
    delete incompleteBuildingComponents[0].layers[0].ressources.embodiedEmissions.gwpB6
    // todo: conventions for error messages
    const expectedError = "Missing lifecycle phases in component: Innenwand tragend, layer: Material xy"
    expect(() => aggregateGwpOrPenrt(incompleteBuildingComponents, "embodiedEmissions")).toThrow(expectedError)
  })
  // todo:
  // @Daniel how does zod deal with undefined, null, NaN?
  // should we allow only positive numbers?
  // should we allow only finite numbers?
})

describe("penrt aggregation", () => {
  it("returns an array with the correct amount of items", () => {
    const aggregation = aggregateGwpOrPenrt(buildingComponents, "embodiedEnergy")

    const numLifeCycles = Object.keys(buildingComponents[0].layers[0].ressources.embodiedEnergy).length
    expect(aggregation.length).toEqual(numLifeCycles)
  })
  it("aggregates penrt correctly for data with multiple components", () => {
    const aggregation = aggregateGwpOrPenrt(buildingComponents, "embodiedEnergy")
    const expectedAggregation = [
      {
        aggregatedValue: "36.00",
        aggregatedValuePercentage: "1.09",
        label: "penrtA1A2A3",
        lifecycleSubphase: "penrtA1A2A3",
      },
      {
        aggregatedValue: "2436.37",
        aggregatedValuePercentage: "73.98",
        label: "penrtB1",
        lifecycleSubphase: "penrtB1",
      },
      {
        aggregatedValue: "396.37",
        aggregatedValuePercentage: "12.04",
        label: "penrtB4",
        lifecycleSubphase: "penrtB4",
      },
      { aggregatedValue: "36.37", aggregatedValuePercentage: "1.10", label: "penrtB6", lifecycleSubphase: "penrtB6" },
      { aggregatedValue: "51.69", aggregatedValuePercentage: "1.57", label: "penrtC3", lifecycleSubphase: "penrtC3" },
      { aggregatedValue: "336.37", aggregatedValuePercentage: "10.21", label: "penrtC4", lifecycleSubphase: "penrtC4" },
    ]
    expect(aggregation).toEqual(expectedAggregation)
  })
  it("throws in case of missing lifecycle phases", () => {
    // type checking does not happen in runtime, we need to validate
    const incompleteBuildingComponents = cloneDeep(buildingComponents)
    delete incompleteBuildingComponents[0].layers[0].ressources.embodiedEnergy.penrtC4
    // todo: conventions for error messages
    const expectedError = "Missing lifecycle phases in component: Innenwand tragend, layer: Material xy"
    expect(() => aggregateGwpOrPenrt(incompleteBuildingComponents, "embodiedEnergy")).toThrow(expectedError)
  })
  // todo:
  // @Daniel how does zod deal with undefined, null, NaN?
  // should we allow only positive numbers?
  // should we allow only finite numbers?
})
