import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "./calculate-circularity-data-for-layer"
import { calculateTotalMetricValuesForProject } from "./calculateTotalMetricValues"

describe("calculateTotalMetricValuesForProject", () => {
  // Test that verifies the fix for considering component quantity in CI calculation
  test("should correctly consider component quantity when calculating total metric values", () => {
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
            productUnit: "m²",
            productQuantity: 1,
            quantity: 1,
            layer_size: 10,
            layer_length: 10,
            layer_width: 1,
            layer_area_ratio: null,
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
            tBaustoffProductSelectedByUser: undefined,
            tBaustoffProductData: null,
            dismantlingPotentialClassId: null,
            eolUnbuiltSpecificScenario: null,

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
            productUnit: "m²",
            productQuantity: 1,
            quantity: 1,
            layer_size: 5,
            layer_length: 5,
            layer_width: 1,
            layer_area_ratio: null,
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
            tBaustoffProductSelectedByUser: undefined,
            tBaustoffProductData: null,
            dismantlingPotentialClassId: null,
            eolUnbuiltSpecificScenario: null,

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
    const resultWithVolume = calculateTotalMetricValuesForProject(mockCircularityData, "volume")

    // Test with mass as dimensional field
    const resultWithMass = calculateTotalMetricValuesForProject(mockCircularityData, "mass")

    // Assert for volume-based calculations
    // Expected calculations for circularityIndex with volume:
    // Element 1: quantity = 2, volume = 0.1, CI = 0.8
    // Element 2: quantity = 3, volume = 0.05, CI = 0.6
    // Total volume = (2 * 0.1) + (3 * 0.05) = 0.2 + 0.15 = 0.35
    // Weighted CI = ((2 * 0.1 * 0.8) + (3 * 0.05 * 0.6)) / 0.35 = (0.16 + 0.09) / 0.35 = 0.25 / 0.35 = 0.714...
    expect(resultWithVolume.circularityIndex).toBeCloseTo(0.7143, 4)

    // Expected calculations for eolBuiltPoints with volume:
    // Element 1: quantity = 2, volume = 0.1, eolBuiltPoints = 0.7
    // Element 2: quantity = 3, volume = 0.05, eolBuiltPoints = 0.6
    // Total volume = (2 * 0.1) + (3 * 0.05) = 0.2 + 0.15 = 0.35
    // Weighted eolBuiltPoints = ((2 * 0.1 * 0.7) + (3 * 0.05 * 0.6)) / 0.35 = (0.14 + 0.09) / 0.35 = 0.23 / 0.35 = 0.657...
    expect(resultWithVolume.eolBuiltPoints).toBeCloseTo(0.6571, 4)

    // Expected calculations for dismantlingPoints with volume:
    // Element 1: quantity = 2, volume = 0.1, dismantlingPoints = 0.9
    // Element 2: quantity = 3, volume = 0.05, dismantlingPoints = 0.5
    // Total volume = (2 * 0.1) + (3 * 0.05) = 0.2 + 0.15 = 0.35
    // Weighted dismantlingPoints = ((2 * 0.1 * 0.9) + (3 * 0.05 * 0.5)) / 0.35 = (0.18 + 0.075) / 0.35 = 0.255 / 0.35 = 0.729...
    expect(resultWithVolume.dismantlingPoints).toBeCloseTo(0.7286, 4)

    // Assert for mass-based calculations
    // Expected calculations for circularityIndex with mass:
    // Element 1: quantity = 2, mass = 100, CI = 0.8
    // Element 2: quantity = 3, mass = 50, CI = 0.6
    // Total mass = (2 * 100) + (3 * 50) = 200 + 150 = 350
    // Weighted CI = ((2 * 100 * 0.8) + (3 * 50 * 0.6)) / 350 = (160 + 90) / 350 = 250 / 350 = 0.714...
    expect(resultWithMass.circularityIndex).toBeCloseTo(0.7143, 4)

    // Expected calculations for eolBuiltPoints with mass:
    // Element 1: quantity = 2, mass = 100, eolBuiltPoints = 0.7
    // Element 2: quantity = 3, mass = 50, eolBuiltPoints = 0.6
    // Total mass = (2 * 100) + (3 * 50) = 200 + 150 = 350
    // Weighted eolBuiltPoints = ((2 * 100 * 0.7) + (3 * 50 * 0.6)) / 350 = (140 + 90) / 350 = 230 / 350 = 0.657...
    expect(resultWithMass.eolBuiltPoints).toBeCloseTo(0.6571, 4)

    // Expected calculations for dismantlingPoints with mass:
    // Element 1: quantity = 2, mass = 100, dismantlingPoints = 0.9
    // Element 2: quantity = 3, mass = 50, dismantlingPoints = 0.5
    // Total mass = (2 * 100) + (3 * 50) = 200 + 150 = 350
    // Weighted dismantlingPoints = ((2 * 100 * 0.9) + (3 * 50 * 0.5)) / 350 = (180 + 75) / 350 = 255 / 350 = 0.729...
    expect(resultWithMass.dismantlingPoints).toBeCloseTo(0.7286, 4)
  })
})
