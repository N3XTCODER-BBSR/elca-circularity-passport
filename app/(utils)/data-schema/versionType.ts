import { BuildingComponent, PassportData } from "./versions/v1/passportSchema"

export type Din276Mapping = {
  [key: string]: string
}

export type generateComponents = (componentCount: number, layerCount: number) => BuildingComponent[]

export type generatePassport = (componentCount: number, layerCount: number) => PassportData

export type Seeder = {
  generateComponents: generateComponents
  generatePassport: generatePassport
}

export type Version = {
  Din276Mapping: Din276Mapping
  // schema: TYPEHERE
  versionTag: string
  seeder: Seeder
  migrateFromPreviousVersion<PreviousVersion extends Version>(passportData: PreviousVersion): Version
}

export type versionFactory = () => Version

// export const currentVersion: Version =
