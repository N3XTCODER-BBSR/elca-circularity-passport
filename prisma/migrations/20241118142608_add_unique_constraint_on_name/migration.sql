/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TBs_ProductDefinitionEOLCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TBs_ProductDefinitionEOLCategory_name_key" ON "TBs_ProductDefinitionEOLCategory"("name");
