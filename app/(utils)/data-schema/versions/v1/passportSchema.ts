// import { raw } from "@prisma/client/runtime/library"
import { z } from "zod"
// import { version } from "os"

// Define nested schemas first for better organization and readability
// const MaterialReferenceDatabaseSchema = z.object({
//   name: z.string(),
//   version: z.string(),
//   url: z.string().optional(),
// })

// { key: "LB Performance Range", value: material. },
// { key: "Trade", value: "FOO" },
// { key: "LV Number", value: "FOO" },
// { key: "Item In LV", value: "FOO" },
// { key: "Area", value: "FOO" },
export const MaterialTradeSchema = z.object({
  lbPerformanceRange: z.string().optional(),
  trade: z.string().optional(),
  lvNumber: z.string().optional(),
  itemInLv: z.string().optional(),
  area: z.number().optional(),
})

export const MaterialProductSchema = z.object({
  uuid: z.string().uuid().optional(),
  technicalServiceLifeInYears: z.number().min(0).optional(),
  description: z.string().optional(),
  manufacturerName: z.string().optional(),
  versionDate: z.string().optional(),
  proofDocumentUrls: z.array(z.string().url()),
})

export type MaterialProduct = z.infer<typeof MaterialProductSchema>

export type MaterialTradeDetails = z.infer<typeof MaterialTradeSchema>

export const MaterialWasteSchema = z.object({
  wasteCode: z.string(),
})

export type MaterialWaste = z.infer<typeof MaterialWasteSchema>

export const MaterialSchema = z.object({
  uuid: z.string(),
  materialDescription: z.string(),
  classificationNumber: z.string(),
  classification: z.string(),
  materialDatabase: z.string(),
  serviceLife: z.number().optional(), //TODO: clarify if this should be indeed optional
  trade: MaterialTradeSchema,
  product: MaterialProductSchema,
  waste: MaterialWasteSchema,
})

export type Material = z.infer<typeof MaterialSchema>

const InterferingSubstancesSchema = z.object({
  className: z.string(),
  description: z.string().optional(),

  // Define properties here when they are clear
})

const CircularitySchema = z.object({
  eolPoints: z.number().optional(),
  version: z.string().optional(),
  category: z.string().optional(),
  proofReuse: z.string().optional(),
  interferingSubstances: z.array(InterferingSubstancesSchema),
})

export type Circularity = z.infer<typeof CircularitySchema>

const PollutantsSchema = z.object({
  // Define properties here when they are clear
})

export const ResourcesRawMaterialsSchema = z.object({
  rmiMineral: z.number(),
  rmiMetallic: z.number(),
  rmiFossil: z.number(),
  rmiForestry: z.number(),
  rmiAgrar: z.number(),
  rmiAqua: z.number(),
})
export type ResourcesRawMaterials = z.infer<typeof ResourcesRawMaterialsSchema>

export const ResourcesEmbodiedEnergySchema = z.object({
  penrtAB6C: z.number(),
})
export type ResourcesEmbodiedEnergy = z.infer<typeof ResourcesEmbodiedEnergySchema>

export const ResourcesEmbodiedEmissionsSchema = z.object({
  gwpAB6C: z.number(),
})
export type ResourcesEmbodiedEmissions = z.infer<typeof ResourcesEmbodiedEmissionsSchema>

export const ResourcesCarbonContentSchema = z.object({
  carbonContent: z.number(),
})
export type ResourcesCarbonContent = z.infer<typeof ResourcesCarbonContentSchema>

export const ResourcesRecylingContentSchema = z.object({
  recyclingContent: z.number(),
})
export type ResourcesRecylingContent = z.infer<typeof ResourcesRecylingContentSchema>

export const ResourcesSustainableForestrySchema = z.object({
  bnb117qng313Fulfilled: z.boolean().optional(),
  fscPefcWoodContentInMPercent: z.number().optional(),
})
export type ResourcesSustainableForestry = z.infer<typeof ResourcesSustainableForestrySchema>

export const ResourcesSustainableBuildingIndustrySchema = z.object({
  recycledContentInMPercent: z.number().optional(),
  qng313Fulfilled: z.boolean().optional(),
})
export type ResourcesSustainableBuildingIndustry = z.infer<typeof ResourcesSustainableBuildingIndustrySchema>

export const RessourcesSchema = z.object({
  rawMaterials: ResourcesRawMaterialsSchema,
  embodiedEnergy: ResourcesEmbodiedEnergySchema,
  embodiedEmissions: ResourcesEmbodiedEmissionsSchema,
  carbonContent: ResourcesCarbonContentSchema,
  recylingContent: ResourcesRecylingContentSchema,
  sustainableForestry: ResourcesSustainableForestrySchema,
  sustainableBuildingIndustry: ResourcesSustainableBuildingIndustrySchema,
})

export type Ressources = z.infer<typeof RessourcesSchema>

export const LayerSchema = z.object({
  // buildingId: z.string(),
  lnr: z.number(),
  name: z.string(),
  mass: z.number(),
  material: MaterialSchema,
  ressources: RessourcesSchema,
  circularity: CircularitySchema,
  pollutants: PollutantsSchema,
})

export type Layer = z.infer<typeof LayerSchema>

export const BuildingComponentSchema = z.object({
  // TODO: clarify with BSR team if id is needed
  // id: z.string(),
  uuid: z.string(),
  name: z.string(),
  room: z.string().optional(),
  floor: z.string().optional(),
  costGroupDIN276: z.number(),
  layers: z.array(LayerSchema),
})

export type BuildingComponent = z.infer<typeof BuildingComponentSchema>

export const GeneratorSoftwareSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string(),
})

export const BuildingBaseDataSchema = z.object({
  buildingStructureId: z.string(),
  address: z.string(),
  buildingYear: z.number(),
  buildingType: z.string(),
  numberOfFloors: z.number(),
  plotArea: z.number(),
  nrf: z.number().describe("Netto-Raum-Fläche"),
  bgf: z.number().describe("Brutto-Geschoss-Fläche"),
  bri: z.number().describe("Brutto-Raum-Inhalt"),
  propertyArea: z.number(),
  sealedPropertyAreaProportion: z.number(),
  totalBuildingMass: z.number(),
  dataQuality: z.string(),
  queryPlanningDocumentsAvailable: z.boolean(),
  planningDocuments: z.string().optional(),
  hazardousSubstanceReportAvailable: z.boolean(),
  assessments: z.string().optional(),
})

// Define the main schema
export const PassportDataSchema = z.object({
  uuid: z.string(),
  date: z
    .string()
    .refine(
      (val) => {
        // Check if the string matches the YYYY-MM-DD format using a regex
        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val)
        if (!isValidFormat) return false

        // Check if the string is a valid date
        const date = new Date(val)
        return !isNaN(date.getTime()) && val === date.toISOString().split("T")[0]
      },
      {
        message: "Invalid date format, must be YYYY-MM-DD",
      }
    )
    .describe("Date of creation of the passport"),
  authorName: z.string().describe("Name of the person responsible for validating the passport"),
  versionTag: z.string(),
  generatorSoftware: GeneratorSoftwareSchema,
  elcaProjectId: z.string(),
  projectName: z.string(),
  dataSchemaVersion: z.string(),
  buildingBaseData: BuildingBaseDataSchema,
  buildingComponents: z.array(BuildingComponentSchema),
})

// export const SchemaVersionDetailsSchema = z.object({
//   schemaVersion: z.string(),
//   schemaVersionDate: z.string(),
//   schemaVersionDescription: z.string(),
// })

// Type inference for TypeScript
export type PassportData = z.infer<typeof PassportDataSchema>
