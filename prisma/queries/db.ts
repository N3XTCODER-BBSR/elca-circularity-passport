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
import { Prisma, TBs_ProductDefinition } from "prisma/generated/client"
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
  getReleases = async (): Promise<{ uuid: string; tag: string | null }[]> => {
    const rows = await prisma.tBS_Release.findMany({
      select: { uuid: true, tag: true },
    })
    return rows
  }
  createOneTimePdfToken = async ({
    token,
    userId,
    projectId,
    variantId,
    expiresAt,
  }: {
    token: string
    userId: string
    projectId: number
    variantId: number
    expiresAt: Date
  }) => {
    return await prisma.oneTimePdfToken.create({
      data: {
        token,
        userId,
        projectId,
        variantId,
        expiresAt,
        used: false,
      },
    })
  }

  getOneProductInRelease = async (
    releaseUuid: string,
    productUuid: string
  ): Promise<
    | (TBs_ProductDefinition & {
        releaseUuid: string | null
        eolCategory?: {
          name: string
          categoryUuid: string | null
          eolScenarioUnbuiltReal: TBs_ProductDefinitionEOLCategoryScenario
          eolScenarioUnbuiltPotential: TBs_ProductDefinitionEOLCategoryScenario
          technologyFactor: number
        } | null
        oekobaudatMappings: { oebdProcessUuid: string; oebdReleaseUuid: string }[]
      })
    | null
  > => {
    const p = await prisma.tBs_ProductDefinition.findFirst({
      where: {
        uuid: productUuid,
        tBs_ProductDefinitionEOLCategory: {
          releaseUuid: releaseUuid,
        },
      },
      include: {
        tBs_ProductDefinitionEOLCategory: {
          select: {
            releaseUuid: true,
            uuid: true,
            name: true,
            eolScenarioUnbuiltReal: true,
            eolScenarioUnbuiltPotential: true,
            technologyFactor: true,
          },
        },
        oekobaudatTBaustoffMappings: {
          select: {
            oebd_processUuid: true,
            oebd_versionUuid: true,
          },
        },
      },
    })

    if (!p) return null

    return {
      id: p.id,
      uuid: p.uuid,
      name: p.name,
      processCategoryNumber: p.processCategoryNumber,
      tBs_ProductDefinitionEOLCategoryId: p.tBs_ProductDefinitionEOLCategoryId,
      releaseUuid: p.tBs_ProductDefinitionEOLCategory?.releaseUuid ?? null,
      eolCategory: p.tBs_ProductDefinitionEOLCategory
        ? {
            name: p.tBs_ProductDefinitionEOLCategory.name,
            categoryUuid: p.tBs_ProductDefinitionEOLCategory.uuid ?? null,
            eolScenarioUnbuiltReal: p.tBs_ProductDefinitionEOLCategory.eolScenarioUnbuiltReal,
            eolScenarioUnbuiltPotential: p.tBs_ProductDefinitionEOLCategory.eolScenarioUnbuiltPotential,
            technologyFactor: p.tBs_ProductDefinitionEOLCategory.technologyFactor,
          }
        : null,
      oekobaudatMappings: p.oekobaudatTBaustoffMappings.map((m) => ({
        oebdProcessUuid: m.oebd_processUuid,
        oebdReleaseUuid: m.oebd_versionUuid,
      })),
    }
  }

  findOneTimePdfToken = async (token: string) => {
    return await prisma.oneTimePdfToken.findUnique({
      where: { token },
    })
  }

  markOneTimePdfTokenAsUsed = async (token: string) => {
    return await prisma.oneTimePdfToken.update({
      where: { token },
      data: { used: true },
    })
  }

  getAvailableTBaustoffProducts = async () => {
    const results = await prisma.tBs_ProductDefinition.findMany({
      select: {
        id: true,
        name: true,
        processCategoryNumber: true,
      },
    })
    return results
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
    const result = await prisma.userEnrichedProductData.findMany({
      where: {
        elcaElementComponentId: {
          in: componentIds,
        },
      },
      include: {
        selectedDisturbingSubstances: true,
      },
    })
    return result
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
      where: { elcaElementComponentId: layerId },
      update: {
        dismantlingPotentialClassId: selectedDismantlingPotentialClassId,
        // If we're setting the class to null, also clear the remark
        ...(selectedDismantlingPotentialClassId === null ? { dismantlingPotentialClassRemark: null } : {}),
      },
      create: {
        elcaElementComponentId: layerId,
        dismantlingPotentialClassId: selectedDismantlingPotentialClassId,
        tBaustoffProductSelectedByUser: false,
      },
    })
  }

  upsertUserEnrichedProductDataWithDismantlingRemark = async (layerId: number, remark: string | null) => {
    return await prisma.userEnrichedProductData.upsert({
      where: { elcaElementComponentId: layerId },
      update: {
        dismantlingPotentialClassRemark: remark,
      },
      create: {
        elcaElementComponentId: layerId,
        dismantlingPotentialClassRemark: remark,
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
    const result = await prisma.userEnrichedProductData.findUnique({
      where: {
        elcaElementComponentId: componentId,
      },
      include: {
        selectedDisturbingSubstances: true,
      },
    })
    return result
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

  getAllProdcutsInRelease = async (
    releaseUuid: string
  ): Promise<
    (Omit<TBs_ProductDefinition, "id"> & {
      releaseUuid: string | null
      eolCategory?: {
        name: string
        categoryUuid: string | null
        eolScenarioUnbuiltReal: TBs_ProductDefinitionEOLCategoryScenario
        eolScenarioUnbuiltPotential: TBs_ProductDefinitionEOLCategoryScenario
        technologyFactor: number
      } | null
      oekobaudatMappings: { oebdProcessUuid: string; oebdReleaseUuid: string }[]
    })[]
  > => {
    const products = await prisma.tBs_ProductDefinition.findMany({
      where: {
        tBs_ProductDefinitionEOLCategory: {
          releaseUuid: releaseUuid,
        },
      },
      include: {
        tBs_ProductDefinitionEOLCategory: {
          select: {
            releaseUuid: true,
            uuid: true,
            name: true,
            eolScenarioUnbuiltReal: true,
            eolScenarioUnbuiltPotential: true,
            technologyFactor: true,
          },
        },
        oekobaudatTBaustoffMappings: {
          select: {
            oebd_processUuid: true,
            oebd_versionUuid: true,
          },
        },
      },
    })
    return products.map((p) => ({
      // spread original product fields
      uuid: p.uuid,
      name: p.name,
      processCategoryNumber: p.processCategoryNumber,
      tBs_ProductDefinitionEOLCategoryId: p.tBs_ProductDefinitionEOLCategoryId,
      // add top-level releaseUuid
      releaseUuid: p.tBs_ProductDefinitionEOLCategory?.releaseUuid ?? null,
      // normalized eolCategory
      eolCategory: p.tBs_ProductDefinitionEOLCategory
        ? {
            name: p.tBs_ProductDefinitionEOLCategory.name,
            categoryUuid: p.tBs_ProductDefinitionEOLCategory.uuid ?? null,
            eolScenarioUnbuiltReal: p.tBs_ProductDefinitionEOLCategory.eolScenarioUnbuiltReal,
            eolScenarioUnbuiltPotential: p.tBs_ProductDefinitionEOLCategory.eolScenarioUnbuiltPotential,
            technologyFactor: p.tBs_ProductDefinitionEOLCategory.technologyFactor,
          }
        : null,
      // mappings
      oekobaudatMappings: p.oekobaudatTBaustoffMappings.map((m) => ({
        oebdProcessUuid: m.oebd_processUuid,
        oebdReleaseUuid: m.oebd_versionUuid,
      })),
    }))
  }

  // TODO: uncomment this when the release is in the product table
  // getOneProductInRelease = async (releaseUuid: string, productUuid: string) => {
  //   return prisma.tBs_ProductDefinition.findFirst({
  //     where: {
  //       releaseUuid: releaseUuid,
  //       uuid: productUuid,
  //     },
  //   })
  // }
}
