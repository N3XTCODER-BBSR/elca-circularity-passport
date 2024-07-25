import { z } from "zod"

// Define nested schemas first for better organization and readability
const MaterialReferenceDatabaseSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string().optional(),
})

export const MaterialSchema = z.object({
  materialDescription: z.string(),
  classificationNumber: z.string(),
  classification: z.string(),
  materialDatabase: z.string(),
})
export type Material = z.infer<typeof MaterialSchema>

const EolSchema = z.object({
  points: z.number(),
})

const InterferingSubstancesSchema = z.object({
  // Define properties here when they are clear
})

const CircularitySchema = z.object({
  interferingSubstances: z.array(InterferingSubstancesSchema).optional(),
  eol: EolSchema.optional(),
})

const PollutantsSchema = z.object({
  // Define properties here when they are clear
})

export const RessourcesSchema = z.object({
  rmiMineral: z.number(),
  rmiMetallic: z.number(),
  rmiFossil: z.number(),
  rmiForestry: z.number(),
  rmiAgrar: z.number(),
  rmiAqua: z.number(),
  gwpAB6C: z.number(),
  penrtAB6C: z.number(),
})

export type Ressources = z.infer<typeof RessourcesSchema>

export const LayerSchema = z.object({
  // buildingId: z.string(),
  lnr: z.number(),
  floor: z.string().optional(),
  room: z.string().optional(),
  amount: z.number(),
  componentGeometry: z.enum(["m2", "m3", "kg", "m", "unit"]),
  mass: z.number(),
  material: MaterialSchema,
  serviceLife: z.number(),
  technicalServiceLife: z.number(),
  uuidProduct: z.string().optional(),
  productDescription: z.string().optional(),
  manufacturerName: z.string().optional(),
  proofDocument: z.string().optional(),
  versionDate: z.string().optional(),
  wasteCode: z.string(),
  circularity: CircularitySchema.optional(),
  pollutants: PollutantsSchema.optional(),
  ressources: RessourcesSchema.optional(),
  serviceLifeYear: z.number().optional(),
})

export type Layer = z.infer<typeof LayerSchema>

export const BuildingComponentSchema = z.object({
  id: z.string().optional(),
  uuid: z.string(),
  name: z.string(),
  costGroupCategoryName: z.string(),
  costGroupCategory: z.number(),
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
  nrf: z.number(),
  bgf: z.number(),
  bri: z.number(),
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
  versionTag: z.string(),
  generatorSoftware: GeneratorSoftwareSchema,
  elcaProjectId: z.string(),
  dataSchemaVersion: z.string(),
  buildingBaseData: BuildingBaseDataSchema,
  buildingComponents: z.array(BuildingComponentSchema),
})

// Type inference for TypeScript
export type PassportData = z.infer<typeof PassportDataSchema>
