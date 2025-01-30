import { createUser, deleteUserIfExists } from "./testUtils"
import { legacyDbDalInstance } from "./dalSingletons"

describe("legacyDb queries", () => {
  describe("getElcaComponentDataByLayerId", () => {
    it("should return the correct component data for a given layer ID", async () => {
      const result = await legacyDbDalInstance.getElcaComponentDataByLayerId(5, 1, 1)

      const want = {
        life_cycle_ident: "A1-3",
        component_id: 5,
        layer_position: 1,
        process_name: "Beton der Druckfestigkeitsklasse C 30/37",
        // process_ref_value: 1,
        // process_ref_unit: "m3",
        oekobaudat_process_uuid: "b6096c9c-1248-4ce1-9c2d-f4a48aade80f",
        oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
        element_component_id: 5,
        quantity: 1,
        layer_size: 0.3,
        layer_length: 1,
        layer_width: 1,
        process_config_density: null,
        process_config_name: "Beton der Druckfestigkeitsklasse C 30/37",
      }

      expect(result).toMatchObject(want)
    })
  })
  describe("getElcaVariantComponentsByInstanceId", () => {
    it("should return the correct project components for a given instance ID and user ID", async () => {
      const result = await legacyDbDalInstance.getElcaVariantComponentsByInstanceId(
        "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
        1,
        1
      )

      const want = [
        {
          access_group_id: 3,
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          component_id: 5,
          layer_position: 1,
          process_name: "Beton der Druckfestigkeitsklasse C 30/37",
          // process_ref_value: 1,
          // process_ref_unit: "m3",
          oekobaudat_process_uuid: "b6096c9c-1248-4ce1-9c2d-f4a48aade80f",
          pdb_name: "copy of OBD_2023_I for import in eLCA",
          pdb_version: "v1",
          oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
          element_name: "Fundament 1",
          element_type_name: "Baugrundverbesserung",
          din_code: 321,
          unit: "m2",
          element_component_id: 5,
          quantity: 1,
          layer_size: 0.3,
          layer_length: 1,
          layer_width: 1,
          process_config_density: null,
          process_config_name: "Beton der Druckfestigkeitsklasse C 30/37",
        },
        {
          access_group_id: 3,
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          component_id: 6,
          layer_position: 2,
          process_name: "Keramische Fassadenplatte TONALITY®",
          // process_ref_value: 1,
          // process_ref_unit: "m2",
          oekobaudat_process_uuid: "bb51d66a-b04b-4ec7-8947-185e9697e671",
          pdb_name: "copy of OBD_2023_I for import in eLCA",
          pdb_version: "v1",
          oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
          element_name: "Fundament 1",
          element_type_name: "Baugrundverbesserung",
          din_code: 321,
          unit: "m2",
          element_component_id: 6,
          quantity: 1,
          layer_size: 0.5,
          layer_length: 1,
          layer_width: 1,
          process_config_density: null,
          process_config_name: "Keramische Fassadenplatte TONALITY®",
        },
        {
          access_group_id: 3,
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          component_id: 7,
          layer_position: 3,
          process_name: "Kunststoffprofil SBR",
          // process_ref_value: 1,
          // process_ref_unit: "kg",
          oekobaudat_process_uuid: "1b69b3a2-3164-436b-a934-ed7d926f5f53",
          pdb_name: "copy of OBD_2023_I for import in eLCA",
          pdb_version: "v1",
          oekobaudat_process_db_uuid: "22885a6e-1765-4ade-a35e-ae668bd07256",
          element_name: "Fundament 1",
          element_type_name: "Baugrundverbesserung",
          din_code: 321,
          unit: "m2",
          element_component_id: 7,
          quantity: 1,
          layer_size: 0.302,
          layer_length: 1,
          layer_width: 1,
          process_config_density: null,
          process_config_name: "Kunststoffprofil SBR",
        },
      ]

      expect(result).toHaveLength(want.length)
      result.forEach((resultComponent, i) => {
        expect(resultComponent).toMatchObject(want[i]!)
      })
    })
  })
  describe("getProjectsById", () => {
    it("should return the correct project data for a given project ID and owner ID", async () => {
      const result = await legacyDbDalInstance.getProjectById(1)

      const want = { id: 1, name: "Test Project 1" }

      expect(result).toMatchObject(want)
    })
  })
  describe("getProjectDataWithVariants", () => {
    it("should return the correct project data for a given project ID", async () => {
      const result = await legacyDbDalInstance.getProjectDataWithVariants(1)

      const want = {
        id: 1,
        name: "Test Project 1",
        project_variants_project_variants_project_idToprojects: [
          { id: 1, name: "Vorplanung" },
          {
            id: 2,
            name: "Entwurfsplanung",
          },
          {
            id: 3,
            name: "Ausführungsplanung",
          },
        ],
      }

      expect(result).toBeDefined()
      expect(result!.project_variants_project_variants_project_idToprojects).toHaveLength(
        want.project_variants_project_variants_project_idToprojects.length
      )
      expect(result!.name).toBe(want.name)

      result!.project_variants_project_variants_project_idToprojects.forEach((resultVariant, i) => {
        expect(resultVariant).toMatchObject(want.project_variants_project_variants_project_idToprojects[i]!)
      })
    })
    it("should return null if the project does not exist", async () => {
      const nonExistingProjectId = 999
      const result = await legacyDbDalInstance.getProjectDataWithVariants(nonExistingProjectId)

      const want = null

      expect(result).toBe(want)
    })
  })
  describe("getProjectsByOwnerId", () => {
    it("should return the correct project data for a given owner ID", async () => {
      const result = await legacyDbDalInstance.getProjectsByOwnerId(2)

      const want = [
        {
          id: 1,
          name: "Test Project 1",
          created: new Date("2024-11-02T15:12:42.000Z"),
          users: { auth_name: "testuser" },
        },
      ]

      expect(result).toBeDefined()
      expect(result).toHaveLength(want.length)
      expect(result![0]).toMatchObject(want[0]!)
    })
  })
  describe("getComponentsByVariantId", () => {
    it(`should return the correct project elements for a given variant ID, 
      but only the ones which fall into the DIN category number pool 
      for the Circularity Tool (const costGroupCategoryNumbersToInclude = [320, 330, 340, 350, 360])`, async () => {
      const result = await legacyDbDalInstance.getComponentsByVariantId(1, 1)
      const want = [
        {
          uuid: "cf37aa10-7ff5-4b42-bec5-d6dd3a7814fb",
          name: "Aussenwand Test 1",
          project_variant_id: 1,
          element_types: { din_code: 311 },
        },
        {
          uuid: "b2f759d5-2f8e-47f8-a3d9-4f71d5795f7d",
          name: "Aussenwand Test 1",
          project_variant_id: 2,
          element_types: { din_code: 311 },
        },
        {
          uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          name: "Fundament 1",
          project_variant_id: 1,
          element_types: { din_code: 321 },
        },
        {
          uuid: "cfddd4f3-ef16-45ab-a027-c82ea4e3fe4f",
          name: "Aussenwand Test 1",
          project_variant_id: 3,
          element_types: { din_code: 311 },
        },
        {
          uuid: "8d9f9a47-c9e0-4198-92a1-a04eebb49d6c",
          name: "Fundament 1",
          project_variant_id: 3,
          element_types: { din_code: 321 },
        },
        {
          uuid: "1b9ead66-2911-4b60-983b-0eeb118d6837",
          name: "Aussenwand Test 1",
          project_variant_id: 1,
          element_types: { din_code: 333 },
        },
        {
          uuid: "17517962-b544-4433-b4bc-49aa101814ab",
          name: "Aussenwand Test 2",
          project_variant_id: 1,
          element_types: { din_code: 333 },
        },
      ]

      const expectedLength = 3 // because of the DIN category number pool

      expect(result).toHaveLength(expectedLength)
      result.forEach((resultElement) => {
        const matchingElement = want.find((element) => element.uuid === resultElement.uuid)
        expect(resultElement).toMatchObject(matchingElement!)
      })
    })
  })
  describe("findUsersByAuthName", () => {
    it("should return the correct user data for a given auth name", async () => {
      const result = await legacyDbDalInstance.findUsersByAuthName("testuser")

      const want = [
        {
          id: 2,
          auth_name: "testuser",
          auth_key: "$1$6a7aabf1$tHpd7.FjG03D18kbREnsa1",
        },
      ]

      expect(result).toHaveLength(want.length)
      expect(result[0]).toMatchObject(want[0]!)
    })
  })
  describe("isUserAuthorizedToProject", () => {
    beforeEach(() => {})

    it("should return the project id if the user is authorized to the project", async () => {
      const result = await legacyDbDalInstance.isUserAuthorizedToProject(2, 1)

      const want = { id: 1 }

      expect(result).toMatchObject(want)
    })
    it("should return null if the user is does not exist", async () => {
      const result = await legacyDbDalInstance.isUserAuthorizedToProject(3, 1)

      const want = null

      expect(result).toBe(want)
    })
    it("should return null if the user is not authorized to the project", async () => {
      const userId = 3
      await createUser(userId, "testuser2")

      const result = await legacyDbDalInstance.isUserAuthorizedToProject(userId, 2)

      const want = null

      expect(result).toBe(want)

      await deleteUserIfExists(userId)
    })
  })
  describe("isUserAuthorizedToElementComponent", () => {
    it("should return the element component id if the user is authorized to the element component", async () => {
      const result = await legacyDbDalInstance.isUserAuthorizedToElementComponent(2, 5)

      const want = { id: 5 }

      expect(result).toMatchObject(want)
    })
    it("should return null if the user does not exist", async () => {
      const result = await legacyDbDalInstance.isUserAuthorizedToElementComponent(3, 5)

      const want = null

      expect(result).toBe(want)
    })
    it("should return null if the user is not authorized to the element component", async () => {
      const userId = 3
      await createUser(userId, "testuser2")

      const result = await legacyDbDalInstance.isUserAuthorizedToElementComponent(userId, 5)

      const want = null

      expect(result).toBe(want)

      await deleteUserIfExists(userId)
    })
  })
})
