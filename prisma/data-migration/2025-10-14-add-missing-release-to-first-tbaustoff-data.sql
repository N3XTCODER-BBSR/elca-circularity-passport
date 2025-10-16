BEGIN;

-- Ensure the release exists
INSERT INTO "TBS_Release" ("uuid", "tag")
VALUES ('70ee17c1-b144-45d1-97c2-f600f238e112', '2024-10-24')
ON CONFLICT ("uuid") DO NOTHING;

-- Assign the release to any EOL categories missing a releaseUuid
UPDATE "TBs_ProductDefinitionEOLCategory"
SET "releaseUuid" = '70ee17c1-b144-45d1-97c2-f600f238e112'
WHERE "releaseUuid" IS NULL;

COMMIT;


