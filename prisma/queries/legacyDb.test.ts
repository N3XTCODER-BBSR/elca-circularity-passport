import { getElcaComponentDataByLayerIdAndUserId } from "./legacyDb"

describe("legacyDb", () => {
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
