-- AlterTable
ALTER TABLE "TBS_EOLCategoryInRelease" RENAME CONSTRAINT "TBs_ProductDefinitionEOLCategory_pkey" TO "TBS_EOLCategoryInRelease_pkey";

-- AlterTable
ALTER TABLE "TBS_OEBDMappingInRelease" RENAME CONSTRAINT "TBs_OekobaudatMapping_pkey" TO "TBS_OEBDMappingInRelease_pkey";

-- AlterTable
ALTER TABLE "TBS_ProductInRelease" RENAME CONSTRAINT "TBs_ProductDefinition_pkey" TO "TBS_ProductInRelease_pkey";

-- AddForeignKey
ALTER TABLE "TBS_ProductInRelease" ADD CONSTRAINT "TBS_ProductInRelease_eolCategoryInReleaseId_fkey" FOREIGN KEY ("eolCategoryInReleaseId") REFERENCES "TBS_EOLCategoryInRelease"("id") ON DELETE SET NULL ON UPDATE CASCADE;
