import { PassportData } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import {
  DismantlingPotentialClassId,
  DisturbingSubstanceClassId,
  TBs_ProductDefinitionEOLCategoryScenario,
} from "prisma/generated/client"
import { Prisma } from "prisma/generated/client"
import { prisma } from "prisma/prismaClient"

export const getAvailableTBaustoffProducts = async () => {
  return await prisma.tBs_ProductDefinition.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export const getTBaustoffProducts = async (tBaustoffProductIds: number[]) => {
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

export const getUserDefinedTBaustoffData = async (componentIds: number[]) => {
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

export const getExcludedProductIds = async (productIds: number[]) => {
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

export const getExcludedProductId = async (productId: number) => {
  return await prisma.excludedProduct.findUnique({
    where: {
      productId,
    },
  })
}

export const toggleExcludedProduct = async (productId: number) => {
  await prisma.$transaction(async (tx) => {
    try {
      await tx.excludedProduct.delete({ where: { productId } })
    } catch (error) {
      await tx.excludedProduct.create({ data: { productId } })
    }
  })
}

export const truncateExcludedProductTable = async () => {
  return await prisma.$executeRaw`TRUNCATE TABLE "ExcludedProduct" RESTART IDENTITY CASCADE;`
}

export const getTBaustoffMappingEntries = async (oekobaudatProcessUuids: string[]) => {
  return await prisma.tBs_OekobaudatMapping.findMany({
    where: {
      oebd_processUuid: {
        in: oekobaudatProcessUuids,
      },
    },
  })
}

export const upsertUserEnrichedProductDataByLayerId = async (
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

export const upsertUserEnrichedProductDataWithEolScenario = async (
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

export const upsertUserEnrichedProductDataWithTBaustoffProduct = async (layerId: number, selectedId: number) => {
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

export const deleteDisturbingSubstanceSelectionsByLayerId = async (layerId: number) => {
  return await prisma.disturbingSubstanceSelection.deleteMany({
    where: {
      userEnrichedProductDataElcaElementComponentId: layerId,
    },
  })
}

export const upsertUserEnrichedProductData = async (layerId: number) => {
  return await prisma.userEnrichedProductData.upsert({
    where: { elcaElementComponentId: layerId },
    update: {},
    create: {
      elcaElementComponentId: layerId,
      tBaustoffProductSelectedByUser: false,
    },
  })
}

export const updateDisturbingSubstanceSelection = async (
  id: number,
  updateData: Prisma.DisturbingSubstanceSelectionUpdateInput
) => {
  return await prisma.disturbingSubstanceSelection.update({
    where: { id },
    data: updateData,
  })
}

export const createDisturbingSubstanceSelection = async (
  createData: Prisma.DisturbingSubstanceSelectionCreateInput
) => {
  return await prisma.disturbingSubstanceSelection.create({
    data: createData,
  })
}

export const findDisturbingSubstancesByLayerIdAndClassId = async (
  layerId: number,
  classId: DisturbingSubstanceClassId
) => {
  return await prisma.disturbingSubstanceSelection.findMany({
    where: {
      userEnrichedProductDataElcaElementComponentId: layerId,
      disturbingSubstanceClassId: classId,
    },
  })
}

export const updateUserEnrichedProductDataDisturbingEolScenario = async (layerId: number) => {
  return await prisma.userEnrichedProductData.update({
    where: {
      elcaElementComponentId: layerId,
    },
    data: {
      disturbingEolScenarioForS4: null,
    },
  })
}

export const deleteDisturbingSubstanceSelectionById = async (id: number) => {
  return await prisma.disturbingSubstanceSelection.delete({
    where: {
      id,
    },
  })
}

export const upsertDisturbingEolScenarioForS4 = async (
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

export const getUserDefinedTBaustoffDataForComponentId = async (componentId: number) => {
  return await prisma.userEnrichedProductData.findUnique({
    where: {
      elcaElementComponentId: componentId,
    },
    include: {
      selectedDisturbingSubstances: true,
    },
  })
}

export const getTBaustoffMappingEntry = async (oekobaudatProcessUuid: string, oekobaudatProcessDbUuid: string) => {
  return await prisma.tBs_OekobaudatMapping.findUnique({
    where: {
      oebd_processUuid_oebd_versionUuid: {
        oebd_processUuid: oekobaudatProcessUuid,
        oebd_versionUuid: "448d1096-2017-4901-a560-f652a83c737e", // TODO (XL): this is a hardcoded value, should be changed (could be available in the legacy project table)
      },
    },
  })
}

export const getTBaustoffProduct = async (tBaustoffProductId: number) => {
  return await prisma.tBs_ProductDefinition.findUnique({
    where: {
      id: tBaustoffProductId,
    },
    include: {
      tBs_ProductDefinitionEOLCategory: true,
    },
  })
}

export const getPassportByUuid = async (uuid: string) => {
  return await prisma.passport.findUnique({
    where: {
      uuid,
    },
  })
}

export const getAllPassports = async () => {
  return await prisma.passport.findMany()
}

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

export const getMetaDataForAllPassportsForProjectVariantId = async (
  projectVariantId: string
): Promise<PassportMetadata[]> => {
  return await prisma.passport.findMany({
    where: {
      projectVariantId,
    },
    orderBy: {
      issueDate: "desc",
    },
    select: passportMetaDataSelect,
  })
}

export const createNewPassportForProjectVariantId = async (
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
