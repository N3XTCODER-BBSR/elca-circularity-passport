/*
  Warnings:

  - Added the required column `projectVariantId` to the `Passport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Passport" ADD COLUMN     "projectVariantId" TEXT NOT NULL;
