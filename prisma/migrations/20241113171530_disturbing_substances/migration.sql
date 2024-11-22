-- CreateEnum
CREATE TYPE "DisturbingSubstanceClassId" AS ENUM ('S0', 'S1', 'S2', 'S3', 'S4');

-- AlterTable
ALTER TABLE "UserEnrichedProductData" ADD COLUMN     "specificEolBuiltTotalScenario" "TBs_ProductDefinitionEOLCategoryScenario",
ADD COLUMN     "specificEolBuiltTotalScenarioProofText" TEXT;

-- CreateTable
CREATE TABLE "DisturbingSubstanceSelection" (
    "id" SERIAL NOT NULL,
    "userEnrichedProductDataElcaElementComponentId" INTEGER NOT NULL,
    "disturbingSubstanceClassId" "DisturbingSubstanceClassId" NOT NULL,

    CONSTRAINT "DisturbingSubstanceSelection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DisturbingSubstanceSelection_userEnrichedProductDataElcaEle_idx" ON "DisturbingSubstanceSelection"("userEnrichedProductDataElcaElementComponentId");

-- AddForeignKey
ALTER TABLE "DisturbingSubstanceSelection" ADD CONSTRAINT "DisturbingSubstanceSelection_userEnrichedProductDataElcaEl_fkey" FOREIGN KEY ("userEnrichedProductDataElcaElementComponentId") REFERENCES "UserEnrichedProductData"("elcaElementComponentId") ON DELETE RESTRICT ON UPDATE CASCADE;
