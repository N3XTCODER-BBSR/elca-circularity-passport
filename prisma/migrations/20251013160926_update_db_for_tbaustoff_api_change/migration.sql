/*
  Warnings:

  - You are about to drop the `TBs_OekobaudatMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TBs_ProductDefinition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TBs_ProductDefinitionEOLCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TBs_OekobaudatMapping" DROP CONSTRAINT "TBs_OekobaudatMapping_tBaustoffProductId_fkey";

-- DropForeignKey
ALTER TABLE "TBs_ProductDefinition" DROP CONSTRAINT "TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserEnrichedProductData" DROP CONSTRAINT "UserEnrichedProductData_tBaustoffProductId_fkey";

-- DropTable
DROP TABLE "TBs_OekobaudatMapping";

-- DropTable
DROP TABLE "TBs_ProductDefinition";

-- DropTable
DROP TABLE "TBs_ProductDefinitionEOLCategory";

-- CreateTable
CREATE TABLE "TBS_Release" (
    "uuid" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "TBS_Release_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "TBS_OEBDMappingInRelease" (
    "oebd_processUuid" TEXT NOT NULL,
    "oebd_release_uuid" TEXT NOT NULL,
    "ProductInReleaseId" INTEGER NOT NULL,

    CONSTRAINT "TBS_OEBDMappingInRelease_pkey" PRIMARY KEY ("oebd_processUuid","oebd_release_uuid")
);

-- CreateTable
CREATE TABLE "TBS_ProductInRelease" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "processCategoryNumber" TEXT,
    "eolCategoryInReleaseId" INTEGER NOT NULL,

    CONSTRAINT "TBS_ProductInRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBS_EOLCategoryInRelease" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eolScenarioUnbuiltReal" "TBs_ProductDefinitionEOLCategoryScenario" NOT NULL,
    "eolScenarioUnbuiltPotential" "TBs_ProductDefinitionEOLCategoryScenario" NOT NULL,
    "technologyFactor" DOUBLE PRECISION NOT NULL,
    "releaseUuid" TEXT NOT NULL,

    CONSTRAINT "TBS_EOLCategoryInRelease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBS_ProductInRelease_uuid_key" ON "TBS_ProductInRelease"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "TBS_EOLCategoryInRelease_uuid_key" ON "TBS_EOLCategoryInRelease"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "TBS_EOLCategoryInRelease_name_key" ON "TBS_EOLCategoryInRelease"("name");

-- AddForeignKey
ALTER TABLE "TBS_OEBDMappingInRelease" ADD CONSTRAINT "TBS_OEBDMappingInRelease_ProductInReleaseId_fkey" FOREIGN KEY ("ProductInReleaseId") REFERENCES "TBS_ProductInRelease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBS_ProductInRelease" ADD CONSTRAINT "TBS_ProductInRelease_eolCategoryInReleaseId_fkey" FOREIGN KEY ("eolCategoryInReleaseId") REFERENCES "TBS_EOLCategoryInRelease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBS_EOLCategoryInRelease" ADD CONSTRAINT "TBS_EOLCategoryInRelease_releaseUuid_fkey" FOREIGN KEY ("releaseUuid") REFERENCES "TBS_Release"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnrichedProductData" ADD CONSTRAINT "UserEnrichedProductData_tBaustoffProductId_fkey" FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBS_ProductInRelease"("id") ON DELETE SET NULL ON UPDATE CASCADE;
