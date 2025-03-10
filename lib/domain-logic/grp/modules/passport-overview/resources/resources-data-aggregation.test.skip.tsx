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
// import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
// import { Ressources, Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
// import {
//   AggregatedGwpOrPenrtDataResult,
//   AggregatedRmiData,
//   aggregateGwpData,
//   aggregatePenrtData,
//   aggregateRmiData,
//   calculateGwpABC,
//   calculateQpABC,
//   calculateRmiTotal,
// } from "./resources-data-aggregation"

// describe("Aggregation Functions with Complex Data", () => {
//   const layer1: Material = {
//     layerIndex: 1,
//     name: "Layer 1",
//     massInKg: 100,
//     materialGeometry: {
//       unit: "m3",
//       amount: 10,
//     },
//     material: {
//       uuid: "material-uuid-1",
//       materialDescription: "Material 1",
//       materialClassId: "class-id-1",
//       materialClassDescription: "Class Description 1",
//       oekobaudatVersion: "1.0",
//       serviceLifeInYears: 50,
//       serviceLifeTableVersion: "1.0",
//       trade: {
//         lbPerformanceRange: "",
//         trade: "",
//         lvNumber: "",
//         itemInLv: "",
//         area: 0,
//       },
//       specificProduct: {
//         uuid: "",
//         technicalServiceLifeInYears: 0,
//         description: "",
//         manufacturerName: "",
//         versionDate: "",
//         proofDocuments: [],
//       },
//     },
//     ressources: {
//       rawMaterialsInKg: {
//         Mineral: 100,
//         Metallic: 200,
//         Fossil: 50,
//         Forestry: 80,
//         Agrar: 120,
//         Aqua: 30,
//       },
//       embodiedEnergyInKwh: {
//         A1A2A3: 500,
//         B1: 100,
//         B4: 50,
//         B6: 200,
//         C3: 30,
//         C4: 20,
//       },
//       embodiedEmissionsInKgCo2Eq: {
//         A1A2A3: 300,
//         B1: 80,
//         B4: 40,
//         B6: 150,
//         C3: 20,
//         C4: 10,
//       },
//       recyclingContentInKg: 20,
//     },
//     circularity: {
//       eolPoints: 10,
//       methodologyVersion: "1.0",
//       category: "A",
//       proofReuse: "Proof",
//       interferingSubstances: [],
//     },
//     pollutants: {},
//   }

//   const layer2: Material = {
//     layerIndex: 2,
//     name: "Layer 2",
//     massInKg: 50,
//     materialGeometry: {
//       unit: "m2",
//       amount: 5,
//     },
//     material: {
//       uuid: "material-uuid-2",
//       materialDescription: "Material 2",
//       materialClassId: "class-id-2",
//       materialClassDescription: "Class Description 2",
//       oekobaudatVersion: "1.0",
//       serviceLifeInYears: 40,
//       serviceLifeTableVersion: "1.0",
//       trade: {
//         lbPerformanceRange: "",
//         trade: "",
//         lvNumber: "",
//         itemInLv: "",
//         area: 0,
//       },
//       specificProduct: {
//         uuid: "",
//         technicalServiceLifeInYears: 0,
//         description: "",
//         manufacturerName: "",
//         versionDate: "",
//         proofDocuments: [],
//       },
//     },
//     ressources: {
//       rawMaterialsInKg: {
//         Mineral: 50,
//         Metallic: 70,
//         Fossil: 30,
//         Forestry: 40,
//         Agrar: 60,
//         Aqua: 20,
//       },
//       embodiedEnergyInKwh: {
//         A1A2A3: 250,
//         B1: 50,
//         B4: 25,
//         B6: 100,
//         C3: 15,
//         C4: 10,
//       },
//       embodiedEmissionsInKgCo2Eq: {
//         A1A2A3: 150,
//         B1: 40,
//         B4: 20,
//         B6: 80,
//         C3: 10,
//         C4: 5,
//       },
//       recyclingContentInKg: 10,
//     },
//     circularity: {
//       eolPoints: 5,
//       methodologyVersion: "1.0",
//       category: "B",
//       proofReuse: "Proof",
//       interferingSubstances: [],
//     },
//     pollutants: {},
//   }

//   const layer3: Material = {
//     layerIndex: 3,
//     name: "Layer 3",
//     massInKg: 75,
//     materialGeometry: {
//       unit: "pieces",
//       amount: 15,
//     },
//     material: {
//       uuid: "material-uuid-3",
//       materialDescription: "Material 3",
//       materialClassId: "class-id-3",
//       materialClassDescription: "Class Description 3",
//       oekobaudatVersion: "1.0",
//       serviceLifeInYears: 60,
//       serviceLifeTableVersion: "1.0",
//       trade: {
//         lbPerformanceRange: "",
//         trade: "",
//         lvNumber: "",
//         itemInLv: "",
//         area: 0,
//       },
//       specificProduct: {
//         uuid: "",
//         technicalServiceLifeInYears: 0,
//         description: "",
//         manufacturerName: "",
//         versionDate: "",
//         proofDocuments: [],
//       },
//     },
//     ressources: {
//       rawMaterialsInKg: {
//         Mineral: 80,
//         Metallic: 100,
//         Fossil: 40,
//         Forestry: 60,
//         Agrar: 90,
//         Aqua: 25,
//       },
//       embodiedEnergyInKwh: {
//         A1A2A3: 400,
//         B1: 80,
//         B4: 40,
//         B6: 160,
//         C3: 24,
//         C4: 16,
//       },
//       embodiedEmissionsInKgCo2Eq: {
//         A1A2A3: 240,
//         B1: 64,
//         B4: 32,
//         B6: 128,
//         C3: 16,
//         C4: 8,
//       },
//       recyclingContentInKg: 16,
//     },
//     circularity: {
//       eolPoints: 8,
//       methodologyVersion: "1.0",
//       category: "C",
//       proofReuse: "Proof",
//       interferingSubstances: [],
//     },
//     pollutants: {},
//   }

//   const component1: DinEnrichedBuildingComponent = {
//     uuid: "component-uuid-1",
//     name: "Component 1",
//     materials: [layer1],
//     dinComponentLevelNumber: 123,
//     din276ComponetTypeName: "Component Type 1",
//     dinGroupLevelNumber: 100,
//     din276GroupName: "Group Name 1",
//     dinCategoryLevelNumber: 120,
//     din276CategoryName: "Category Name 1",
//   }

//   const component2: DinEnrichedBuildingComponent = {
//     uuid: "component-uuid-2",
//     name: "Component 2",
//     materials: [layer2, layer3],
//     dinComponentLevelNumber: 456,
//     din276ComponetTypeName: "Component Type 2",
//     dinGroupLevelNumber: 200,
//     din276GroupName: "Group Name 2",
//     dinCategoryLevelNumber: 240,
//     din276CategoryName: "Category Name 2",
//   }

//   const buildingComponents: DinEnrichedBuildingComponent[] = [component1, component2]
//   const nrf = 1000

//   describe("aggregateRmiData", () => {
//     it("should aggregate RMI data correctly with multiple components and layers", () => {
//       const result: AggregatedRmiData = aggregateRmiData(buildingComponents, "all", nrf)

//       const totalResources = {
//         Forestry: 80 + 40 + 60, // 180
//         Agrar: 120 + 60 + 90, // 270
//         Aqua: 30 + 20 + 25, // 75
//         Mineral: 100 + 50 + 80, // 230
//         Metallic: 200 + 70 + 100, // 370
//         Fossil: 50 + 30 + 40, // 120
//       }

//       const totalResourcesSum = Object.values(totalResources).reduce((sum, value) => sum + value, 0) // 1245

//       const expectedAggregatedData = Object.entries(totalResources).map(([resourceTypeName, aggregatedValue]) => ({
//         resourceTypeName: resourceTypeName as any,
//         aggregatedValue,
//         percentageValue: (aggregatedValue / totalResourcesSum) * 100,
//       }))

//       const aggregatedDataTotal = Math.round(totalResourcesSum) // 1245

//       const aggregatedDataTotalPerNrf2m = nrf > 0 ? Math.round(aggregatedDataTotal / nrf) : 0 // 1

//       expect(result).toEqual({
//         aggregatedByByResourceTypeWithPercentage: expectedAggregatedData,
//         aggregatedDataTotal,
//         aggregatedDataTotalPerNrf2m,
//       })
//     })
//   })

//   describe("aggregateGwpData", () => {
//     it("should aggregate GWP data correctly with multiple components and layers", () => {
//       const result: AggregatedGwpOrPenrtDataResult = aggregateGwpData(buildingComponents, nrf)

//       const totalEmissions = {
//         A1A2A3: 300 + 150 + 240, // 690
//         B1: 80 + 40 + 64, // 184
//         B4: 40 + 20 + 32, // 92
//         B6: 150 + 80 + 128, // 358
//         C3: 20 + 10 + 16, // 46
//         C4: 10 + 5 + 8, // 23
//       }

//       const totalEmissionsSum = Object.values(totalEmissions).reduce((sum, value) => sum + value, 0) // 1393

//       const expectedAggregatedData = [
//         {
//           lifecycleSubphaseId: "A1A2A3",
//           aggregatedValue: totalEmissions.A1A2A3,
//           aggregatedValuePercentage: (totalEmissions.A1A2A3 / totalEmissionsSum) * 100,
//           isGray: true,
//         },
//         {
//           lifecycleSubphaseId: "B1",
//           aggregatedValue: totalEmissions.B1,
//           aggregatedValuePercentage: (totalEmissions.B1 / totalEmissionsSum) * 100,
//         },
//         {
//           lifecycleSubphaseId: "B4",
//           aggregatedValue: totalEmissions.B4,
//           aggregatedValuePercentage: (totalEmissions.B4 / totalEmissionsSum) * 100,
//         },
//         {
//           lifecycleSubphaseId: "B6",
//           aggregatedValue: totalEmissions.B6,
//           aggregatedValuePercentage: (totalEmissions.B6 / totalEmissionsSum) * 100,
//         },
//         {
//           lifecycleSubphaseId: "C3",
//           aggregatedValue: totalEmissions.C3,
//           aggregatedValuePercentage: (totalEmissions.C3 / totalEmissionsSum) * 100,
//           isGray: true,
//         },
//         {
//           lifecycleSubphaseId: "C4",
//           aggregatedValue: totalEmissions.C4,
//           aggregatedValuePercentage: (totalEmissions.C4 / totalEmissionsSum) * 100,
//           isGray: true,
//         },
//       ]

//       const aggregatedDataTotal = totalEmissionsSum // 1393

//       const aggregatedDataTotalPerNrf = nrf > 0 ? aggregatedDataTotal / nrf : 0 // 1.393

//       const aggregatedDataGrayTotal = expectedAggregatedData
//         .filter((data) => data.isGray)
//         .reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0) // 690 + 46 + 23 = 759

//       expect(result).toEqual({
//         aggregatedData: expectedAggregatedData,
//         aggregatedDataTotal,
//         aggregatedDataTotalPerNrf,
//         aggregatedDataGrayTotal,
//       })
//     })
//   })

//   describe("aggregatePenrtData", () => {
//     it("should aggregate PENRT data correctly with multiple components and layers", () => {
//       const result: AggregatedGwpOrPenrtDataResult = aggregatePenrtData(buildingComponents, nrf)

//       const totalEnergy = {
//         A1A2A3: 500 + 250 + 400, // 1150
//         B1: 100 + 50 + 80, // 230
//         B4: 50 + 25 + 40, // 115
//         B6: 200 + 100 + 160, // 460
//         C3: 30 + 15 + 24, // 69
//         C4: 20 + 10 + 16, // 46
//       }

//       const totalEnergySum = Object.values(totalEnergy).reduce((sum, value) => sum + value, 0) // 2070

//       const expectedAggregatedData = [
//         {
//           lifecycleSubphaseId: "A1A2A3",
//           aggregatedValue: totalEnergy.A1A2A3,
//           aggregatedValuePercentage: (totalEnergy.A1A2A3 / totalEnergySum) * 100,
//           isGray: true,
//         },
//         {
//           lifecycleSubphaseId: "B1",
//           aggregatedValue: totalEnergy.B1,
//           aggregatedValuePercentage: (totalEnergy.B1 / totalEnergySum) * 100,
//         },
//         {
//           lifecycleSubphaseId: "B4",
//           aggregatedValue: totalEnergy.B4,
//           aggregatedValuePercentage: (totalEnergy.B4 / totalEnergySum) * 100,
//         },
//         {
//           lifecycleSubphaseId: "B6",
//           aggregatedValue: totalEnergy.B6,
//           aggregatedValuePercentage: (totalEnergy.B6 / totalEnergySum) * 100,
//         },
//         {
//           lifecycleSubphaseId: "C3",
//           aggregatedValue: totalEnergy.C3,
//           aggregatedValuePercentage: (totalEnergy.C3 / totalEnergySum) * 100,
//           isGray: true,
//         },
//         {
//           lifecycleSubphaseId: "C4",
//           aggregatedValue: totalEnergy.C4,
//           aggregatedValuePercentage: (totalEnergy.C4 / totalEnergySum) * 100,
//           isGray: true,
//         },
//       ]

//       const aggregatedDataTotal = totalEnergySum // 2070

//       const aggregatedDataTotalPerNrf = nrf > 0 ? aggregatedDataTotal / nrf : 0 // 2.07
//       const aggregatedDataGrayTotal = expectedAggregatedData
//         .filter((data) => data.isGray)
//         .reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0) // 1150 + 69 + 46 = 1265

//       expect(result).toEqual({
//         aggregatedData: expectedAggregatedData,
//         aggregatedDataTotal,
//         aggregatedDataTotalPerNrf,
//         aggregatedDataGrayTotal,
//       })
//     })
//   })

//   describe("Resource Calculation Functions", () => {
//     const validResources: Ressources = {
//       rawMaterials: {
//         Mineral: 100,
//         Metallic: 200,
//         Fossil: 50,
//         Forestry: 80,
//         Agrar: 120,
//         Aqua: 30,
//       },
//       embodiedEnergy: {
//         A1A2A3: 500,
//         B1: 100,
//         B4: 50,
//         B6: 200,
//         C3: 30,
//         C4: 20,
//       },
//       embodiedEmissions: {
//         A1A2A3: 300,
//         B1: 80,
//         B4: 40,
//         B6: 150,
//         C3: 20,
//         C4: 10,
//       },
//       carbonContent: 10,
//       recyclingContent: 20,
//     }

//     const emptyResources: Ressources = {
//       rawMaterials: {},
//       embodiedEnergy: {},
//       embodiedEmissions: {},
//     }

//     describe("calculateRmiTotal", () => {
//       it("should calculate the total raw material intensity correctly", () => {
//         const result = calculateRmiTotal(validResources)
//         const expectedTotal = 100 + 200 + 50 + 80 + 120 + 30 // 580
//         expect(result).toBe(expectedTotal)
//       })

//       it("should return 0 when resources are empty", () => {
//         const result = calculateRmiTotal(emptyResources)
//         expect(result).toBe(0)
//       })

//       it("should handle undefined rawMaterials gracefully", () => {
//         const resourcesWithUndefinedRawMaterials = { ...validResources, rawMaterials: undefined }
//         const result = calculateRmiTotal(resourcesWithUndefinedRawMaterials as Ressources)
//         expect(result).toBe(0)
//       })
//     })

//     describe("calculateQpABC", () => {
//       it("should calculate the total embodied energy across all phases", () => {
//         const result = calculateQpABC(validResources)
//         const expectedTotal = 500 + 100 + 50 + 200 + 30 + 20 // 900
//         expect(result).toBe(expectedTotal)
//       })

//       it("should return 0 when embodied energy is empty", () => {
//         const result = calculateQpABC(emptyResources)
//         expect(result).toBe(0)
//       })

//       it("should handle undefined embodiedEnergy gracefully", () => {
//         const resourcesWithUndefinedEmbodiedEnergy = { ...validResources, embodiedEnergy: undefined }
//         const result = calculateQpABC(resourcesWithUndefinedEmbodiedEnergy as Ressources)
//         expect(result).toBe(0)
//       })
//     })

//     describe("calculateGwpABC", () => {
//       it("should calculate the total embodied emissions across all phases", () => {
//         const result = calculateGwpABC(validResources)
//         const expectedTotal = 300 + 80 + 40 + 150 + 20 + 10 // 600
//         expect(result).toBe(expectedTotal)
//       })

//       it("should return 0 when embodied emissions are empty", () => {
//         const result = calculateGwpABC(emptyResources)
//         expect(result).toBe(0)
//       })

//       it("should handle undefined embodiedEmissions gracefully", () => {
//         const resourcesWithUndefinedEmbodiedEmissions = { ...validResources, embodiedEmissions: undefined }
//         const result = calculateGwpABC(resourcesWithUndefinedEmbodiedEmissions as Ressources)
//         expect(result).toBe(0)
//       })
//     })
//   })
// })
