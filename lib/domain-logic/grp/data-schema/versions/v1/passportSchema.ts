import { z } from "zod"

const dateStringYYYYMMDDCheck = (val: string): boolean => {
  // Check if the string matches the YYYY-MM-DD format using a regex
  const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val)
  if (!isValidFormat) return false

  // Check if the string is a valid date
  const date = new Date(val)
  return !isNaN(date.getTime()) && val === date.toISOString().split("T")[0]
}

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

const ProofDocument = z.object({
  url: z.string().url(),
  versionDate: z.string().refine(dateStringYYYYMMDDCheck, {
    message: "Invalid date format, must be YYYY-MM-DD",
  }),
})

export const MaterialProductSchema = z.object({
  uuid: z.string().uuid().optional(),
  technicalServiceLifeInYears: z.number().min(0).optional(),
  description: z.string().optional(),
  manufacturerName: z.string().optional(),
  versionDate: z.string().optional(),
  proofDocuments: z.array(ProofDocument),
})

export type MaterialProduct = z.infer<typeof MaterialProductSchema>

export type MaterialTradeDetails = z.infer<typeof MaterialTradeSchema>

export const MaterialWasteSchema = z.object({
  wasteCode: z.string(),
})

export type MaterialWaste = z.infer<typeof MaterialWasteSchema>

const MaterialGeometrySchema = z.object({
  unit: z.enum(["m", "m2", "m3", "pieces"]),
  amount: z.number().positive(),
})

export type MaterialGeometry = z.infer<typeof MaterialGeometrySchema>

export const MaterialSchema = z.object({
  uuid: z.string(),
  materialDescription: z.string(),
  materialClassId: z.string(),
  materialClassDescription: z.string(),
  oekobaudatVersion: z.string(),
  serviceLifeInYears: z.number().nonnegative(),
  serviceLifeTableVersion: z.string().describe('Version number of the service life table ("Nutzungsdauer-Tabelle")'),
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

export const MaterialResourceTypeNamesSchema = z.enum(["Forestry", "Agrar", "Aqua", "Mineral", "Metallic", "Fossil"])

export type MaterialResourceTypeNames = z.infer<typeof MaterialResourceTypeNamesSchema>

export const ResourcesRawMaterialsSchema = z.object({
  [MaterialResourceTypeNamesSchema.Enum.Mineral]: z.number(),
  [MaterialResourceTypeNamesSchema.Enum.Metallic]: z.number(),
  [MaterialResourceTypeNamesSchema.Enum.Fossil]: z.number(),
  [MaterialResourceTypeNamesSchema.Enum.Forestry]: z.number(),
  [MaterialResourceTypeNamesSchema.Enum.Agrar]: z.number(),
  [MaterialResourceTypeNamesSchema.Enum.Aqua]: z.number(),
})

export type ResourcesRawMaterials = z.infer<typeof ResourcesRawMaterialsSchema>

export const LifeCycleSubPhaseIdSchema = z.enum(["A1A2A3", "B1", "B4", "B6", "C3", "C4"])

export type LifeCycleSubPhaseId = z.infer<typeof LifeCycleSubPhaseIdSchema>

export const ResourcesEmbodiedEnergySchema = z.object({
  [LifeCycleSubPhaseIdSchema.Enum.A1A2A3]: z.number().describe("Primary Energy (non-renewable) in kWh"),
  [LifeCycleSubPhaseIdSchema.Enum.B1]: z.number().describe("Primary Energy (non-renewable) in kWh"),
  [LifeCycleSubPhaseIdSchema.Enum.B4]: z.number().describe("Primary Energy (non-renewable) in kWh"),
  [LifeCycleSubPhaseIdSchema.Enum.B6]: z.number().describe("Primary Energy (non-renewable) in kWh"),
  [LifeCycleSubPhaseIdSchema.Enum.C3]: z.number().describe("Primary Energy (non-renewable) in kWh"),
  [LifeCycleSubPhaseIdSchema.Enum.C4]: z.number().describe("Primary Energy (non-renewable) in kWh"),
})
export type ResourcesEmbodiedEnergy = z.infer<typeof ResourcesEmbodiedEnergySchema>

export const ResourcesEmbodiedEmissionsSchema = z.object({
  [LifeCycleSubPhaseIdSchema.Values.A1A2A3]: z.number().describe("Global Warming Potential in kg CO2 eq"),
  [LifeCycleSubPhaseIdSchema.Values.B1]: z.number().describe("Global Warming Potential in kg CO2 eq"),
  [LifeCycleSubPhaseIdSchema.Values.B4]: z.number().describe("Global Warming Potential in kg CO2 eq"),
  [LifeCycleSubPhaseIdSchema.Values.B6]: z.number().describe("Global Warming Potential in kg CO2 eq"),
  [LifeCycleSubPhaseIdSchema.Values.C3]: z.number().describe("Global Warming Potential in kg CO2 eq"),
  [LifeCycleSubPhaseIdSchema.Values.C4]: z.number().describe("Global Warming Potential in kg CO2 eq"),
})
export type ResourcesEmbodiedEmissions = z.infer<typeof ResourcesEmbodiedEmissionsSchema>

export const RessourcesSchema = z.object({
  rawMaterials: ResourcesRawMaterialsSchema,
  embodiedEnergy: ResourcesEmbodiedEnergySchema,
  embodiedEmissions: ResourcesEmbodiedEmissionsSchema,
  carbonContent: z.number().optional(),
  recyclingContent: z.number().optional(),
})

export type Ressources = z.infer<typeof RessourcesSchema>

export const LayerSchema = z.object({
  // buildingId: z.string(),
  lnr: z.number(),
  name: z.string(),
  mass: z.number().nonnegative(),
  materialGeometry: MaterialGeometrySchema,
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
  costGroupDIN276: z.number(),
  layers: z.array(LayerSchema),
})

export type BuildingComponent = z.infer<typeof BuildingComponentSchema>

export const GeneratorSoftwareSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string(),
})

export const BuildingStructureIdSchema = z.object({
  "ALKIS-ID": z.string().optional(),
  Identifikationsnummer: z.string().optional(),
  Aktenzeichen: z.string().optional(),
  "Lokale Gebäude-ID": z.string().optional(),
  "Nationale UUID": z.string().optional(),
})

export const BuildingBaseDataSchema = z.object({
  buildingStructureId: BuildingStructureIdSchema,
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  address: z.string(),
  buildingPermitYear: z.number(),
  buildingCompletionYear: z.number(),
  buildingType: z.string(),
  numberOfUpperFloors: z.number(),
  numberOfBasementFloors: z.number(),
  plotArea: z.number(),
  nrf: z.number().describe("Netto-Raum-Fläche"),
  bgf: z.number().describe("Brutto-Geschoss-Fläche"),
  bri: z.number().describe("Brutto-Raum-Inhalt"),
  totalBuildingMass: z.number(),
})

// Define the main schema
export const PassportDataSchema = z.object({
  uuid: z.string(),
  date: z
    .string()
    .refine(dateStringYYYYMMDDCheck, {
      message: "Invalid date format, must be YYYY-MM-DD",
    })
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
