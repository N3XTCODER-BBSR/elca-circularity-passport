/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
// aggregateMaterialsData.test.ts

import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import {
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "./materials-data-aggregation"

describe("aggregateMaterialsDataByBuildingComponentCategory", () => {
  function createMockLayer(mass: number): Material {
    return {
      layerIndex: 1,
      name: "Layer",
      massInKg: mass,
      serviceLifeInYears: 50,
      serviceLifeTableVersion: "v1",
      trade: {
        lbPerformanceRange: "range",
        trade: "trade",
        lvNumber: "lvNumber",
        itemInLv: "item",
        // area: 100,
      },
      materialGeometry: {
        unit: "m2",
        amount: 10,
      },
      specificProduct: {
        uuid: "product-uuid",
        technicalServiceLifeInYears: 30,
        description: "Product Description",
        manufacturerName: "Manufacturer",
        versionDate: "2023-01-01",
        proofDocuments: [],
      },
      genericMaterial: {
        uuid: "material-uuid",
        name: "Material",
        classId: "1.1.01",
        classDescription: "Mineralische Bauprodukte",
        oekobaudatDbVersion: "v1",
        // waste: {
        //   wasteCode: "waste-code",
        // },
      },
      // ressources: {
      //   rawMaterialsInKg: {
      //     Mineral: 0,
      //     Metallic: 0,
      //     Fossil: 0,
      //     Forestry: 0,
      //     Agrar: 0,
      //     Aqua: 0,
      //   },
      //   embodiedEnergyInKwh: {
      //     A1A2A3: 0,
      //     B1: 0,
      //     B4: 0,
      //     B6: 0,
      //     C3: 0,
      //     C4: 0,
      //   },
      //   embodiedEmissionsInKgCo2Eq: {
      //     A1A2A3: 0,
      //     B1: 0,
      //     B4: 0,
      //     B6: 0,
      //     C3: 0,
      //     C4: 0,
      //   },
      // },
      circularity: {
        eolPoints: 0,
        methodologyVersion: "1.0",
        proofReuse: "proof",
        interferingSubstances: [],
        rebuildPoints: 0,
        dismantlingPotentialClassId: "I",
        circularityIndex: 0,
      },
      pollutants: {},
    }
  }

  function createMockComponent(
    dinComponentLevelNumber: number,
    din276ComponetTypeName: string,
    dinCategoryLevelNumber: number,
    din276CategoryName: string,
    layers: Material[]
  ): DinEnrichedBuildingComponent {
    return {
      uuid: "component-uuid",
      name: "Component",
      materials: layers,
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
    expect(result.totalMassRelativeToNrf).toBe(0.5)
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
    expect(result.totalMassRelativeToNrf).toBe(-0.1)
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
    expect(result.totalMassRelativeToNrf).toBe(0.3)
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
  function createMockLayer(mass: number, materialOverrides: Partial<Material> = {}): Material {
    return {
      layerIndex: 1,
      name: "Layer",
      massInKg: mass,
      serviceLifeInYears: 50,
      serviceLifeTableVersion: "v1",
      trade: {
        lbPerformanceRange: "range",
        trade: "trade",
        lvNumber: "lvNumber",
        itemInLv: "item",
        // area: 100,
      },
      materialGeometry: {
        unit: "m2",
        amount: 10,
      },
      specificProduct: {
        uuid: "product-uuid",
        technicalServiceLifeInYears: 30,
        description: "Product Description",
        manufacturerName: "Manufacturer",
        versionDate: "2023-01-01",
        proofDocuments: [],
      },
      genericMaterial: {
        uuid: "material-uuid",
        name: "Material",
        classId: "1.1.01",
        classDescription: "Mineralische Bauprodukte",
        oekobaudatDbVersion: "v1",
        // waste: {
        //   wasteCode: "waste-code",
        // },
      },
      // ressources: {
      //   rawMaterialsInKg: {
      //     Mineral: 0,
      //     Metallic: 0,
      //     Fossil: 0,
      //     Forestry: 0,
      //     Agrar: 0,
      //     Aqua: 0,
      //   },
      //   embodiedEnergyInKwh: {
      //     A1A2A3: 0,
      //     B1: 0,
      //     B4: 0,
      //     B6: 0,
      //     C3: 0,
      //     C4: 0,
      //   },
      //   embodiedEmissionsInKgCo2Eq: {
      //     A1A2A3: 0,
      //     B1: 0,
      //     B4: 0,
      //     B6: 0,
      //     C3: 0,
      //     C4: 0,
      //   },
      // },
      circularity: {
        eolPoints: 0,
        methodologyVersion: "1.0",
        proofReuse: "proof",
        interferingSubstances: [],
        rebuildPoints: 0,
        dismantlingPotentialClassId: "I",
        circularityIndex: 0,
      },
      pollutants: {},
      ...materialOverrides,
    }
  }

  function createMockComponent(layers: Material[]): DinEnrichedBuildingComponent {
    return {
      uuid: "component-uuid",
      name: "Component",
      materials: layers,
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
          genericMaterial: {
            classId: "1.1.01",
            classDescription: "Mineralische Bauprodukte",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
        }),
        createMockLayer(200, {
          genericMaterial: {
            classId: "2.4.01",
            classDescription: "Isoliermaterialien",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
        }),
      ]),
      createMockComponent([
        createMockLayer(50, {
          genericMaterial: {
            classId: "1.1.01",
            classDescription: "Mineralische Bauprodukte",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(350)
    expect(result.totalMassRelativeToNrf).toBe(0.35)
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
          genericMaterial: {
            classId: "1.1.01",
            classDescription: "Mineralische Bauprodukte",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
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
          genericMaterial: {
            classId: "1.1.01",
            classDescription: "Mineralische Bauprodukte",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(-50)
    expect(result.totalMassRelativeToNrf).toBe(-0.05)
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
          genericMaterial: {
            classId: "1.1.01",
            classDescription: "Mineralische Bauprodukte",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
        }),
      ]),
      createMockComponent([
        createMockLayer(200, {
          genericMaterial: {
            classId: "1.1.01",
            classDescription: "Mineralische Bauprodukte",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
        }),
      ]),
    ]
    const buildingNrf = 1000
    const result = aggregateMaterialsDataByMaterialClass(components, buildingNrf)

    expect(result.totalMass).toBe(300)
    expect(result.totalMassRelativeToNrf).toBe(0.3)
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
          genericMaterial: {
            classId: "2.4.01",
            classDescription: "Isoliermaterialien",
            name: "",
            uuid: "",
            oekobaudatDbVersion: "",
          },
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
