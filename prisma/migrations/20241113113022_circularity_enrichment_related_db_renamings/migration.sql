/*
  Warnings:

  - You are about to drop the `ElcaBuildingComponentLayerUserEnrichedData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TBaustoff_OekobaudatMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TBaustoff_Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TBaustoff_ProductEOLCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TBs_ProductDefinitionEOLCategoryScenario" AS ENUM ('WV', 'CL+', 'CL-', 'RC+', 'RC-', 'SV', 'EV+', 'EV-', 'EB', 'Dep+', 'Dep-');

-- DropForeignKey
ALTER TABLE "ElcaBuildingComponentLayerUserEnrichedData" DROP CONSTRAINT "ElcaBuildingComponentLayerUserEnrichedData_tBaustoffProduc_fkey";

-- DropForeignKey
ALTER TABLE "TBaustoff_OekobaudatMapping" DROP CONSTRAINT "TBaustoff_OekobaudatMapping_tBaustoffProductId_fkey";

-- DropForeignKey
ALTER TABLE "TBaustoff_Product" DROP CONSTRAINT "TBaustoff_Product_tBaustoff_ProductEOLCategoryId_fkey";

-- DropTable
DROP TABLE "ElcaBuildingComponentLayerUserEnrichedData";

-- DropTable
DROP TABLE "TBaustoff_OekobaudatMapping";

-- DropTable
DROP TABLE "TBaustoff_Product";

-- DropTable
DROP TABLE "TBaustoff_ProductEOLCategory";

-- DropEnum
DROP TYPE "ProductTBaustoff_ProductEOLCategoryScenario";

-- CreateTable
CREATE TABLE "TBs_OekobaudatMapping" (
    "oekobaudatProcessUuid" TEXT NOT NULL,
    "oekobaudatVersionUuid" TEXT NOT NULL,
    "tBaustoffProductId" INTEGER,

    CONSTRAINT "TBs_OekobaudatMapping_pkey" PRIMARY KEY ("oekobaudatProcessUuid","oekobaudatVersionUuid")
);

-- CreateTable
CREATE TABLE "TBs_ProductDefinition" (
    "id" SERIAL NOT NULL,
    "tBaustoffVersion" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tBaustoff_ProductEOLCategoryId" INTEGER,

    CONSTRAINT "TBs_ProductDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBs_ProductDefinitionEOLCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "eolScenarioUnbuiltReal" "TBs_ProductDefinitionEOLCategoryScenario" NOT NULL,
    "eolScenarioUnbuiltPotential" "TBs_ProductDefinitionEOLCategoryScenario" NOT NULL,
    "technologyFactor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TBs_ProductDefinitionEOLCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEnrichedProductData" (
    "elcaElementComponentId" INTEGER NOT NULL,
    "tBaustoffProductId" INTEGER,
    "tBaustoffProductSelectedByUser" BOOLEAN NOT NULL,
    "specificEolUnbuiltTotalScenario" "TBs_ProductDefinitionEOLCategoryScenario",
    "specificEolUnbuiltTotalScenarioProofText" TEXT,
    "dismantlingPotentialClassId" "DismantlingPotentialClassId",

    CONSTRAINT "UserEnrichedProductData_pkey" PRIMARY KEY ("elcaElementComponentId")
);

-- AddForeignKey
ALTER TABLE "TBs_OekobaudatMapping" ADD CONSTRAINT "TBs_OekobaudatMapping_tBaustoffProductId_fkey" FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBs_ProductDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBs_ProductDefinition" ADD CONSTRAINT "TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey" FOREIGN KEY ("tBaustoff_ProductEOLCategoryId") REFERENCES "TBs_ProductDefinitionEOLCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnrichedProductData" ADD CONSTRAINT "UserEnrichedProductData_tBaustoffProductId_fkey" FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBs_ProductDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
