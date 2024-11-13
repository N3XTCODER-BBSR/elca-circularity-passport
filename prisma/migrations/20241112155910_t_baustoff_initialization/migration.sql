-- CreateEnum
CREATE TYPE "DismantlingPotentialClassId" AS ENUM ('I', 'II', 'III', 'IV');

-- CreateEnum
CREATE TYPE "ProductTBaustoff_ProductEOLCategoryScenario" AS ENUM ('WV', 'CL+', 'CL-', 'RC+', 'RC-', 'SV', 'EV+', 'EV-', 'EB', 'Dep+', 'Dep-');

-- CreateTable
CREATE TABLE "TBaustoff_OekobaudatMapping" (
    "oekobaudatProcessUuid" TEXT NOT NULL,
    "oekobaudatVersionUuid" TEXT NOT NULL,
    "tBaustoffProductId" INTEGER,

    CONSTRAINT "TBaustoff_OekobaudatMapping_pkey" PRIMARY KEY ("oekobaudatProcessUuid","oekobaudatVersionUuid")
);

-- CreateTable
CREATE TABLE "TBaustoff_Product" (
    "id" SERIAL NOT NULL,
    "tBaustoffVersion" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tBaustoff_ProductEOLCategoryId" INTEGER,

    CONSTRAINT "TBaustoff_Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBaustoff_ProductEOLCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "eolScenarioUnbuiltReal" "ProductTBaustoff_ProductEOLCategoryScenario" NOT NULL,
    "eolScenarioUnbuiltPotential" "ProductTBaustoff_ProductEOLCategoryScenario" NOT NULL,
    "technologyFactor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TBaustoff_ProductEOLCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElcaProjectDateEnrichment" (
    "id" SERIAL NOT NULL,
    "elcaProjectId" TEXT NOT NULL,
    "tBaustoffVersion" TEXT NOT NULL,

    CONSTRAINT "ElcaProjectDateEnrichment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElcaBuildingComponentLayerUserEnrichedData" (
    "elcaElementComponentId" INTEGER NOT NULL,
    "tBaustoffProductId" INTEGER,
    "tBaustoffProductSelectedByUser" BOOLEAN NOT NULL,
    "specificEolUnbuiltTotalScenario" "ProductTBaustoff_ProductEOLCategoryScenario",
    "specificEolUnbuiltTotalScenarioProofText" TEXT,
    "dismantlingPotentialClassId" "DismantlingPotentialClassId",

    CONSTRAINT "ElcaBuildingComponentLayerUserEnrichedData_pkey" PRIMARY KEY ("elcaElementComponentId")
);

-- AddForeignKey
ALTER TABLE "TBaustoff_OekobaudatMapping" ADD CONSTRAINT "TBaustoff_OekobaudatMapping_tBaustoffProductId_fkey" FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBaustoff_Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBaustoff_Product" ADD CONSTRAINT "TBaustoff_Product_tBaustoff_ProductEOLCategoryId_fkey" FOREIGN KEY ("tBaustoff_ProductEOLCategoryId") REFERENCES "TBaustoff_ProductEOLCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElcaBuildingComponentLayerUserEnrichedData" ADD CONSTRAINT "ElcaBuildingComponentLayerUserEnrichedData_tBaustoffProduc_fkey" FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBaustoff_Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
