import { z } from "zod"

// Define nested schemas first for better organization and readability
const MaterialReferenceDatabaseSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string().optional(),
})

const MaterialSchema = z.object({
  uuid: z.string().optional(),
  description: z.string(),
  materialReferenceDatabase: MaterialReferenceDatabaseSchema,
})

const CircularityIndexSchema = z.object({
  points: z.number(),
  className: z.string(),
})

const InterferingSubstancesSchema = z.object({
  // Define properties here when they are clear
})

const CircularitySchema = z.object({
  interferingSubstances: z.array(InterferingSubstancesSchema).optional(),
  circularityIndex: CircularityIndexSchema.optional(),
})

const PollutantsSchema = z.object({
  // Define properties here when they are clear
})

const RessourcesSchema = z.object({
  rmiMineralKg: z.string(),
  rmiMetallic: z.string(),
  rmiFossil: z.string(),
  rmiForestry: z.string(),
  rmiAgrar: z.string(),
  rmiAqua: z.string(),
})

const LayerSchema = z.object({
  buildingId: z.string(),
  lnr: z.number(),
  floor: z.string().optional(),
  room: z.string().optional(),
  componentNumber: z.string(),
  componentName: z.string(),
  costGroupDIN276: z.string(),
  amount: z.number(),
  componentGeometry: z.enum(["m2", "m3", "kg", "m", "unit"]),
  mass: z.number(),
  materialDescription: z.string(),
  materialDatabase: z.string(),
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

const BuildingComponentSchema = z.object({
  id: z.string().optional(),
  uuid: z.string(),
  name: z.string(),
  layers: z.array(LayerSchema),
})

const GeneratorSoftwareSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string(),
})

const BuildingBaseDataSchema = z.object({
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
export const PassportSchema = z.object({
  passportId: z.string(),
  versionTag: z.string(),
  generatorSoftware: GeneratorSoftwareSchema,
  elcaProjectId: z.string(),
  dataSchemaVersion: z.string(),
  buildingBaseData: BuildingBaseDataSchema,
  buildingComponents: z.array(BuildingComponentSchema),
})

// Type inference for TypeScript
export type Passport = z.infer<typeof PassportSchema>
