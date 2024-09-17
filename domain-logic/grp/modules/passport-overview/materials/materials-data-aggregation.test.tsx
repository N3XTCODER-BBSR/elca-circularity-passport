import { BuildingComponent } from "domain-logic/grp/data-schema/versions/v1/passportSchema"
import { aggregateMaterialsDataByBuildingComponentCategory } from "./materials-data-aggregation"

describe("Materials aggregation logic", () => {
  it("should aggregate data correctly", () => {
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
    const innenwand2Layer2 = 9876.123

    const aussenwand1Layer1 = 14.3
    const aussenwand1Layer2 = 3288.124

    const buildingNrf = 1000

    const buildingComponents: BuildingComponent[] = [
      {
        uuid: "dfabb2e6-45f4-49c9-b7c4-5f31aa47dbe4",
        name: "Innenwand tragend",
        costGroupDIN276: 341,
        // costGroupCategory: 340,
        // costGroupCategoryName: "Innenwände",
        layers: [
          {
            ...layerBaseData,
            index: 8,
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
            uuidProduct: "f3b9803a-e942-44e0-b7c0-c253f92cd6e3",
          },
          {
            ...layerBaseData,
            index: 10,
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
            uuidProduct: "2ed80ab1-2a15-41e5-8d5d-23654593e59a",
          },
        ],
      },
      {
        uuid: "dfabb2e6-45f4-49c9-b7c4-5f31aa47dbe4",
        name: "Innenwand tragend",
        costGroupDIN276: 341,
        // costGroupCategory: 340,
        // costGroupCategoryName: "Innenwände",
        layers: [
          {
            ...layerBaseData,
            index: 8,
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
            uuidProduct: "f3b9803a-e942-44e0-b7c0-c253f92cd6e3",
          },
          {
            ...layerBaseData,
            index: 10,
            floor: "Espenweg",
            room: "Coupe",
            componentGeometry: "m2",
            mass: innenwand2Layer2,
            material: {
              materialClassDescription: "Beton C25/30 (Normalgewicht)",
              materialClassId: "1.1.01",
              materialClassDescription: "Mineralische Bauprodukte",
              materialDatabase: "OBD_2020_II_A1",
            },
            uuidProduct: "2ed80ab1-2a15-41e5-8d5d-23654593e59a",
          },
        ],
      },
      {
        uuid: "78cd6fbb-c6c6-49cb-a1f5-129331005057",
        name: "Außenwand N",
        costGroupDIN276: 331,
        // costGroupCategory: 330,
        // costGroupCategoryName: "Außenwände",
        layers: [
          {
            ...layerBaseData,
            index: 6,
            floor: "West",
            room: "Rolls",
            componentGeometry: "m2",
            mass: aussenwand1Layer1,
            material: {
              materialClassDescription: "Mechanische Lüftung mit Wärmerückgewinnung (MVHR)",
              materialClassId: "8.1.01",
              materialClassDescription: "Gebäudetechnik",
              materialDatabase: "OBD_2020_II_A1",
            },
            uuidProduct: "7a40b9c6-b4de-457e-9db2-69ff199eb68e",
            wasteCode: "enable",
          },
          {
            ...layerBaseData,
            index: 1,
            componentGeometry: "m2",
            mass: aussenwand1Layer2,
            material: {
              materialClassDescription: "Mineralwolle-Dämmung",
              materialClassId: "2.2.01",
              materialClassDescription: "Isoliermaterialien",
              materialDatabase: "OBD_2020_II_A1",
            },
            uuidProduct: "c1ef0a6c-e781-4100-9037-c161d83a93bf",
          },
        ],
      },
    ]

    const aggregatedData = aggregateMaterialsDataByBuildingComponentCategory(buildingComponents, buildingNrf)

    const expectedInnenwaendeMass = innenwand1Layer1 + innenwand1Layer2 + innenwand2Layer1 + innenwand2Layer2
    const expectedAussenwaendeMass = aussenwand1Layer1 + aussenwand1Layer2

    const totalMass = expectedAussenwaendeMass + expectedInnenwaendeMass

    const expectedInnenwaendeMassPercentage = (expectedInnenwaendeMass / totalMass) * 100
    const aggregatedForInnenwaende = aggregatedData.aggretatedByCategoryWithPercentageSorted.find(
      (data) => data.costGroupCategoryId === 340
    )
    expect(aggregatedForInnenwaende?.aggregatedMass).toEqual(expectedInnenwaendeMass)
    expect(aggregatedForInnenwaende?.aggregatedMassPercentage).toEqual(expectedInnenwaendeMassPercentage)

    const expectedAussenwaendeMassPercentage = (expectedAussenwaendeMass / totalMass) * 100
    const aggregatedForAussenwaende = aggregatedData.aggretatedByCategoryWithPercentageSorted.find(
      (data) => data.costGroupCategoryId === 330
    )
    expect(aggregatedForAussenwaende?.aggregatedMass).toEqual(expectedAussenwaendeMass)
    expect(aggregatedForAussenwaende?.aggregatedMassPercentage).toEqual(expectedAussenwaendeMassPercentage)

    expect(aggregatedData.totalMass).toEqual(totalMass)

    const expectedTotalMassPercentage = Math.round((totalMass / buildingNrf) * 100)
    expect(aggregatedData.totalMassRelativeToNrf).toEqual(expectedTotalMassPercentage)
  })
})
