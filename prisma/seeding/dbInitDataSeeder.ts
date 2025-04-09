/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import csv from "csv-parser"
import fs from "fs"
import path from "path"

import { TBs_ProductDefinitionEOLCategoryScenario } from "../generated/client"
import { prisma } from "../prismaClient" // needs to be relative path

const csvFilePath = path.resolve(__dirname, "./obd_tbaustoff_mapping.csv")

type CsvRow = {
  oekobaudatName: string
  oekobaudatUuid____448d1096_2017_4901_a560_f652a83c737e____2020_II: string
  oekobaudatUuid____22885a6e_1765_4ade_a35e_ae668bd07256____2023_I: string
  // TODO (L): Open leftover question from alignment with Austrian team
  oekobaudatUuid____ca70a7e6_0ea4_4e90_a947_d44585783626____2024_I: string
  tBaustoffName: string
  eolCategoryName: string
  eolScenarioReal: string
  eolScenarioPotential: string
  technologyFactor: string
}

async function readCsvFile(filePath: string): Promise<CsvRow[]> {
  const rows: CsvRow[] = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: CsvRow) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error))
  })
}

const mapToEOLCategoryScenario = (value: string): TBs_ProductDefinitionEOLCategoryScenario | null => {
  switch (value) {
    case "WV":
      return TBs_ProductDefinitionEOLCategoryScenario.WV
    case "CL+":
      return TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS
    case "CL-":
      return TBs_ProductDefinitionEOLCategoryScenario.CL_MINUS
    case "RC+":
      return TBs_ProductDefinitionEOLCategoryScenario.RC_PLUS
    case "RC-":
      return TBs_ProductDefinitionEOLCategoryScenario.RC_MINUS
    case "SV":
      return TBs_ProductDefinitionEOLCategoryScenario.SV
    case "EV+":
      return TBs_ProductDefinitionEOLCategoryScenario.EV_PLUS
    case "EV-":
      return TBs_ProductDefinitionEOLCategoryScenario.EV_MINUS
    case "EB":
      return TBs_ProductDefinitionEOLCategoryScenario.EB
    case "Dep+":
      return TBs_ProductDefinitionEOLCategoryScenario.DEP_PLUS
    case "Dep-":
      return TBs_ProductDefinitionEOLCategoryScenario.DEP_MINUS
    default:
      console.warn(`Invalid EOL Category Scenario: ${value}`)
      return null
  }
}

async function seedCircularityTool() {
  const csvData = await readCsvFile(csvFilePath)

  const eolCategoryCache = new Map<string, number>() // Cache with numeric IDs

  for (const row of csvData) {
    try {
      // Skip rows with incomplete data
      if (
        row.eolCategoryName === "nicht eingestuft" ||
        row.eolScenarioReal === "n.e." ||
        row.eolScenarioPotential === "n.e." ||
        row.technologyFactor === "n.e."
      ) {
        console.warn(`Skipping row due to incomplete data: ${JSON.stringify(row)}`)
        continue
      }

      // Skip ProductDefinitions with " S4" in their name
      if (row.tBaustoffName.includes(" S4")) {
        console.warn(`Skipping row with " S4" in ProductDefinition name: ${JSON.stringify(row)}`)
        continue
      }

      // Map to enums
      const eolScenarioReal = mapToEOLCategoryScenario(row.eolScenarioReal)
      const eolScenarioPotential = mapToEOLCategoryScenario(row.eolScenarioPotential)
      if (!eolScenarioReal || !eolScenarioPotential) {
        console.warn(`Invalid scenarios in row: ${JSON.stringify(row)}`)
        continue
      }

      // Generate a unique key for the EOLCategory
      const eolCategoryKey = JSON.stringify({
        name: row.eolCategoryName,
        eolScenarioReal,
        eolScenarioPotential,
        technologyFactor: parseFloat(row.technologyFactor),
      })

      let eolCategoryId: number

      // Check if the EOLCategory exists in cache or DB
      if (eolCategoryCache.has(eolCategoryKey)) {
        eolCategoryId = eolCategoryCache.get(eolCategoryKey)!
      } else {
        const existingCategory = await prisma.tBs_ProductDefinitionEOLCategory.findFirst({
          where: {
            name: row.eolCategoryName,
            // NOTE: Duplicate data in source csv, check with IBO
            // eolScenarioUnbuiltReal: eolScenarioReal,
            // eolScenarioUnbuiltPotential: eolScenarioPotential,
            // technologyFactor: parseFloat(row.technologyFactor),
          },
        })

        if (existingCategory) {
          eolCategoryId = existingCategory.id
        } else {
          const newCategory = await prisma.tBs_ProductDefinitionEOLCategory.create({
            data: {
              name: row.eolCategoryName,
              eolScenarioUnbuiltReal: eolScenarioReal,
              eolScenarioUnbuiltPotential: eolScenarioPotential,
              technologyFactor: parseFloat(row.technologyFactor),
            },
          })
          eolCategoryId = newCategory.id
        }

        eolCategoryCache.set(eolCategoryKey, eolCategoryId)
      }

      // Create the TBs_ProductDefinition only if the name doesn't contain " S4"
      const tBaustoff = await prisma.tBs_ProductDefinition.create({
        data: {
          name: row.tBaustoffName,
          tBs_version: "2024-Q4",
          tBs_ProductDefinitionEOLCategoryId: eolCategoryId,
        },
      })

      // Create Oekobaudat Mapping
      for (const [key, value] of Object.entries(row)) {
        if (key.startsWith("oekobaudatUuid____") && value !== "nicht vorhanden") {
          const splitKey = key.split("____")
          if (splitKey.length > 1 && splitKey[1]) {
            const versionUuid = splitKey[1].replace(/_/g, "-")
            // NOTE: duplicate data in source csv, check with IBO
            await prisma.tBs_OekobaudatMapping.upsert({
              where: {
                oebd_processUuid_oebd_versionUuid: {
                  oebd_processUuid: value,
                  oebd_versionUuid: versionUuid,
                },
              },
              update: {
                tBs_productId: tBaustoff.id, // If record exists, update the product ID
              },
              create: {
                oebd_processUuid: value,
                oebd_versionUuid: versionUuid,
                tBs_productId: tBaustoff.id,
              },
            })
          }
        }
      }
    } catch (error) {
      console.error(`Error processing row: ${JSON.stringify(row)}`, error)
      throw error
    }
  }
}

async function main() {
  if (process.env.SEED_INITIAL_DATA !== "true") {
    console.log('env variable "SEED_INITIAL_DATA" not set to "true" - will abort seeding...')
    return
  }

  try {
    // temporarily deactivate logs and warnings during seeding (to have less noisy test output consoles)
    const consoleLog = console.log
    const consoleWarn = console.warn
    if (process.env.NODE_ENV === "test") {
      console.log = () => {}
      console.warn = () => {}
    }

    await seedCircularityTool()

    if (process.env.NODE_ENV === "test") {
      console.log = consoleLog
      console.warn = consoleWarn
    }
    console.log("Init data seeding completed successfully.")
  } catch (error) {
    console.error("Error during init data seeding:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
