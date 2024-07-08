import { z } from 'zod';

// Define nested schemas first for better organization and readability
const MaterialReferenceDatabaseSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string().optional(),
});

const MaterialSchema = z.object({
  uuid: z.string(),
  description: z.string(),
  materialReferenceDatabase: MaterialReferenceDatabaseSchema,
  // Add additional simple fields here if needed
});

const CircularityIndexSchema = z.object({
  points: z.number(),
  className: z.string(),
});

const InterferingSubstancesSchema = z.object({
  // Define properties here when they are clear
});

const CircularitySchema = z.object({
  interferingSubstances: z.array(InterferingSubstancesSchema).optional(),
  circularityIndex: CircularityIndexSchema.optional(),
  // Add more fields here as they become defined
});

const PollutantsSchema = z.object({
  // Define properties here when they are clear
});

const RessourcesSchema = z.object({
    rmiMineralKg: z.string(),
    rmiMetallic: z.string(),
    rmiFossil: z.string(),
    rmiForestry: z.string(),
    rmiAgrar: z.string(),
    rmiAqua: z.string(),
    // Add more fields here as needed
  });
  

const LayerSchema = z.object({
  // "id": z.string().optional(), // Uncomment if needed
  mass: z.number(),
  material: MaterialSchema,
  circularity: CircularitySchema.optional(),
  pollutants: PollutantsSchema.optional(),
  ressources: RessourcesSchema.optional(),
  serviceLifeYear: z.number(),
});

const BuildingComponentSchema = z.object({
  id: z.string().optional(), // Adjust based on discussion outcomes
  uuid: z.string(),
  name: z.string(),
  layers: z.array(LayerSchema),
});

const GeneratorSoftwareSchema = z.object({
  name: z.string(),
  version: z.string(),
  url: z.string(),
});

// Define the main schema
const BuildingProjectSchema = z.object({
  passportId: z.string(),
  versionTag: z.string(),
  generatorSoftware: GeneratorSoftwareSchema,
  elcaProjectId: z.string(),
  dataSchemaVersion: z.string(),
  // Add additional static properties like address if needed
  buildingComponents: z.array(BuildingComponentSchema),
});

// Type inference for TypeScript
export type BuildingProject = z.infer<typeof BuildingProjectSchema>;

