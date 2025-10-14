import csv from "csv-parser"
import fs from "fs"
import path from "path"
import { prisma } from "../prismaClient"

const csvFilePath = path.resolve(
  __dirname,
  "./v1_initial_release_obd_tbaustoff_mapping__70ee17c1-b144-45d1-97c2-f600f238e112.csv"
)

type CsvRow = {
  tBaustoffName: string
  processCategoryNumber: string
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

export async function updateProcessCategoryNumbers() {
  const csvData = await readCsvFile(csvFilePath)

  console.log("Starting to update process category numbers...")

  for (const row of csvData) {
    try {
      // Find the existing product by name and update only its processCategoryNumber
      await prisma.tBs_ProductDefinition.updateMany({
        where: {
          name: row.tBaustoffName,
        },
        data: {
          processCategoryNumber: row.processCategoryNumber || null,
        },
      })
    } catch (error) {
      console.error(`Error processing row for ${row.tBaustoffName}:`, error)
    }
  }
}

async function main() {
  try {
    await updateProcessCategoryNumbers()
    console.log("Process category numbers update completed successfully.")
  } catch (error) {
    console.error("Error during process category numbers update:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}
