import { PrismaClient, TBs_ProductDefinitionEOLCategoryScenario } from "@prisma/client"
import generatePassport from "../../lib/domain-logic/grp/data-schema/versions/v1/passportJsonSeeder"
import { z } from "zod"

const prisma = new PrismaClient()

const seedPassport = async () => {
  const passport1PassDataV1 = generatePassport(20, 7)

  await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      uuid: passport1PassDataV1.uuid,
      versionTag: "1",
      passportData: JSON.stringify(passport1PassDataV1),
      issueDate: new Date("2024-04-02"),
      expiryDate: new Date("2029-04-02"),
    },
  })
}

// export type OekobaudatUuids = {
//   "448d1096-2017-4901-a560-f652a83c737e": string, // Example: null or 9fcc1331-0b4f-4c52-a5fc-e42d25c601dd
//   "22885a6e-1765-4ade-a35e-ae668bd07256": string, // Example: 5796c4d9-62e2-45f2-ae6c-23eade5d105b
//   "XXXXXXXXXXXX": string, // Example: 15d41442-f7d9-46fb-9de4-0c7e68a88f69
// }

// export type EolCategory = {
//   eolCategoryUuid: string
//   eolCategoryName: string
//   eolScenarioReal?: TBs_ProductDefinitionEOLCategoryScenario
//   eolScenarioPotential?: TBs_ProductDefinitionEOLCategoryScenario
//   eolTechnologyFactor?: number

// }

// export type OekobaudatToProductAndCategoryMapping = {
//   oekobaudatName: string
//   oekobaudatUuids: OekobaudatUuids
//   tBaustoffName: string
//   eolCategoryUuid: string
// }

const OekobaudatUuidsSchema = z.object({
  "448d1096-2017-4901-a560-f652a83c737e": z.string().nullable(),
  "22885a6e-1765-4ade-a35e-ae668bd07256": z.string().nullable(),
  XXXXXXXXXXXX: z.string().nullable(),
})

const EolCategorySchema = z.object({
  eolCategoryUuid: z.string(),
  eolCategoryName: z.string(),
  eolScenarioReal: z.string().optional(),
  eolScenarioPotential: z.string().optional(),
  eolTechnologyFactor: z.number().optional(),
})

export const OekobaudatToProductAndCategoryMappingSchema = z.object({
  oekobaudatName: z.string(),
  oekobaudatUuids: OekobaudatUuidsSchema,
  tProductBaustoffId: z.number(),
  // tBaustoffName: z.string(),
  // eolCategoryId: z.string().nullable(),
})

// Define TypeScript types from Zod schemas
export type OekobaudatUuids = z.infer<typeof OekobaudatUuidsSchema>
export type EolCategory = z.infer<typeof EolCategorySchema>
export type OekobaudatToProductAndCategoryMapping = z.infer<typeof OekobaudatToProductAndCategoryMappingSchema>

async function seedCircularityTool() {
  // Seeding for all TBaustoff/Circularity related tables
  // Define the Oekobaudat versions
  // const OEKOBAUDAT_VERSIONS = {
  //   "2020-II": "version-2020-II",
  //   "2023-I": "version-2023-I",
  //   "2024-I": "version-2024-I",
  // }
  // const data: OekobaudatToProductAndCategoryMapping[] = ...
  // Sample data

  const categories = {
    1: {
      eolCategoryName: "Mineralwolle Glaswolle",
      eolScenarioReal: TBs_ProductDefinitionEOLCategoryScenario.DEP_MINUS,
      eolScenarioPotential: TBs_ProductDefinitionEOLCategoryScenario.SV,
      eolTechnologyFactor: 0.75,
    },
    2: {
      eolCategoryName: "Holz - massiv, naturbelassen",
      eolScenarioReal: TBs_ProductDefinitionEOLCategoryScenario.RC_PLUS,
      eolScenarioPotential: TBs_ProductDefinitionEOLCategoryScenario.CL_PLUS,
      eolTechnologyFactor: 0.75,
    },
  }

  const tProductBaustoffs = {
    1: {
      tBaustoffName: "Brettschichtholz Nadelholz",
      tBaustoffVersion: "2024-Q4",
      eolCategoryId: 2,
    },
    2: {
      tBaustoffName: "Einblasdämmung Mineralwolle Rho 50 kg/m³",
      tBaustoffVersion: "2024-Q4",
      eolCategoryId: 1,
    },
  }

  const sampleData: OekobaudatToProductAndCategoryMapping[] = [
    {
      oekobaudatName: "Einblasdämmung Mineralwolle",
      oekobaudatUuids: {
        "448d1096-2017-4901-a560-f652a83c737e": "601af947-1f14-474d-8233-780715a12268",
        "22885a6e-1765-4ade-a35e-ae668bd07256": "b3abdd33-34fc-473a-a235-218cfd601c8e",
        XXXXXXXXXXXX: "7395adfa-2a3f-43f1-be88-5d4a392968a5",
      },
      tProductBaustoffId: 2,
    },
  ]

  for (const eolCategory of Object.values(categories)) {
    await prisma.tBs_ProductDefinitionEOLCategory.create({
      data: {
        name: eolCategory.eolCategoryName,
        eolScenarioUnbuiltReal: eolCategory.eolScenarioReal,
        eolScenarioUnbuiltPotential: eolCategory.eolScenarioPotential,
        technologyFactor: eolCategory.eolTechnologyFactor,
      },
    })
  }

  for (const [id, tProductBaustoff] of Object.entries(tProductBaustoffs)) {
    await prisma.tBs_ProductDefinition.create({
      data: {
        id: parseInt(id),
        tBs_version: tProductBaustoff.tBaustoffVersion,
        name: tProductBaustoff.tBaustoffName,
        tBs_ProductDefinitionEOLCategoryId: tProductBaustoff.eolCategoryId,
      },
    })
  }

  for (const mapping of sampleData) {
    const obdUuidForVersion448d1096 = mapping.oekobaudatUuids["448d1096-2017-4901-a560-f652a83c737e"]
    if (!obdUuidForVersion448d1096) {
      continue
    }
    await prisma.tBs_OekobaudatMapping.create({
      data: {
        oebd_processUuid: obdUuidForVersion448d1096,
        oebd_versionUuid: "448d1096-2017-4901-a560-f652a83c737e",
        tBs_productId: mapping.tProductBaustoffId,
      },
    })
  }

  // for (const mapping of sampleData) {
  //   const category = mapping.eolCategoryId ? await prisma.tBs_ProductDefinitionEOLCategory.findUnique({
  //     where: { id: mapping.eolCategoryId }
  //   }) : null

  //   await prisma.tBaustoff_OekobaudatMapping.create({
  //     data: {
  //       // oekobaudatProcessUuid String
  //       // oekobaudatVersionUuid       String
  //       // tBaustoffProductId          Int?
  //       // tBaustoffProduct            TBaustoff_Product? @relation(name: "ProductToMapping", fields: [tBaustoffProductId], references: [id])

  //       oekobaudatProcessUuid: mapping.oekobaudatUuids["448d1096-2017-4901-a560-f652a83c737e"],

  //       // oekobaudatName: mapping.oekobaudatName,
  //       // oekobaudatUuids: mapping.oekobaudatUuids,
  //       // tBaustoffName: mapping.tBaustoffName,
  //       // eolCategory: category ? {
  //       //   connect: {
  //       //     id: category.id
  //       //   }
  //       } : undefined
  //     }
  //   })
  // }
}

async function main() {
  await seedPassport()
  await seedCircularityTool()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
