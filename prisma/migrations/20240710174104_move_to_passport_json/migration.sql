/*
  Warnings:

  - You are about to drop the column `address` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `bgf` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `bri` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `buildingStructureId` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `buildingType` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `buildingYear` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `dataQuality` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `nrf` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfFloors` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `percentageOfSealedLandArea` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `plotArea` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `totalMassOfBuilding` on the `Passport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Passport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passportData` to the `Passport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Passport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `versionTag` to the `Passport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Passport" DROP COLUMN "address",
DROP COLUMN "authorName",
DROP COLUMN "bgf",
DROP COLUMN "bri",
DROP COLUMN "buildingStructureId",
DROP COLUMN "buildingType",
DROP COLUMN "buildingYear",
DROP COLUMN "dataQuality",
DROP COLUMN "name",
DROP COLUMN "nrf",
DROP COLUMN "numberOfFloors",
DROP COLUMN "percentageOfSealedLandArea",
DROP COLUMN "plotArea",
DROP COLUMN "totalMassOfBuilding",
ADD COLUMN     "passportData" JSONB NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD COLUMN     "versionTag" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Passport_uuid_key" ON "Passport"("uuid");
