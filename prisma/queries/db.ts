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
import { PassportData } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import {
  DismantlingPotentialClassId,
  DisturbingSubstanceClassId,
  TBs_ProductDefinitionEOLCategoryScenario,
} from "prisma/generated/client"
import { Prisma } from "prisma/generated/client"
import { prisma } from "prisma/prismaClient"

const passportMetaDataSelect: Prisma.PassportSelect = {
  uuid: true,
  projectVariantId: true,
  versionTag: true,
  issueDate: true,
  expiryDate: true,
}

export type PassportMetadata = Prisma.PassportGetPayload<{
  select: typeof passportMetaDataSelect
}>

export class DbDal {
  getAvailableTBaustoffProducts = async () => {
    return await prisma.tBs_ProductDefinition.findMany({
      select: {
        id: true,
        name: true,
      },
    })
  }

  getTBaustoffProducts = async (tBaustoffProductIds: number[]) => {
    return await prisma.tBs_ProductDefinition.findMany({
      where: {
        id: {
          in: tBaustoffProductIds,
        },
      },
      include: {
        tBs_ProductDefinitionEOLCategory: true,
      },
    })
  }

  getUserDefinedTBaustoffData = async (componentIds: number[]) => {
    return await prisma.userEnrichedProductData.findMany({
      where: {
        elcaElementComponentId: {
          in: componentIds,
        },
      },
      include: {
        selectedDisturbingSubstances: true,
      },
    })
  }

  getExcludedProductIds = async (productIds: number[]) => {
    return await prisma.excludedProduct.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      select: {
        productId: true,
      },
    })
  }

  getExcludedProductId = async (productId: number) => {
    return await prisma.excludedProduct.findUnique({
      where: {
        productId,
      },
    })
  }

  toggleExcludedProduct = async (productId: number) => {
    await prisma.$transaction(async (tx) => {
      try {
        await tx.excludedProduct.delete({ where: { productId } })
      } catch (error) {
        await tx.excludedProduct.create({ data: { productId } })
      }
    })
  }

  truncateExcludedProductTable = async () => {
    return await prisma.$executeRaw`TRUNCATE TABLE "ExcludedProduct" RESTART IDENTITY CASCADE;`
  }

  getTBaustoffMappingEntries = async (oekobaudatProcessUuids: string[], oebd_versionUuid: string) => {
    return await prisma.tBs_OekobaudatMapping.findMany({
      where: {
        oebd_processUuid: {
          in: oekobaudatProcessUuids,
        },
        oebd_versionUuid: oebd_versionUuid,
      },
    })
  }

  upsertUserEnrichedProductDataByLayerId = async (
    layerId: number,
    selectedDismantlingPotentialClassId: DismantlingPotentialClassId | null
  ) => {
    return await prisma.userEnrichedProductData.upsert({
      // TODO (XL): IMPORTANT: add checks here for:
      // 1. user has access to the project and layer
      // 2. that there is not already a match found by the OBD-tBaustoff mapping
      // 3. if the layerId exists in the database
      where: { elcaElementComponentId: layerId },
      update: {
        dismantlingPotentialClassId: selectedDismantlingPotentialClassId,
      },
      create: {
        elcaElementComponentId: layerId,
        dismantlingPotentialClassId: selectedDismantlingPotentialClassId,
        tBaustoffProductSelectedByUser: false,
      },
    })
  }

  upsertUserEnrichedProductDataWithEolScenario = async (
    layerId: number,
    specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
    specificEolUnbuiltTotalScenarioProofText: string
  ) => {
    return await prisma.userEnrichedProductData.upsert({
      // TODO (XL): add checks here for:
      // 1. user has access to the project and layer
      // 2. that there is not already a match found by out OBD-tBaustoff mapping
      // 3. if the layerId exists in the database
      where: { elcaElementComponentId: layerId },
      update: {
        specificEolUnbuiltTotalScenario: specificScenario,
        specificEolUnbuiltTotalScenarioProofText,
      },
      create: {
        elcaElementComponentId: layerId,
        specificEolUnbuiltTotalScenario: specificScenario,
        tBaustoffProductSelectedByUser: false,
      },
    })
  }

  upsertUserEnrichedProductDataWithTBaustoffProduct = async (layerId: number, selectedId: number) => {
    return await prisma.userEnrichedProductData.upsert({
      // TODO (XL): add checks here for:
      // 1. user has access to the project and layer
      // 2. that there is not already a match found by out OBD-tBaustoff mapping
      // 3. if the layerId exists in the database
      where: { elcaElementComponentId: layerId },
      update: {
        tBaustoffProductDefinitionId: selectedId,
        specificEolUnbuiltTotalScenario: null,
        specificEolUnbuiltTotalScenarioProofText: null,
        dismantlingPotentialClassId: null,
        disturbingEolScenarioForS4: null,
      },
      create: {
        elcaElementComponentId: layerId,
        tBaustoffProductDefinitionId: selectedId,
        tBaustoffProductSelectedByUser: true,
      },
    })
  }

  deleteDisturbingSubstanceSelectionsByLayerId = async (layerId: number) => {
    return await prisma.disturbingSubstanceSelection.deleteMany({
      where: {
        userEnrichedProductDataElcaElementComponentId: layerId,
      },
    })
  }

  upsertUserEnrichedProductData = async (layerId: number) => {
    return await prisma.userEnrichedProductData.upsert({
      where: { elcaElementComponentId: layerId },
      update: {},
      create: {
        elcaElementComponentId: layerId,
        tBaustoffProductSelectedByUser: false,
      },
    })
  }

  updateDisturbingSubstanceSelection = async (
    id: number,
    updateData: Prisma.DisturbingSubstanceSelectionUpdateInput
  ) => {
    return await prisma.disturbingSubstanceSelection.update({
      where: { id },
      data: updateData,
    })
  }

  createDisturbingSubstanceSelection = async (createData: Prisma.DisturbingSubstanceSelectionCreateInput) => {
    return await prisma.disturbingSubstanceSelection.create({
      data: createData,
    })
  }

  findDisturbingSubstancesByLayerIdAndClassId = async (layerId: number, classId: DisturbingSubstanceClassId) => {
    return await prisma.disturbingSubstanceSelection.findMany({
      where: {
        userEnrichedProductDataElcaElementComponentId: layerId,
        disturbingSubstanceClassId: classId,
      },
    })
  }

  updateUserEnrichedProductDataDisturbingEolScenario = async (layerId: number) => {
    return await prisma.userEnrichedProductData.update({
      where: {
        elcaElementComponentId: layerId,
      },
      data: {
        disturbingEolScenarioForS4: null,
      },
    })
  }

  deleteDisturbingSubstanceSelectionById = async (id: number) => {
    return await prisma.disturbingSubstanceSelection.delete({
      where: {
        id,
      },
    })
  }

  upsertDisturbingEolScenarioForS4 = async (
    layerId: number,
    specificScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
  ) => {
    return await prisma.userEnrichedProductData.upsert({
      where: { elcaElementComponentId: layerId },
      update: {
        disturbingEolScenarioForS4: specificScenario,
      },
      create: {
        elcaElementComponentId: layerId,
        disturbingEolScenarioForS4: specificScenario,
        tBaustoffProductSelectedByUser: false,
      },
    })
  }

  getUserDefinedTBaustoffDataForComponentId = async (componentId: number) => {
    return await prisma.userEnrichedProductData.findUnique({
      where: {
        elcaElementComponentId: componentId,
      },
      include: {
        selectedDisturbingSubstances: true,
      },
    })
  }

  getTBaustoffMappingEntry = async (oekobaudatProcessUuid: string, oekobaudatProcessDbUuid: string) => {
    return await prisma.tBs_OekobaudatMapping.findUnique({
      where: {
        oebd_processUuid_oebd_versionUuid: {
          oebd_processUuid: oekobaudatProcessUuid,
          oebd_versionUuid: oekobaudatProcessDbUuid,
        },
      },
    })
  }

  getTBaustoffProduct = async (tBaustoffProductId: number) => {
    return await prisma.tBs_ProductDefinition.findUnique({
      where: {
        id: tBaustoffProductId,
      },
      include: {
        tBs_ProductDefinitionEOLCategory: true,
      },
    })
  }

  getPassportByUuid = async (uuid: string) => {
    return await prisma.passport.findUnique({
      where: {
        uuid,
      },
    })
  }

  getAllPassports = async () => {
    return await prisma.passport.findMany()
  }

  getMetaDataForAllPassportsForProjectVariantId = async (projectVariantId: number): Promise<PassportMetadata[]> => {
    return await prisma.passport.findMany({
      where: {
        projectVariantId: String(projectVariantId), // TODO: should be a number in the prisma schema
      },
      orderBy: {
        issueDate: "desc",
      },
      select: passportMetaDataSelect,
    })
  }

  createNewPassportForProjectVariantId = async (
    uuid: string,
    projectVariantId: string,
    versionTag: string,
    passportData: PassportData,
    issueDate: Date,
    expiryDate: Date
  ): Promise<PassportMetadata> => {
    return await prisma.passport.create({
      data: {
        uuid,
        projectVariantId,
        versionTag,
        passportData: JSON.stringify(passportData),
        issueDate,
        expiryDate,
      },
      select: passportMetaDataSelect,
    })
  }

  healthCheck = () => {
    return prisma.$queryRaw`SELECT 1`
  }
}
