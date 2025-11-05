BEGIN;

/*
  Backfill TBs uuids from the source CSV in a robust, set-based way.

  Why the two temp tables?
  - The CSV has many columns (dynamic OeKB version columns, etc.). COPY requires
    exact column counts, so we first load the entire file into a raw table with 20
    text columns, then project only the fields we need into a typed working table.

  Data quality alignment with seeder:
  - Skip rows with incomplete/placeholder values: technologyFactor or scenarios = 'n.e.'
  - Skip categories named 'nicht eingestuft'
  - Skip products whose name contains ' S4'
  - Normalize technologyFactor by replacing commas with dots, validate via regex, and
    enforce 0 ≤ factor ≤ 1 before casting to double precision

  Execution:
  - Run this file via psql from the project root directory so that \copy can find the CSV file
  - Example: psql $DATABASE_URL -f prisma/data-migration/2025-10-30-backfill-tbaustoff-uuids.sql
  - All changes are wrapped in a transaction; temp tables are dropped explicitly
  - The CSV file path is relative to the current working directory (project root)
*/

-- Raw temp table mirroring the CSV's 20 columns
-- Order must match the file exactly
CREATE TEMP TABLE _tbaustoff_uuid_source_raw (
  col1  text,  -- oekobaudatName
  col2  text,  -- oekobaudatUuid____...2020-II
  col3  text,  -- oekobaudatUuid____...2023-I
  col4  text,  -- oekobaudatUuid____...2021-II
  col5  text,  -- oekobaudatUuid____...2020-I
  col6  text,  -- oekobaudatUuid____...2019-III
  col7  text,  -- oekobaudatUuid____...2019-II
  col8  text,  -- oekobaudatUuid____...2019-I
  col9  text,  -- oekobaudatUuid____...2017
  col10 text,  -- tBaustoffName
  col11 text,  -- eolCategoryName
  col12 text,  -- eolScenarioReal
  col13 text,  -- eolScenarioPotential
  col14 text,  -- technologyFactor
  col15 text,  -- Unnamed: 8
  col16 text,  -- processCategoryNumber
  col17 text,  -- productUuid
  col18 text,  -- eolCategoryUuid
  col19 text,  -- releaseUuid
  col20 text   -- releaseTag
);

-- Load full CSV into raw table
-- Path is relative to the current working directory (should be project root when running via psql)
\copy _tbaustoff_uuid_source_raw FROM 'prisma/seeding/tbaustoff_release_source_data/v1_initial_release_obd_tbaustoff_mapping__70ee17c1-b144-45d1-97c2-f600f238e112_with_uuids_1760456920.csv' CSV HEADER

-- Validate that the CSV file was found and loaded successfully
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count FROM _tbaustoff_uuid_source_raw;
  
  IF row_count = 0 THEN
    RAISE EXCEPTION 'CSV file not found or empty. Expected file: prisma/seeding/tbaustoff_release_source_data/v1_initial_release_obd_tbaustoff_mapping__70ee17c1-b144-45d1-97c2-f600f238e112_with_uuids_1760456920.csv. Please ensure the file exists and the script is run from the project root directory.';
  END IF;
END $$;

-- Working temp table with just the needed columns (typed)
CREATE TEMP TABLE _tbaustoff_uuid_source (
  "eolCategoryName"                   text,
  "technologyFactor"                  double precision,
  "eolScenarioReal"                   text,
  "eolScenarioPotential"              text,
  "tBaustoffName"                     text,
  "processCategoryNumber"             text,
  "productUuid"                       text,
  "eolCategoryUuid"                   text,
  "releaseUuid"                       text,
  "releaseTag"                        text
);

-- Project/convert from raw to typed working table
INSERT INTO _tbaustoff_uuid_source (
  "eolCategoryName",
  "technologyFactor",
  "eolScenarioReal",
  "eolScenarioPotential",
  "tBaustoffName",
  "processCategoryNumber",
  "productUuid",
  "eolCategoryUuid",
  "releaseUuid",
  "releaseTag"
)
SELECT
  s.eolCategoryName,
  s.tf_num,
  s.eolScenarioReal,
  s.eolScenarioPotential,
  s.tBaustoffName,
  s.processCategoryNumber,
  s.productUuid,
  s.eolCategoryUuid,
  s.releaseUuid,
  s.releaseTag
FROM (
  SELECT
    trim(col11) AS eolCategoryName,
    trim(col12) AS eolScenarioReal,
    trim(col13) AS eolScenarioPotential,
    trim(col10) AS tBaustoffName,
    col16       AS processCategoryNumber,
    col17       AS productUuid,
    col18       AS eolCategoryUuid,
    col19       AS releaseUuid,
    col20       AS releaseTag,
    CASE
      WHEN regexp_replace(trim(col14), ',', '.', 'g') ~ '^[0-9]+(\.[0-9]+)?$'
      THEN (regexp_replace(trim(col14), ',', '.', 'g'))::double precision
      ELSE NULL
    END AS tf_num
  FROM _tbaustoff_uuid_source_raw
 ) s
WHERE s.eolCategoryName <> 'nicht eingestuft'
  AND s.eolScenarioReal <> 'n.e.'
  AND s.eolScenarioPotential <> 'n.e.'
  AND s.eolScenarioReal ~ '^(WV|CL\+|CL-|RC\+|RC-|SV|EV\+|EV-|EB|Dep\+|Dep-)$'
  AND s.eolScenarioPotential ~ '^(WV|CL\+|CL-|RC\+|RC-|SV|EV\+|EV-|EB|Dep\+|Dep-)$'
  AND s.tf_num IS NOT NULL
  AND s.tf_num >= 0 AND s.tf_num <= 1
  AND s.tBaustoffName NOT LIKE '% S4%';

-- Optional: indexes to speed up joins for larger datasets
-- CREATE INDEX ON _tbaustoff_uuid_source ("eolCategoryName", "technologyFactor", "eolScenarioReal", "eolScenarioPotential");
-- CREATE INDEX ON _tbaustoff_uuid_source ("tBaustoffName");
-- CREATE INDEX ON _tbaustoff_uuid_source ("releaseUuid");

-- 1) Update EOL category uuids by matching on name, scenarios, factor, and release
UPDATE "TBs_ProductDefinitionEOLCategory" c
SET "uuid" = s."eolCategoryUuid"
FROM _tbaustoff_uuid_source s
JOIN "TBS_Release" r ON r."uuid" = s."releaseUuid"
WHERE c."name" = s."eolCategoryName"
  AND c."technologyFactor" = s."technologyFactor"
  AND c."eolScenarioUnbuiltReal" = s."eolScenarioReal"::"TBs_ProductDefinitionEOLCategoryScenario"
  AND c."eolScenarioUnbuiltPotential" = s."eolScenarioPotential"::"TBs_ProductDefinitionEOLCategoryScenario"
  AND c."releaseUuid" = r."uuid"
  AND (c."uuid" IS DISTINCT FROM s."eolCategoryUuid");

-- 2) Update product uuids by matching product name within the resolved category (and respect release)
UPDATE "TBs_ProductDefinition" p
SET "uuid" = s."productUuid"
FROM _tbaustoff_uuid_source s
JOIN "TBs_ProductDefinitionEOLCategory" c
  ON (
       (s."eolCategoryUuid" IS NOT NULL AND s."eolCategoryUuid" <> ''
         AND c."uuid" = s."eolCategoryUuid" AND c."releaseUuid" = s."releaseUuid")
     OR (
         -- First fallback: match by exact category name within same release
         c."name" = s."eolCategoryName"
       AND c."releaseUuid" = s."releaseUuid"
       )
     OR (
         -- Final fallback: name + scenario pair + factor within same release
         c."name" = s."eolCategoryName"
       AND c."technologyFactor" = s."technologyFactor"
       AND c."eolScenarioUnbuiltReal" = s."eolScenarioReal"::"TBs_ProductDefinitionEOLCategoryScenario"
       AND c."eolScenarioUnbuiltPotential" = s."eolScenarioPotential"::"TBs_ProductDefinitionEOLCategoryScenario"
       AND c."releaseUuid" = s."releaseUuid"
       )
     )
WHERE p."tBaustoff_ProductEOLCategoryId" = c."id"
  -- Normalize product names to improve matching robustness (collapse whitespace, case-insensitive)
  AND lower(regexp_replace(trim(p."name"), '\\s+', ' ', 'g')) = lower(regexp_replace(trim(s."tBaustoffName"), '\\s+', ' ', 'g'))
  AND (p."uuid" IS DISTINCT FROM s."productUuid");

-- Explicit cleanup to avoid leaving temporary artifacts
DROP TABLE IF EXISTS _tbaustoff_uuid_source_raw;
DROP TABLE IF EXISTS _tbaustoff_uuid_source;

COMMIT;


