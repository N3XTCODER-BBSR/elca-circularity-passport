import { EolClasses } from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { Circularity, Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import aggregateCircularityData from "./circularity-data-aggregation"

describe("aggregateCircularityData", () => {
  function createMockLayer(mass: number | undefined, circularityOverrides?: Partial<Circularity>): Material {
    return {
      layerIndex: 1,
      name: "Layer",
      massInKg: mass as any,
      materialGeometry: {
        unit: "m2",
        amount: 10,
      },
      material: {
        uuid: "material-uuid",
        materialDescription: "Material",
        materialClassId: "1.1.01",
        materialClassDescription: "Mineralische Bauprodukte",
        oekobaudatVersion: "v1",
        serviceLifeInYears: 50,
        serviceLifeTableVersion: "v1",
        trade: {
          lbPerformanceRange: "range",
          trade: "trade",
          lvNumber: "lvNumber",
          itemInLv: "item",
          area: 100,
        },
        specificProduct: {
          uuid: "product-uuid",
          technicalServiceLifeInYears: 30,
          description: "Product Description",
          manufacturerName: "Manufacturer",
          versionDate: "2023-01-01",
          proofDocuments: [],
        },
      },
      ressources: {
        rawMaterialsInKg: {
          Mineral: 0,
          Metallic: 0,
          Fossil: 0,
          Forestry: 0,
          Agrar: 0,
          Aqua: 0,
        },
        embodiedEnergyInKwh: {
          A1A2A3: 0,
          B1: 0,
          B4: 0,
          B6: 0,
          C3: 0,
          C4: 0,
        },
        embodiedEmissionsInKgCo2Eq: {
          A1A2A3: 0,
          B1: 0,
          B4: 0,
          B6: 0,
          C3: 0,
          C4: 0,
        },
        recyclingContentInKg: 0,
      },
      circularity: {
        methodologyVersion: "1.0",
        category: "category",
        proofReuse: "proof",
        interferingSubstances: [],
        ...circularityOverrides,
      },
      pollutants: {},
    }
  }

  function createMockComponent(
    dinCategoryLevelNumber: number,
    din276CategoryName: string,
    layers: Material[]
  ): DinEnrichedBuildingComponent {
    return {
      uuid: "component-uuid",
      name: "Component",
      materials: layers,
      dinComponentLevelNumber: dinCategoryLevelNumber,
      din276ComponetTypeName: "Component Type",
      dinCategoryLevelNumber: dinCategoryLevelNumber,
      din276CategoryName: din276CategoryName,
      dinGroupLevelNumber: Math.floor(dinCategoryLevelNumber / 100) * 100,
      din276GroupName: "Group Name",
    }
  }

  test("returns correct result with valid data", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Baugrube", [
        createMockLayer(100, { eolPoints: 80 }),
        createMockLayer(200, { eolPoints: 60 }),
      ]),
      createMockComponent(320, "Gründung", [createMockLayer(150, { eolPoints: 70 })]),
      createMockComponent(310, "Baugrube", [createMockLayer(50, { eolPoints: 90 })]),
    ]

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBe(70)
    expect(result.totalEolClass).toBe(EolClasses.CD)

    expect(result.avgEolPointsPerComponentCostCategory).toEqual([
      {
        din276CategoryName: "Baugrube",
        dinCategoryLevelNumber: 310,
        aggregatedMass: 350,
        weightedAvgEolPoints: 70,
        eolClass: EolClasses.CD,
      },
      {
        din276CategoryName: "Gründung",
        dinCategoryLevelNumber: 320,
        aggregatedMass: 150,
        weightedAvgEolPoints: 70,
        eolClass: EolClasses.CD,
      },
    ])
  })

  test("handles empty input", () => {
    const components: DinEnrichedBuildingComponent[] = []

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBeNaN()
    expect(result.totalEolClass).toBe(EolClasses.NA)
    expect(result.avgEolPointsPerComponentCostCategory).toEqual([])
  })

  test("skips layers without circularity data", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Baugrube", [createMockLayer(100, { eolPoints: 80 }), createMockLayer(200, undefined)]),
    ]

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBe(80)
    expect(result.totalEolClass).toBe(EolClasses.C)
    expect(result.avgEolPointsPerComponentCostCategory).toEqual([
      {
        din276CategoryName: "Baugrube",
        dinCategoryLevelNumber: 310,
        aggregatedMass: 100,
        weightedAvgEolPoints: 80,
        eolClass: EolClasses.C,
      },
    ])
  })

  test("skips layers with missing mass or eolPoints", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Baugrube", [
        createMockLayer(100, { eolPoints: 80 }),
        createMockLayer(undefined, { eolPoints: 70 }),
        createMockLayer(50, { eolPoints: undefined }),
      ]),
    ]

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBe(80)
    expect(result.totalEolClass).toBe(EolClasses.C)
    expect(result.avgEolPointsPerComponentCostCategory).toEqual([
      {
        din276CategoryName: "Baugrube",
        dinCategoryLevelNumber: 310,
        aggregatedMass: 100,
        weightedAvgEolPoints: 80,
        eolClass: EolClasses.C,
      },
    ])
  })

  test("handles zero total mass", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Baugrube", [
        createMockLayer(0, { eolPoints: 80 }),
        createMockLayer(0, { eolPoints: 70 }),
      ]),
    ]

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBeNaN()
    expect(result.totalEolClass).toBe(EolClasses.NA)
    expect(result.avgEolPointsPerComponentCostCategory).toEqual([])
  })

  test("handles negative masses", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Baugrube", [
        createMockLayer(-100, { eolPoints: 80 }),
        createMockLayer(-200, { eolPoints: 60 }),
      ]),
    ]

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBeCloseTo(66.6667, 4)
    expect(result.totalEolClass).toBe(EolClasses.D)
    expect(result.avgEolPointsPerComponentCostCategory).toEqual([
      {
        din276CategoryName: "Baugrube",
        dinCategoryLevelNumber: 310,
        aggregatedMass: -300,
        weightedAvgEolPoints: 66.66666666666667,
        eolClass: EolClasses.D,
      },
    ])
  })

  test("aggregates correctly with multiple categories", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Baugrube", [createMockLayer(100, { eolPoints: 80 })]),
      createMockComponent(320, "Gründung", [createMockLayer(200, { eolPoints: 60 })]),
      createMockComponent(330, "Außenwände", [createMockLayer(150, { eolPoints: 90 })]),
    ]

    const result = aggregateCircularityData(components)

    expect(result.totalAvgEolPoints).toBeCloseTo(74.4444, 4)
    expect(result.totalEolClass).toBe(EolClasses.CD)
    expect(result.avgEolPointsPerComponentCostCategory).toEqual([
      {
        din276CategoryName: "Baugrube",
        dinCategoryLevelNumber: 310,
        aggregatedMass: 100,
        weightedAvgEolPoints: 80,
        eolClass: EolClasses.C,
      },
      {
        din276CategoryName: "Gründung",
        dinCategoryLevelNumber: 320,
        aggregatedMass: 200,
        weightedAvgEolPoints: 60,
        eolClass: EolClasses.D,
      },
      {
        din276CategoryName: "Außenwände",
        dinCategoryLevelNumber: 330,
        aggregatedMass: 150,
        weightedAvgEolPoints: 90,
        eolClass: EolClasses.C,
      },
    ])
  })
})
