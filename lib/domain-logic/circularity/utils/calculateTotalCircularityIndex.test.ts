import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"
import { calculateTotalCircularityIndexForProject } from "./calculateTotalCircularityIndex"

describe("calculateTotalCircularityIndexForProject", () => {
  // Test that verifies the fix for considering component quantity in CI calculation
  test("should correctly consider component quantity when calculating total circularity index", () => {
    const mockCircularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] = [
      {
        element_uuid: "element-1",
        element_type_name: "Type 1",
        element_name: "Element 1",
        din_code: 123,
        unit: "m²",
        quantity: 2, // This component appears twice in the project
        layers: [
          {
            component_id: 1,
            element_uuid: "element-1",
            is_layer: true,
            layer_position: 1,
            process_name: "Process 1",
            oekobaudat_process_uuid: "process-uuid-1",
            pdb_name: "PDB 1",
            pdb_version: "1.0",
            oekobaudat_process_db_uuid: "db-uuid-1",
            element_name: "Element 1",
            unit: "m²",
            quantity: 1,
            layer_size: 10,
            layer_length: 10,
            layer_width: 1,
            process_config_density: 1000,
            process_config_id: 1,
            process_config_name: "Config 1",
            process_category_node_id: 1,
            process_category_ref_num: "1",

            // Enriched properties
            mass: 100,
            volume: 0.1,
            isExcluded: false,
            isLayer: true,
            disturbingSubstanceSelections: [],
            eolUnbuiltSpecificScenarioProofText: null,
            disturbingEolScenarioForS4: null,

            // Circularity data
            circularityIndex: 0.8,
            dismantlingPoints: 0.9,
            disturbingSubstances: {
              noDisturbingSubstancesOrOnlyNullClassesSelected: true,
              hasS4DisturbingSubstance: false,
            },
            eolUnbuilt: null,
            eolBuilt: {
              points: 0.7,
              className: "A",
            },
          },
        ],
      },
      {
        element_uuid: "element-2",
        element_type_name: "Type 2",
        element_name: "Element 2",
        din_code: 456,
        unit: "m²",
        quantity: 3, // This component appears three times in the project
        layers: [
          {
            component_id: 2,
            element_uuid: "element-2",
            is_layer: true,
            layer_position: 1,
            process_name: "Process 2",
            oekobaudat_process_uuid: "process-uuid-2",
            pdb_name: "PDB 2",
            pdb_version: "1.0",
            oekobaudat_process_db_uuid: "db-uuid-2",
            element_name: "Element 2",
            unit: "m²",
            quantity: 1,
            layer_size: 5,
            layer_length: 5,
            layer_width: 1,
            process_config_density: 2000,
            process_config_id: 2,
            process_config_name: "Config 2",
            process_category_node_id: 2,
            process_category_ref_num: "2",

            // Enriched properties
            mass: 50,
            volume: 0.05,
            isExcluded: false,
            isLayer: true,
            disturbingSubstanceSelections: [],
            eolUnbuiltSpecificScenarioProofText: null,
            disturbingEolScenarioForS4: null,

            // Circularity data
            circularityIndex: 0.6,
            dismantlingPoints: 0.5,
            disturbingSubstances: {
              noDisturbingSubstancesOrOnlyNullClassesSelected: true,
              hasS4DisturbingSubstance: false,
            },
            eolUnbuilt: null,
            eolBuilt: {
              points: 0.6,
              className: "B",
            },
          },
        ],
      },
    ]

    // Act
    // Test with volume as dimensional field
    const resultWithVolume = calculateTotalCircularityIndexForProject(mockCircularityData, "volume")

    // Test with mass as dimensional field
    const resultWithMass = calculateTotalCircularityIndexForProject(mockCircularityData, "mass")

    // Assert
    // Expected calculations for volume:
    // Element 1: quantity = 2, volume = 0.1, CI = 0.8
    // Element 2: quantity = 3, volume = 0.05, CI = 0.6
    // Total volume = (2 * 0.1) + (3 * 0.05) = 0.2 + 0.15 = 0.35
    // Weighted CI = ((2 * 0.1 * 0.8) + (3 * 0.05 * 0.6)) / 0.35 = (0.16 + 0.09) / 0.35 = 0.25 / 0.35 = 0.714...
    expect(resultWithVolume).toBeCloseTo(0.7143, 4)

    // Expected calculations for mass:
    // Element 1: quantity = 2, mass = 100, CI = 0.8
    // Element 2: quantity = 3, mass = 50, CI = 0.6
    // Total mass = (2 * 100) + (3 * 50) = 200 + 150 = 350
    // Weighted CI = ((2 * 100 * 0.8) + (3 * 50 * 0.6)) / 350 = (160 + 90) / 350 = 250 / 350 = 0.714...
    expect(resultWithMass).toBeCloseTo(0.7143, 4)
  })
})
