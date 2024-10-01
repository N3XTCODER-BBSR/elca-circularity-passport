// aggregateMaterialsData.test.ts

import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { Layer, Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import {
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "./materials-data-aggregation"

describe("aggregateMaterialsDataByBuildingComponentCategory", () => {
  function createMockLayer(mass: number): Layer {
    return {
      lnr: 1,
      name: "Layer",
      mass: mass,
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
        product: {
          uuid: "product-uuid",
          technicalServiceLifeInYears: 30,
          description: "Product Description",
          manufacturerName: "Manufacturer",
          versionDate: "2023-01-01",
          proofDocuments: [],
        },
        waste: {
          wasteCode: "waste-code",
        },
      },
      ressources: {
        rawMaterials: {
          Mineral: 0,
          Metallic: 0,
          Fossil: 0,
          Forestry: 0,
          Agrar: 0,
          Aqua: 0,
        },
        embodiedEnergy: {
          A1A2A3: 0,
          B1: 0,
          B4: 0,
          B6: 0,
          C3: 0,
          C4: 0,
        },
        embodiedEmissions: {
          A1A2A3: 0,
          B1: 0,
          B4: 0,
          B6: 0,
          C3: 0,
          C4: 0,
        },
      },
      circularity: {
        eolPoints: 0,
        version: "1.0",
        category: "category",
        proofReuse: "proof",
        interferingSubstances: [],
      },
      pollutants: {},
    }
  }

  function createMockComponent(
    dinComponentLevelNumber: number,
    din276ComponetTypeName: string,
    dinCategoryLevelNumber: number,
    din276CategoryName: string,
    layers: Layer[]
  ): DinEnrichedBuildingComponent {
    return {
      uuid: "component-uuid",
      name: "Component",
      layers: layers,
      dinComponentLevelNumber: dinComponentLevelNumber,
      din276ComponetTypeName: din276ComponetTypeName,
      dinCategoryLevelNumber: dinCategoryLevelNumber,
      din276CategoryName: din276CategoryName,
      dinGroupLevelNumber: Math.floor(dinComponentLevelNumber / 100) * 100,
      din276GroupName: "Group Name",
    }
  }

  test("returns empty result when input is empty", () => {
    const result = aggregateMaterialsDataByBuildingComponentCategory([], 1000)
    expect(result).toEqual({
      aggregatedByCategory: [],
      totalMass: 0,
      totalMassRelativeToNrf: 0,
    })
  })

  test("aggregates mass by building component category", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Component Type", 310, "Baugrube", [createMockLayer(100), createMockLayer(200)]),
      createMockComponent(320, "Component Type", 320, "Gründung", [createMockLayer(150)]),
      createMockComponent(310, "Component Type", 310, "Baugrube", [createMockLayer(50)]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByBuildingComponentCategory(components, buildingNrf)

    expect(result.totalMass).toBe(500)
    expect(result.totalMassRelativeToNrf).toBe(50)
    expect(result.aggregatedByCategory).toEqual([
      {
        costGroupCategoryId: 320,
        costGroupCategoryName: "Gründung",
        aggregatedMass: 150,
        aggregatedMassPercentage: 30,
      },
      {
        costGroupCategoryId: 310,
        costGroupCategoryName: "Baugrube",
        aggregatedMass: 350,
        aggregatedMassPercentage: 70,
      },
    ])
  })

  test("handles components with zero mass", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Component Type", 310, "Baugrube", [createMockLayer(0), createMockLayer(0)]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByBuildingComponentCategory(components, buildingNrf)

    expect(result.totalMass).toBe(0)
    expect(result.totalMassRelativeToNrf).toBe(0)
    expect(result.aggregatedByCategory).toEqual([
      {
        aggregatedMass: 0,
        aggregatedMassPercentage: 0,
        costGroupCategoryId: 310,
        costGroupCategoryName: "Baugrube",
      },
    ])
  })

  test("handles components with missing layers", () => {
    const components: DinEnrichedBuildingComponent[] = [createMockComponent(310, "Component Type", 310, "Baugrube", [])]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByBuildingComponentCategory(components, buildingNrf)

    expect(result.totalMass).toBe(0)
    expect(result.totalMassRelativeToNrf).toBe(0)
    expect(result.aggregatedByCategory).toEqual([
      {
        aggregatedMass: 0,
        aggregatedMassPercentage: 0,
        costGroupCategoryId: 310,
        costGroupCategoryName: "Baugrube",
      },
    ])
  })

  test("handles components with negative mass", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Component Type", 310, "Baugrube", [createMockLayer(-100)]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByBuildingComponentCategory(components, buildingNrf)

    expect(result.totalMass).toBe(-100)
    expect(result.totalMassRelativeToNrf).toBe(-10)
    expect(result.aggregatedByCategory).toEqual([
      {
        costGroupCategoryId: 310,
        costGroupCategoryName: "Baugrube",
        aggregatedMass: -100,
        aggregatedMassPercentage: 100,
      },
    ])
  })

  test("handles duplicate categories correctly", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(310, "Component Type", 310, "Baugrube", [createMockLayer(100)]),
      createMockComponent(310, "Component Type", 310, "Baugrube", [createMockLayer(200)]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByBuildingComponentCategory(components, buildingNrf)

    expect(result.totalMass).toBe(300)
    expect(result.totalMassRelativeToNrf).toBe(30)
    expect(result.aggregatedByCategory).toEqual([
      {
        costGroupCategoryId: 310,
        costGroupCategoryName: "Baugrube",
        aggregatedMass: 300,
        aggregatedMassPercentage: 100,
      },
    ])
  })

  test("handles totalMass of zero to prevent division by zero", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent(320, "Component Type", 320, "Gründung", [createMockLayer(0)]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByBuildingComponentCategory(components, buildingNrf)

    expect(result.totalMass).toBe(0)
    expect(result.totalMassRelativeToNrf).toBe(0)
    expect(result.aggregatedByCategory).toEqual([
      {
        aggregatedMass: 0,
        aggregatedMassPercentage: 0,
        costGroupCategoryId: 320,
        costGroupCategoryName: "Gründung",
      },
    ])
  })
})

describe("aggregateMaterialsDataByMaterialClass", () => {
  function createMockLayer(mass: number, materialOverrides: Partial<Material> = {}): Layer {
    return {
      lnr: 1,
      name: "Layer",
      mass: mass,
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
        product: {
          uuid: "product-uuid",
          technicalServiceLifeInYears: 30,
          description: "Product Description",
          manufacturerName: "Manufacturer",
          versionDate: "2023-01-01",
          proofDocuments: [],
        },
        waste: {
          wasteCode: "waste-code",
        },
        ...materialOverrides,
      },
      ressources: {
        rawMaterials: {
          Mineral: 0,
          Metallic: 0,
          Fossil: 0,
          Forestry: 0,
          Agrar: 0,
          Aqua: 0,
        },
        embodiedEnergy: {
          A1A2A3: 0,
          B1: 0,
          B4: 0,
          B6: 0,
          C3: 0,
          C4: 0,
        },
        embodiedEmissions: {
          A1A2A3: 0,
          B1: 0,
          B4: 0,
          B6: 0,
          C3: 0,
          C4: 0,
        },
      },
      circularity: {
        eolPoints: 0,
        version: "1.0",
        category: "category",
        proofReuse: "proof",
        interferingSubstances: [],
      },
      pollutants: {},
    }
  }

  function createMockComponent(layers: Layer[]): DinEnrichedBuildingComponent {
    return {
      uuid: "component-uuid",
      name: "Component",
      layers: layers,
      dinComponentLevelNumber: 310,
      din276ComponetTypeName: "Component Type",
      dinCategoryLevelNumber: 310,
      din276CategoryName: "Baugrube",
      dinGroupLevelNumber: 300,
      din276GroupName: "Group Name",
    }
  }

  test("returns empty result when input is empty", () => {
    const result = aggregateMaterialsDataByMaterialClass([], 1000)
    expect(result).toEqual({
      aggregatedByClassId: [],
      totalMass: 0,
      totalMassRelativeToNrf: 0,
    })
  })

  test("aggregates mass by material class", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent([
        createMockLayer(100, {
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
        }),
        createMockLayer(200, {
          materialClassId: "2.4.01",
          materialClassDescription: "Isoliermaterialien",
        }),
      ]),
      createMockComponent([
        createMockLayer(50, {
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(350)
    expect(result.totalMassRelativeToNrf).toBe(35)
    expect(result.aggregatedByClassId).toEqual([
      {
        materialClassId: "1.1.01",
        materialClassDescription: "Mineralische Bauprodukte",
        aggregatedMass: 150,
        aggregatedMassPercentage: (150 / 350) * 100,
      },
      {
        materialClassId: "2.4.01",
        materialClassDescription: "Isoliermaterialien",
        aggregatedMass: 200,
        aggregatedMassPercentage: (200 / 350) * 100,
      },
    ])
  })

  test("handles layers with zero mass", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent([
        createMockLayer(0, {
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(0)
    expect(result.totalMassRelativeToNrf).toBe(0)
    expect(result.aggregatedByClassId).toEqual([
      {
        aggregatedMass: 0,
        aggregatedMassPercentage: 0,
        materialClassDescription: "Mineralische Bauprodukte",
        materialClassId: "1.1.01",
      },
    ])
  })

  test("handles negative masses", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent([
        createMockLayer(-50, {
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(-50)
    expect(result.totalMassRelativeToNrf).toBe(-5)
    expect(result.aggregatedByClassId).toEqual([
      {
        materialClassId: "1.1.01",
        materialClassDescription: "Mineralische Bauprodukte",
        aggregatedMass: -50,
        aggregatedMassPercentage: 100,
      },
    ])
  })

  test("handles duplicate material classes correctly", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent([
        createMockLayer(100, {
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
        }),
      ]),
      createMockComponent([
        createMockLayer(200, {
          materialClassId: "1.1.01",
          materialClassDescription: "Mineralische Bauprodukte",
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(300)
    expect(result.totalMassRelativeToNrf).toBe(30)
    expect(result.aggregatedByClassId).toEqual([
      {
        materialClassId: "1.1.01",
        materialClassDescription: "Mineralische Bauprodukte",
        aggregatedMass: 300,
        aggregatedMassPercentage: 100,
      },
    ])
  })

  test("handles totalMass of zero to prevent division by zero", () => {
    const components: DinEnrichedBuildingComponent[] = [
      createMockComponent([
        createMockLayer(0, {
          materialClassId: "2.4.01",
          materialClassDescription: "Isoliermaterialien",
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(0)
    expect(result.totalMassRelativeToNrf).toBe(0)
    expect(result.aggregatedByClassId).toEqual([
      {
        aggregatedMass: 0,
        aggregatedMassPercentage: 0,
        materialClassDescription: "Isoliermaterialien",
        materialClassId: "2.4.01",
      },
    ])
  })
})
