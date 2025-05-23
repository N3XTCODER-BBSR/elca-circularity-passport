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
import { passportParser } from "./passportParser"
import { Prisma } from "../../../../../../prisma/generated/client"

// TODO (M): Review this whole test file
// Probably it's not really meaningful since it is testing mainly
// correctness of the zod library
describe("passportParser", () => {
  const validBuildingComponents = [
    {
      uuid: "component-uuid-1",
      name: "Wall",
      costGroupDIN276: 300,
      materials: [
        {
          layerIndex: 1,
          name: "Layer 1",
          massInKg: 100,
          materialGeometry: {
            unit: "m2",
            amount: 50,
          },
          genericMaterial: {
            uuid: "material-uuid-1",
            name: "Concrete",
            classId: "M001",
            classDescription: "Construction Material",
            oekobaudatDbVersion: "2023",
          },
          serviceLifeInYears: 50,
          serviceLifeTableVersion: "v1",
          trade: {
            lbPerformanceRange: "Range 1",
            trade: "Construction",
            lvNumber: "12345",
            itemInLv: "67890",
            area: 100,
          },
          product: {
            uuid: "d9b44ee1-e83e-4b32-9f7e-bc9b9f53b6c6",
            technicalServiceLifeInYears: 25,
            description: "Product description",
            manufacturerName: "Manufacturer",
            versionDate: "2023-01-01",
            proofDocuments: [
              {
                url: "https://example.com/proof.pdf",
                versionDate: "2023-01-01",
              },
            ],
          },
          ressources: {
            rawMaterials: {
              Mineral: 500,
              Metallic: 100,
              Fossil: 50,
              Forestry: 20,
              Agrar: 10,
              Aqua: 5,
            },
            embodiedEnergy: {
              A1A2A3: 1000,
              B1: 200,
              B4: 300,
              B6: 400,
              C3: 500,
              C4: 600,
            },
            embodiedEmissions: {
              A1A2A3: 100,
              B1: 10,
              B4: 20,
              B6: 30,
              C3: 40,
              C4: 50,
            },
            recyclingContent: 10,
          },
          circularity: {
            rebuildPoints: 20,
            dismantlingPotentialClassId: "I",
            eolPoints: 10,
            circularityIndex: 1234,
            methodologyVersion: "v3",
            version: "v1",
            category: "Recyclable",
            proofReuse: "Proof of reuse",
            interferingSubstances: [],
          },
          pollutants: {},
        },
      ],
    },
  ]

  const validPassportJson = {
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    date: "2023-05-01",
    authorName: "John Doe",
    versionTag: "v1.0",
    generatorSoftware: {
      name: "Software",
      version: "1.0",
      url: "https://example.com",
    },
    elcaProjectId: "ELCA123",
    projectName: "Test Project",
    dataSchemaVersion: "1.0",
    buildingBaseData: {
      buildingStructureId: {},
      coordinates: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
      address: "123 Main St",
      buildingPermitYear: 2000,
      buildingCompletionYear: 2005,
      buildingType: "Residential",
      numberOfUpperFloors: 5,
      numberOfBasementFloors: 1,
      plotArea: 500,
      nrf: 200,
      bgf: 300,
      bri: 1000,
      totalBuildingMass: 1500,
    },
    buildingComponents: validBuildingComponents,
  }

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should throw an error if materialGeometry.unit is invalid", () => {
    const invalidPassportJson = {
      ...validPassportJson,
      buildingComponents: [
        {
          ...validBuildingComponents[0],
          layers: [
            {
              ...validBuildingComponents[0]!.materials[0],
              materialGeometry: {
                unit: "invalid-unit", // Invalid unit
                amount: 50,
              },
            },
          ],
        },
      ],
    }

    const jsonString = JSON.stringify(invalidPassportJson)
    expect(() => passportParser(jsonString)).toThrow("Error parsing passport data")
  })

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should throw an error if material.serviceLifeInYears is negative", () => {
    const invalidPassportJson = {
      ...validPassportJson,
      buildingComponents: [
        {
          ...validBuildingComponents[0],
          layers: [
            {
              ...validBuildingComponents[0]!.materials[0],
              genericCaterial: {
                ...validBuildingComponents[0]!.materials[0]!.genericMaterial,
                serviceLifeInYears: -10, // Negative value
              },
            },
          ],
        },
      ],
    }

    const jsonString = JSON.stringify(invalidPassportJson)
    expect(() => passportParser(jsonString)).toThrow("Error parsing passport data")
  })

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should throw an error if material.product.proofDocuments.url is invalid", () => {
    const invalidPassportJson = {
      ...validPassportJson,
      buildingComponents: [
        {
          ...validBuildingComponents[0],
          layers: [
            {
              ...validBuildingComponents[0]!.materials[0],
              genericMaterial: {
                ...validBuildingComponents[0]!.materials[0]!.genericMaterial,
              },
              product: {
                ...validBuildingComponents[0]!.materials[0]!.product,
                proofDocuments: [
                  {
                    url: "invalid-url", // Invalid URL
                    versionDate: "2023-01-01",
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const jsonString = JSON.stringify(invalidPassportJson)
    expect(() => passportParser(jsonString)).toThrow("Error parsing passport data")
  })

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should throw an error if layers.mass is negative", () => {
    const invalidPassportJson = {
      ...validPassportJson,
      buildingComponents: [
        {
          ...validBuildingComponents[0],
          layers: [
            {
              ...validBuildingComponents[0]!.materials[0],
              mass: -100, // Negative mass
            },
          ],
        },
      ],
    }

    const jsonString = JSON.stringify(invalidPassportJson)
    expect(() => passportParser(jsonString)).toThrow("Error parsing passport data")
  })

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should parse valid JSON string and match the schema", () => {
    const jsonString = JSON.stringify(validPassportJson)
    expect(passportParser(jsonString)).toEqual(validPassportJson)
  })

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should parse valid object and match the schema", () => {
    expect(passportParser(validPassportJson as Prisma.JsonValue)).toEqual(validPassportJson)
  })

  it("should throw an error if JSON string is invalid", () => {
    const invalidJsonString = "{ invalid JSON }"
    expect(() => passportParser(invalidJsonString)).toThrow(SyntaxError)
  })

  // TODO: review and then either remove this (or whole test file? looks like we are testing zods logic here) or fix/adapt this test
  it.skip("should log parsing errors and validation issues for invalid data", () => {
    const invalidPassportJson = {
      ...validPassportJson,
      buildingComponents: [
        {
          ...validBuildingComponents[0],
          layers: [
            {
              ...validBuildingComponents[0]!.materials[0],
              mass: -100, // Negative mass
            },
          ],
        },
      ],
    }

    const jsonString = JSON.stringify(invalidPassportJson)

    // Spy on console.error to verify it is called
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    expect(() => passportParser(jsonString)).toThrow("Error parsing passport data")
    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith("Error parsing passport data", expect.anything())
    expect(consoleSpy).toHaveBeenCalledWith("issues", expect.anything())

    // Restore the original console.error implementation
    consoleSpy.mockRestore()
  })
})
