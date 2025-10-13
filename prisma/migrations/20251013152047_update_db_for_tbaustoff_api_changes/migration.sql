-- Drop FKs that would block renames/alterations
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TBs_OekobaudatMapping_tBaustoffProductId_fkey'
  ) THEN
    ALTER TABLE "TBs_OekobaudatMapping" DROP CONSTRAINT "TBs_OekobaudatMapping_tBaustoffProductId_fkey";
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey'
  ) THEN
    ALTER TABLE "TBs_ProductDefinition" DROP CONSTRAINT "TBs_ProductDefinition_tBaustoff_ProductEOLCategoryId_fkey";
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserEnrichedProductData_tBaustoffProductId_fkey'
  ) THEN
    ALTER TABLE "UserEnrichedProductData" DROP CONSTRAINT "UserEnrichedProductData_tBaustoffProductId_fkey";
  END IF;
END $$;

-- Create new Release table
CREATE TABLE IF NOT EXISTS "TBS_Release" (
  "uuid" TEXT PRIMARY KEY,
  "tag" TEXT NOT NULL
);

-- Seed a default release for backfilling existing rows
INSERT INTO "TBS_Release" ("uuid", "tag")
VALUES ('default', 'imported-from-legacy')
ON CONFLICT ("uuid") DO NOTHING;

-- Rename existing tables in-place to preserve data
ALTER TABLE "TBs_ProductDefinition" RENAME TO "TBS_ProductInRelease";
ALTER TABLE "TBs_ProductDefinitionEOLCategory" RENAME TO "TBS_EOLCategoryInRelease";
ALTER TABLE "TBs_OekobaudatMapping" RENAME TO "TBS_OEBDMappingInRelease";

-- ProductInRelease: drop old version column, add uuid, rename FK column
ALTER TABLE "TBS_ProductInRelease"
  DROP COLUMN IF EXISTS "tBaustoffVersion";
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='TBS_ProductInRelease' AND column_name='uuid'
  ) THEN
    ALTER TABLE "TBS_ProductInRelease" ADD COLUMN "uuid" TEXT;
  END IF;
END $$;
ALTER TABLE "TBS_ProductInRelease"
  RENAME COLUMN "tBaustoff_ProductEOLCategoryId" TO "eolCategoryInReleaseId";

-- Backfill product uuids from ids (string form), then enforce constraints
UPDATE "TBS_ProductInRelease" SET "uuid" = COALESCE("uuid", "id"::text);
ALTER TABLE "TBS_ProductInRelease" ALTER COLUMN "uuid" SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relkind='i' AND c.relname='TBS_ProductInRelease_uuid_key'
  ) THEN
    CREATE UNIQUE INDEX "TBS_ProductInRelease_uuid_key" ON "TBS_ProductInRelease" ("uuid");
  END IF;
END $$;

-- EOLCategoryInRelease: add uuid and release link
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='TBS_EOLCategoryInRelease' AND column_name='uuid'
  ) THEN
    ALTER TABLE "TBS_EOLCategoryInRelease" ADD COLUMN "uuid" TEXT;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='TBS_EOLCategoryInRelease' AND column_name='releaseUuid'
  ) THEN
    ALTER TABLE "TBS_EOLCategoryInRelease" ADD COLUMN "releaseUuid" TEXT;
  END IF;
END $$;

-- Backfill category uuids and release link
UPDATE "TBS_EOLCategoryInRelease" SET "uuid" = COALESCE("uuid", "id"::text);
UPDATE "TBS_EOLCategoryInRelease" SET "releaseUuid" = COALESCE("releaseUuid", 'default');

-- Enforce constraints for category
ALTER TABLE "TBS_EOLCategoryInRelease" ALTER COLUMN "uuid" SET NOT NULL;
ALTER TABLE "TBS_EOLCategoryInRelease" ALTER COLUMN "releaseUuid" SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relkind='i' AND c.relname='TBS_EOLCategoryInRelease_uuid_key'
  ) THEN
    CREATE UNIQUE INDEX "TBS_EOLCategoryInRelease_uuid_key" ON "TBS_EOLCategoryInRelease" ("uuid");
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relkind='i' AND c.relname='TBS_EOLCategoryInRelease_name_key'
  ) THEN
    CREATE UNIQUE INDEX "TBS_EOLCategoryInRelease_name_key" ON "TBS_EOLCategoryInRelease" ("name");
  END IF;
END $$;

-- Add FK from category to release
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TBS_EOLCategoryInRelease_releaseUuid_fkey'
  ) THEN
    ALTER TABLE "TBS_EOLCategoryInRelease"
      ADD CONSTRAINT "TBS_EOLCategoryInRelease_releaseUuid_fkey"
      FOREIGN KEY ("releaseUuid") REFERENCES "TBS_Release"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- OEBD Mapping: rename columns and add FK to release
ALTER TABLE "TBS_OEBDMappingInRelease" RENAME COLUMN "oekobaudatProcessUuid" TO "oebd_processUuid";
ALTER TABLE "TBS_OEBDMappingInRelease" RENAME COLUMN "oekobaudatVersionUuid" TO "oebd_release_uuid";
ALTER TABLE "TBS_OEBDMappingInRelease" RENAME COLUMN "tBaustoffProductId" TO "ProductInReleaseId";

-- Add mapping PK if not present (composite)
-- Primary key from previous table remains after rename; do not recreate

-- Add FKs for mapping
ALTER TABLE "TBS_OEBDMappingInRelease"
  ADD CONSTRAINT "TBS_OEBDMappingInRelease_ProductInReleaseId_fkey"
  FOREIGN KEY ("ProductInReleaseId") REFERENCES "TBS_ProductInRelease"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TBS_OEBDMappingInRelease"
  ADD CONSTRAINT "TBS_OEBDMappingInRelease_oebd_release_uuid_fkey"
  FOREIGN KEY ("oebd_release_uuid") REFERENCES "TBS_Release"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Re-add FK from UserEnrichedProductData to ProductInRelease (ids preserved by rename)
ALTER TABLE "UserEnrichedProductData"
  ADD CONSTRAINT "UserEnrichedProductData_tBaustoffProductId_fkey"
  FOREIGN KEY ("tBaustoffProductId") REFERENCES "TBS_ProductInRelease"("id") ON DELETE SET NULL ON UPDATE CASCADE;
