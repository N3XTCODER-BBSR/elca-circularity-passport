"use server"

import { z } from "zod"
import { withServerActionErrorHandling } from "app/(utils)/errorHandler"
import {
  MaterialGeometry,
  PassportData,
  PassportDataSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { getProjectCircularityIndexData } from "../misc/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "../utils/calculate-circularity-data-for-layer"

const getCircularityForMaterial = (layer: CalculateCircularityDataForLayerReturnType) => {
  const parsedCircularityData = {
    eolPoints: layer.eolBuilt?.points,
    // TODO (M): clarify naming clash: sometimes we call it rebuiltPoints, sometimes dismantlingPoints
    rebuildPoints: layer.dismantlingPoints,
    circularityIndex: layer.circularityIndex,
    dismantlingPotentialClassId: layer.dismantlingPotentialClassId,
    methodologyVersion: "PLACEHOLDER (1.111111111)",
    proofReuse: layer.eolUnbuiltSpecificScenarioProofText,
    interferingSubstances: layer.disturbingSubstanceSelections.map((s) => ({
      // TODO (M): check naming clash: className vs classId
      className: s.disturbingSubstanceClassId,
      description: s.disturbingSubstanceName,
    })),
  }

  return parsedCircularityData
}
const createMaterialForComponent = async (
  layer: CalculateCircularityDataForLayerReturnType,
  projectLifteTime: number,
  processDbName: string,
  unit: string,
  quantity: number
) => {
  const circularityData = getCircularityForMaterial(layer)
  // TODO (L): needs double check how to handle null values here
  const massInKg = layer.mass === null ? null : quantity * layer.mass

  return {
    layerIndex: layer.layer_position,
    name: layer.process_name,
    massInKg,
    // TODO (M): move this one level up to component?
    materialGeometry: {
      unit: unit as MaterialGeometry["unit"],
      amount: quantity,
    },
    // TODO (XL): get serviceLifeInYears from legacy db
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

// TODO (M): split this long function into smaller ones (this function should only be 'workflow orchestration' on high level)
export async function createPassportForProjectVariantId(projectVariantId: number, projectId: number) {
  return withServerActionErrorHandling(async () => {
    z.number().parse(projectVariantId)
    z.number().parse(projectId)

    const session = await ensureUserIsAuthenticated()

    await ensureUserAuthorizationToProject(Number(session.user.id), Number(projectId))

    const project = await legacyDbDalInstance.getProjectWithVaraitnsAndProcessDbById(Number(projectId))

    if (!project) throw new Error("Project not found!")

    const projectLifeTime = project.life_time

    const uuid = crypto.randomUUID()

    const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
      await getProjectCircularityIndexData(Number(projectVariantId), Number(projectId))

    const buildingComponents = await Promise.all(
      circularityData.map(async (component) => {
        return {
          uuid: component.element_uuid,
          name: component.element_name,
          costGroupDIN276: component.din_code,
          materials: await Promise.all(
            component.layers.map((l) =>
              createMaterialForComponent(
                l,
                projectLifeTime,
                project.process_dbs.name,
                component.unit,
                component.quantity
              )
            )
          ),
        }
      })
    )

    const totalBuildingMass = buildingComponents.reduce((acc, component) => {
      return (
        acc +
        component.materials.reduce((acc2, material) => {
          return acc2 + (material.massInKg || 0)
        }, 0)
      )
    }, 0)

    //   TODO: move version tag to a constant in the verioned schema/function module
    const now = new Date()
    const fiftyYearsFromNow = new Date()
    fiftyYearsFromNow.setFullYear(now.getFullYear() + 50)
    const nowAsStr = now.toISOString().split("T")[0]!

    const relevantPassportDataFromLegacyDb =
      await legacyDbDalInstance.getPassportRelevantDataForProjectVariantFromLegacyDb(projectVariantId)

    const address = `${relevantPassportDataFromLegacyDb?.project_locations?.street}, ${relevantPassportDataFromLegacyDb?.project_locations?.postcode} ${relevantPassportDataFromLegacyDb?.project_locations?.city} (${relevantPassportDataFromLegacyDb?.project_locations?.country})`

    const passportInputData = {
      uuid,
      date: nowAsStr,
      authorName: "PLACEHOLDER",
      generatorSoftware: {
        name: "BuildingPassportGen",
        //   TODO: move this out into central place (probably most of the to generate fields)
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

    // TODO (M): replace 'any' here with a more specific type to at least cover some basic/obvious type issues (like presence of a field) at compile time already
    const parsedPassportData: PassportData = PassportDataSchema.parse(passportInputData)

    await dbDalInstance.createNewPassportForProjectVariantId(
      uuid,
      String(projectVariantId),
      // TODO (L): set the version tag in a clean way
      "v0.0.1",
      parsedPassportData,
      now,
      fiftyYearsFromNow
    )
  })
}
