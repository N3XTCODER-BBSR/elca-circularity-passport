/*
  Warnings:

  - The primary key for the `TBs_OekobaudatMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `oekobaudatProcessUuid` on the `TBs_OekobaudatMapping` table. All the data in the column will be lost.
  - You are about to drop the column `oekobaudatVersionUuid` on the `TBs_OekobaudatMapping` table. All the data in the column will be lost.
  - You are about to drop the column `tBaustoffProductId` on the `TBs_OekobaudatMapping` table. All the data in the column will be lost.
  - You are about to drop the column `tBaustoffVersion` on the `TBs_ProductDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `tBaustoff_ProductEOLCategoryId` on the `TBs_ProductDefinition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `TBs_ProductDefinition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `TBs_ProductDefinitionEOLCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ProductInReleaseId` to the `TBs_OekobaudatMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oebd_processUuid` to the `TBs_OekobaudatMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oebd_release_uuid` to the `TBs_OekobaudatMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eolCategoryInReleaseId` to the `TBs_ProductDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `TBs_ProductDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseUuid` to the `TBs_ProductDefinitionEOLCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `TBs_ProductDefinitionEOLCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TBs_OekobaudatMapping" DROP CONSTRAINT "TBs_OekobaudatMapping_tBaustoffProductId_fkey";

-- DropForeignKey
ALTER TABLE "TBs_ProductDefinition" DROP CONSTRAINT "TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey";

-- AlterTable
ALTER TABLE "TBs_OekobaudatMapping" DROP CONSTRAINT "TBs_OekobaudatMapping_pkey",
DROP COLUMN "oekobaudatProcessUuid",
DROP COLUMN "oekobaudatVersionUuid",
DROP COLUMN "tBaustoffProductId",
ADD COLUMN     "ProductInReleaseId" INTEGER NOT NULL,
ADD COLUMN     "oebd_processUuid" TEXT NOT NULL,
ADD COLUMN     "oebd_release_uuid" TEXT NOT NULL,
ADD CONSTRAINT "TBs_OekobaudatMapping_pkey" PRIMARY KEY ("oebd_processUuid", "oebd_release_uuid");

-- AlterTable
ALTER TABLE "TBs_ProductDefinition" DROP COLUMN "tBaustoffVersion",
DROP COLUMN "tBaustoff_ProductEOLCategoryId",
ADD COLUMN     "eolCategoryInReleaseId" INTEGER NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TBs_ProductDefinitionEOLCategory" ADD COLUMN     "releaseUuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

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
ALTER TABLE "TBs_OekobaudatMapping" ADD CONSTRAINT "TBs_OekobaudatMapping_ProductInReleaseId_fkey" FOREIGN KEY ("ProductInReleaseId") REFERENCES "TBs_ProductDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBs_ProductDefinition" ADD CONSTRAINT "TBs_ProductDefinition_eolCategoryInReleaseId_fkey" FOREIGN KEY ("eolCategoryInReleaseId") REFERENCES "TBs_ProductDefinitionEOLCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBs_ProductDefinitionEOLCategory" ADD CONSTRAINT "TBs_ProductDefinitionEOLCategory_releaseUuid_fkey" FOREIGN KEY ("releaseUuid") REFERENCES "TBS_Release"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
