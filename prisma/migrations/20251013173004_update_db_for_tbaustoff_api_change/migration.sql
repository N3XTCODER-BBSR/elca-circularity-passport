/*
  Warnings:

  - You are about to drop the column `tBaustoffVersion` on the `TBs_ProductDefinition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `TBs_ProductDefinition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `TBs_ProductDefinitionEOLCategory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tBaustoffProductId` on table `TBs_OekobaudatMapping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tBaustoff_ProductEOLCategoryId` on table `TBs_ProductDefinition` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TBs_OekobaudatMapping" DROP CONSTRAINT "TBs_OekobaudatMapping_tBaustoffProductId_fkey";

-- DropForeignKey
ALTER TABLE "TBs_ProductDefinition" DROP CONSTRAINT "TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey";

-- AlterTable
ALTER TABLE "TBs_OekobaudatMapping" ALTER COLUMN "tBaustoffProductId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TBs_ProductDefinition" DROP COLUMN "tBaustoffVersion",
ADD COLUMN     "uuid" TEXT,
ALTER COLUMN "tBaustoff_ProductEOLCategoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TBs_ProductDefinitionEOLCategory" ADD COLUMN     "releaseUuid" TEXT,
ADD COLUMN     "uuid" TEXT;

-- CreateTable
CREATE TABLE "TBS_Release" (
    "uuid" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "TBS_Release_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBs_ProductDefinition_uuid_key" ON "TBs_ProductDefinition"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "TBs_ProductDefinitionEOLCategory_uuid_key" ON "TBs_ProductDefinitionEOLCategory"("uuid");

-- AddForeignKey
ALTER TABLE "TBs_OekobaudatMapping" ADD CONSTRAINT "TBs_OekobaudatMapping_tBaustoffProductId_fkey" FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBs_ProductDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBs_ProductDefinition" ADD CONSTRAINT "TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey" FOREIGN KEY ("tBaustoff_ProductEOLCategoryId") REFERENCES "TBs_ProductDefinitionEOLCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBs_ProductDefinitionEOLCategory" ADD CONSTRAINT "TBs_ProductDefinitionEOLCategory_releaseUuid_fkey" FOREIGN KEY ("releaseUuid") REFERENCES "TBS_Release"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
