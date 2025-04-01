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

import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { PassportData, PassportDataSchema } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { PassportMetadata } from "prisma/queries/db"
import { getProjectCircularityData } from "../misc/getProjectCircularityData"

/**
 * Gets the circularity data for a material
 *
 * @param layer The layer data with circularity information
 * @returns The formatted circularity data for the passport
 */
function getCircularityForMaterial(layer: CalculateCircularityDataForLayerReturnType) {
  return {
    eolPoints: layer.eolBuilt?.points,
    rebuildPoints: layer.dismantlingPoints,
    circularityIndex: layer.circularityIndex,
    dismantlingPotentialClassId: layer.dismantlingPotentialClassId,
    methodologyVersion: "PLACEHOLDER (1.111111111)",
    proofReuse: layer.eolUnbuiltSpecificScenarioProofText,
    interferingSubstances: layer.disturbingSubstanceSelections.map((s) => ({
      className: s.disturbingSubstanceClassId,
      description: s.disturbingSubstanceName,
    })),
  }
}

/**
 * Creates a material object for a component in the passport
 *
 * @param layer The layer data with circularity information
 * @param projectLifeTime The project life time
 * @param processDbName The process database name
 * @param unit The unit of measurement
 * @param quantity The quantity
 * @returns The formatted material data for the passport
 */
async function createMaterialForComponent(
  layer: CalculateCircularityDataForLayerReturnType,
  projectLifeTime: number,
  processDbName: string,
  unit: string,
  quantity: number
) {
  const circularityData = getCircularityForMaterial(layer)
  const massInKg = layer.mass === null ? null : quantity * layer.mass

  return {
    layerIndex: layer.layer_position,
    name: layer.process_name,
    massInKg,
    volume: layer.volume,
    materialGeometry: {
      unit: unit,
      amount: quantity,
    },
    serviceLifeInYears: 50,
    serviceLifeTableVersion: "1.11111",
    trade: {
      lbPerformanceRange: "PLACEHOLDER (High)",
      trade: "PLACEHOLDER (e.g. Masonry)",
      lvNumber: "PLACEHOLDER (LV-123)",
      itemInLv: "PLACEHOLDER (Brick Wall 24cm)",
    },
    genericMaterial: {
      uuid: layer.oekobaudat_process_uuid,
      name: layer.tBaustoffProductData?.name,
      classId: String(layer.process_category_ref_num?.split(".")[0]),
      classDescription: layer.process_name,
      oekobaudatDbVersion: processDbName,
    },
    circularity: circularityData,
    pollutants: {},
  }
}

/**
 * Gets passport-relevant data for a project variant from the legacy database
 *
 * @param projectVariantId The project variant ID
 * @returns Promise with the relevant passport data
 */
async function getPassportRelevantDataForProjectVariant(projectVariantId: number) {
  return legacyDbDalInstance.getPassportRelevantDataForProjectVariantFromLegacyDb(projectVariantId)
}

/**
 * Gets the project with variants and process database by ID
 *
 * @param projectId The project ID
 * @returns Promise with the project data
 */
async function getProjectWithVariantsAndProcessDb(projectId: number) {
  return legacyDbDalInstance.getProjectWithVaraitnsAndProcessDbById(projectId)
}

/**
 * Calculates the total building mass from building components
 *
 * @param buildingComponents The building components data
 * @returns The total building mass
 */
function calculateTotalBuildingMass(buildingComponents: Array<{ materials: Array<{ massInKg: number | null }> }>) {
  return buildingComponents.reduce((acc, component) => {
    return (
      acc +
      component.materials.reduce((acc2: number, material) => {
        return acc2 + (material.massInKg || 0)
      }, 0)
    )
  }, 0)
}

/**
 * Creates a new passport for a project variant
 *
 * @param uuid The UUID for the new passport
 * @param projectVariantId The project variant ID to create the passport for
 * @param versionTag The version tag for the passport
 * @param passportData The passport data
 * @param issueDate The date when the passport is issued
 * @param expiryDate The date when the passport expires
 * @returns Promise that resolves when the passport is created
 */
async function createNewPassportForProjectVariantId(
  uuid: string,
  projectVariantId: string,
  versionTag: string,
  passportData: PassportData,
  issueDate: Date,
  expiryDate: Date
) {
  return dbDalInstance.createNewPassportForProjectVariantId(
    uuid,
    projectVariantId,
    versionTag,
    passportData,
    issueDate,
    expiryDate
  )
}

/**
 * Creates a complete passport for a project variant, coordinating all necessary data gathering and processing steps
 *
 * @param projectVariantId The ID of the project variant
 * @param projectId The ID of the project
 * @returns Promise that resolves when the passport has been created
 */
export async function createCompletePassportForProjectVariant(projectVariantId: number, projectId: number) {
  const project = await getProjectWithVariantsAndProcessDb(Number(projectId))

  if (!project) throw new Error("Project not found!")

  const projectLifeTime = project.life_time

  const uuid = crypto.randomUUID()

  const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await getProjectCircularityData(Number(projectVariantId), Number(projectId))

  const buildingComponents = await Promise.all(
    circularityData.map(async (component) => {
      return {
        uuid: component.element_uuid,
        name: component.element_name,
        costGroupDIN276: component.din_code,
        materials: await Promise.all(
          component.layers.map(async (l: CalculateCircularityDataForLayerReturnType) =>
            createMaterialForComponent(l, projectLifeTime, project.process_dbs.name, component.unit, component.quantity)
          )
        ),
      }
    })
  )

  const totalBuildingMass = calculateTotalBuildingMass(buildingComponents)

  // TODO: move version tag to a constant in the versioned schema/function module
  const now = new Date()
  const fiftyYearsFromNow = new Date()
  fiftyYearsFromNow.setFullYear(now.getFullYear() + 50)
  const nowAsStr = now.toISOString().split("T")[0]!

  const relevantPassportDataFromLegacyDb = await getPassportRelevantDataForProjectVariant(projectVariantId)

  const address = `${relevantPassportDataFromLegacyDb?.project_locations?.street}, ${relevantPassportDataFromLegacyDb?.project_locations?.postcode} ${relevantPassportDataFromLegacyDb?.project_locations?.city} (${relevantPassportDataFromLegacyDb?.project_locations?.country})`

  const passportInputData = {
    uuid,
    date: nowAsStr,
    authorName: "PLACEHOLDER",
    generatorSoftware: {
      name: "BuildingPassportGen",
      // TODO: move this out into central place (probably most of the to generate fields)
      version: "0.0.1",
      url: "bauteileditor.de",
    },
    elcaProjectId: String(relevantPassportDataFromLegacyDb?.project_id),
    projectName: relevantPassportDataFromLegacyDb?.name,
    dataSchemaVersion: "PLACEHOLDER",
    buildingBaseData: {
      buildingStructureId: {
        "ALKIS-ID": "PLACEHOLDER",
        Identifikationsnummer: "PLACEHOLDER",
        Aktenzeichen: "PLACEHOLDER",
        "Lokale Gebäude-ID": "PLACEHOLDER",
        "Nationale UUID": "PLACEHOLDER",
      },
      coordinates: {
        latitude: 1111111111111111,
        longitude: 1111111111111111,
      },
      address,
      buildingPermitYear: 1111111111111111,
      buildingCompletionYear: relevantPassportDataFromLegacyDb?.created.getFullYear() || 1111111111111111,
      buildingType: "PLACEHOLDER",
      numberOfUpperFloors: 1111111111111111,
      numberOfBasementFloors: 1111111111111111,
      plotArea: relevantPassportDataFromLegacyDb?.project_constructions?.property_size?.toNumber(),
      nrf: relevantPassportDataFromLegacyDb?.project_constructions?.net_floor_space?.toNumber(),
      bgf: Number(relevantPassportDataFromLegacyDb?.project_constructions?.gross_floor_space),
      bri: 1111111111111111,
      totalBuildingMass,
    },
    buildingComponents,
  }

  // Parse the data to ensure it conforms to the passport schema
  const parsedPassportData: PassportData = PassportDataSchema.parse(passportInputData)

  // Create and store the new passport
  await createNewPassportForProjectVariantId(
    uuid,
    String(projectVariantId),
    // TODO: set the version tag in a clean way
    "v0.0.1",
    parsedPassportData,
    now,
    fiftyYearsFromNow
  )

  return parsedPassportData
} /**
 * Retrieves metadata for all passports associated with a project variant.
 *
 * @param variantId The ID of the project variant
 * @returns An array of passport metadata
 */

export async function getPassportsMetadataForProjectVariant(variantId: number): Promise<PassportMetadata[]> {
  return dbDalInstance.getMetaDataForAllPassportsForProjectVariantId(variantId)
}
