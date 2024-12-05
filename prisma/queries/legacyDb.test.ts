import { getElcaComponentDataByLayerIdAndUserId, getElcaProjectComponentsByInstanceIdAndUserId } from "./legacyDb"

describe("legacyDb", () => {
  describe("getElcaComponentDataByLayerIdAndUserId", () => {
    it("should return the correct component data for a given layer ID", async () => {
      const result = await getElcaComponentDataByLayerIdAndUserId(5)

      const want = {
        life_cycle_ident: "A1-3",
        component_id: 5,
        layer_position: 1,
        process_name: "Beton der Druckfestigkeitsklasse C 30/37",
        process_ref_value: 1,
        process_ref_unit: "m3",
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
  describe("getElcaProjectComponentsByInstanceIdAndUserId", () => {
    it("should return the correct project components for a given instance ID and user ID", async () => {
      const result = await getElcaProjectComponentsByInstanceIdAndUserId("32af2f0b-d7d8-4fb1-8354-1e9736d4f513", "2")

      const want = [
        {
          access_group_id: 3,
          element_uuid: "32af2f0b-d7d8-4fb1-8354-1e9736d4f513",
          component_id: 5,
          layer_position: 1,
          process_name: "Beton der Druckfestigkeitsklasse C 30/37",
          process_ref_value: 1,
          process_ref_unit: "m3",
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
          process_ref_value: 1,
          process_ref_unit: "m2",
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
          process_ref_value: 1,
          process_ref_unit: "kg",
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
})
