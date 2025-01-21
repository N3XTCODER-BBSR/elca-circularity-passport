import { z } from "zod"
import { DismantlingPotentialClassId } from "prisma/generated/client"

const dateStringYYYYMMDDCheck = (val: string): boolean => {
  const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val)
  if (!isValidFormat) return false

  const date = new Date(val)
  return !isNaN(date.getTime()) && val === date.toISOString().split("T")[0]
}

export const MaterialTradeSchema = z.object({
  lbPerformanceRange: z.string().nullish(),
  trade: z.string().nullish(),
  lvNumber: z.string().nullish(),
  itemInLv: z.string().nullish(),
})

const ProofDocument = z.object({
  url: z.string().url(),
  versionDate: z.string().refine(dateStringYYYYMMDDCheck, {
    message: "Invalid date format, must be YYYY-MM-DD",
  }),
})

export const MaterialSpecificProductSchema = z.object({
  uuid: z.string().uuid().nullish(),
  technicalServiceLifeInYears: z.number().min(0).nullish(),
  // TODO: PM asked to leave it out for now
  description: z.string().nullish(),
  manufacturerName: z.string().nullish(),
  versionDate: z.string().nullish(),
  proofDocuments: z.array(ProofDocument),
})

export type MaterialProduct = z.infer<typeof MaterialSpecificProductSchema>

export type MaterialTradeDetails = z.infer<typeof MaterialTradeSchema>

const MaterialGeometrySchema = z.object({
  unit: z.enum(["m", "m2", "m3", "pieces"]),
  amount: z.number().positive(),
})

export type MaterialGeometry = z.infer<typeof MaterialGeometrySchema>

const InterferingSubstancesSchema = z.object({
  className: z.string(),
  description: z.string().nullish(),
})

export const CircularitySchema = z.object({
  rebuildPoints: z.number(),
  eolPoints: z.number(),
  dismantlingPotentialClassId: z.nativeEnum(DismantlingPotentialClassId),
  circularityIndex: z.number(),
  methodologyVersion: z.string().describe("e.g. 'BNB 07 Kreislauffähigkeit'"),
  proofReuse: z.string().nullish(),
  interferingSubstances: z.array(InterferingSubstancesSchema).optional(),
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

// PENRT
export const ResourcesEmbodiedEnergySchema = z.object({
  [LifeCycleSubPhaseIdSchema.Enum.A1A2A3]: z
    .number()
    .describe("Primary Energy (non-renewable) in kWh for phases A1-A3")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Enum.B1]: z
    .number()
    .describe("Primary Energy (non-renewable) in kWh for phase B1")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Enum.B4]: z
    .number()
    .describe("Primary Energy (non-renewable) in kWh for phase B4")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Enum.B6]: z
    .number()
    .describe("Primary Energy (non-renewable) in kWh for phase B6")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Enum.C3]: z
    .number()
    .describe("Primary Energy (non-renewable) in kWh for phase C3")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Enum.C4]: z
    .number()
    .describe("Primary Energy (non-renewable) in kWh for phase C4")
    .nullable(),
})
export type ResourcesEmbodiedEnergy = z.infer<typeof ResourcesEmbodiedEnergySchema>

// GWP
export const ResourcesEmbodiedEmissionsSchema = z.object({
  [LifeCycleSubPhaseIdSchema.Values.A1A2A3]: z
    .number()
    .describe("Global Warming Potential in kg CO2 eq for phases A1-A3")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Values.B1]: z
    .number()
    .describe("Global Warming Potential in kg CO2 eq for phase B1")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Values.B4]: z
    .number()
    .describe("Global Warming Potential in kg CO2 eq for phase B4")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Values.B6]: z
    .number()
    .describe("Global Warming Potential in kg CO2 eq for phase B6")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Values.C3]: z
    .number()
    .describe("Global Warming Potential in kg CO2 eq for phase C3")
    .nullable(),
  [LifeCycleSubPhaseIdSchema.Values.C4]: z
    .number()
    .describe("Global Warming Potential in kg CO2 eq for phase C4")
    .nullable(),
})
export type ResourcesEmbodiedEmissions = z.infer<typeof ResourcesEmbodiedEmissionsSchema>

export const RessourcesSchema = z.object({
  rawMaterialsInKg: ResourcesRawMaterialsSchema,
  embodiedEnergyInKwh: ResourcesEmbodiedEnergySchema,
  embodiedEmissionsInKgCo2Eq: ResourcesEmbodiedEmissionsSchema,
  recyclingContentInKg: z.number().nullish(),
})

export type Ressources = z.infer<typeof RessourcesSchema>

export const MaterialSchema = z.object({
  serviceLifeInYears: z.number().nonnegative(),
  serviceLifeTableVersion: z.string().describe('Version number of the service life table ("Nutzungsdauer-Tabelle")'),
  trade: MaterialTradeSchema,
  genericMaterial: z
    .object({
      uuid: z.string(),
      name: z.string(),
      classId: z.string(),
      classDescription: z.string(),
      oekobaudatDbVersion: z.string(),
    })
    .describe("Generic material data from the Oekobaudat database"),
  specificProduct: MaterialSpecificProductSchema.optional(),

  layerIndex: z.number(),
  name: z.string(),
  massInKg: z.number().nonnegative(),
  materialGeometry: MaterialGeometrySchema,
  // ressources: RessourcesSchema.optional(),
  circularity: CircularitySchema.optional(),
  pollutants: PollutantsSchema.optional(),
})

export type Material = z.infer<typeof MaterialSchema>

export const BuildingComponentSchema = z.object({
  // TODO: clarify with BSR team if id is needed
  // id: z.string(),
  uuid: z.string(),
  name: z.string(),
  costGroupDIN276: z.number(),
  materials: z.array(MaterialSchema),
})

export type BuildingComponent = z.infer<typeof BuildingComponentSchema>

export const GeneratorSoftwareSchema = z.object({
  // TODO: take over default values from the github gist
  name: z.string(),
  version: z.string(),
  url: z.string(),
})

export const BuildingStructureIdSchema = z.object({
  "ALKIS-ID": z.string().nullish(),
  Identifikationsnummer: z.string().nullish(),
  Aktenzeichen: z.string().nullish(),
  "Lokale Gebäude-ID": z.string().nullish(),
  "Nationale UUID": z.string().nullish(),
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

export const PassportDataSchema = z.object({
  uuid: z.string(),
  date: z
    .string()
    .refine(dateStringYYYYMMDDCheck, {
      message: "Invalid date format, must be YYYY-MM-DD",
    })
    .describe("Date of creation of the passport"),
  authorName: z.string().describe("Name of the person responsible for validating the passport"),
  generatorSoftware: GeneratorSoftwareSchema,
  elcaProjectId: z.string(),
  projectName: z.string(),
  dataSchemaVersion: z.string(),
  buildingBaseData: BuildingBaseDataSchema,
  buildingComponents: z.array(BuildingComponentSchema),
})

export type PassportData = z.infer<typeof PassportDataSchema>
