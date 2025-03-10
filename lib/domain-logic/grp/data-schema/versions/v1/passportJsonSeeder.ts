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
import { fakerDE as faker } from "@faker-js/faker"
import { BuildingComponent, Material, MaterialProduct, MaterialTradeDetails, PassportData } from "./passportSchema"

const components = [
  {
    name: "KellerBoden",
    costGroupDIN276: 324,
  },
  {
    name: "Keller Abdichtung",
    costGroupDIN276: 326,
  },
  {
    name: "Außenwand N",
    costGroupDIN276: 331,
  },
  {
    name: "Spezialaussenwand (tragend)",
    costGroupDIN276: 332,
  },
  {
    name: "Balkonbrüstung",
    costGroupDIN276: 332,
  },
  {
    name: "Außenwand O",
    costGroupDIN276: 333,
  },
  {
    name: "Innenwand tragend",
    costGroupDIN276: 341,
  },
  {
    name: "Dach O",
    costGroupDIN276: 361,
  },
  {
    name: "Spezial-Dach P",
    costGroupDIN276: 361,
  },
  {
    name: "Dach nach Bauweise QX",
    costGroupDIN276: 361,
  },
  {
    name: "Naturschwimmbecken",
    costGroupDIN276: 562,
  },
]

const materialTradeDetails: MaterialTradeDetails[] = [
  {
    lbPerformanceRange: "013",
    trade: "Maler",
    lvNumber: "02",
    itemInLv: "02.0020",
    // surfaceInM2: 10.24,
  },
]
// TODO (S): update materialClasses according to data structure excel:
//docs.google.com/spreadsheets/d/1jumm46MoBhc9N_fzn3alHKczoUH2FrWCL880lmoE-js/edit?gid=1863730613#gid=1863730613
const materialClasses = {
  "1.1.01": "Mineralische Bauprodukte",
  "4.3.01": "Metalle",
  "2.4.01": "Isoliermaterialien",
  "3.2.01": "Holz",
  "5.1.01": "Abdeckungen",
  "7.2.01": "Komponenten für Fenster und Vorhangfassaden",
  "8.1.01": "Gebäudetechnik",
}

type MaterialClassId = keyof typeof materialClasses
interface ReferenceMaterial {
  name: string
  materialClassId: MaterialClassId // Only valid keys from materialClasses
}

const referenceMaterials: ReferenceMaterial[] = [
  { name: "Beton C25/30 (Normalgewicht)", materialClassId: "1.1.01" },
  { name: "Bewehrungsstahl (B500B)", materialClassId: "4.3.01" },
  { name: "Keramikfliesen", materialClassId: "1.1.01" },
  { name: "Mineralwolle-Dämmung", materialClassId: "2.4.01" },
  { name: "Brettschichtholz (GL24h)", materialClassId: "3.2.01" },
  { name: "Aluminiumblech (gewalzt)", materialClassId: "4.3.01" },
  { name: "Bitumen-Dachbahn", materialClassId: "5.1.01" },
  { name: "PVC-Fensterrahmen", materialClassId: "7.2.01" },
  { name: "Gipskartonplatte", materialClassId: "1.1.01" },
  { name: "Expandiertes Polystyrol (EPS) Dämmung", materialClassId: "2.4.01" },
  { name: "Kupferblech (gewalzt)", materialClassId: "4.3.01" },
  { name: "Eichenholz", materialClassId: "3.2.01" },
  { name: "Asphalt (Straßenbau)", materialClassId: "1.1.01" },
  { name: "Schaumglas-Dämmung", materialClassId: "2.4.01" },
  { name: "Zinkblech (gewalzt)", materialClassId: "4.3.01" },
  { name: "Melamin-beschichtete Spanplatte", materialClassId: "3.2.01" },
  { name: "EPDM-Dachmembran", materialClassId: "5.1.01" },
  { name: "Doppelverglasungseinheit", materialClassId: "7.2.01" },
  { name: "Kreuzlagenholz (CLT)", materialClassId: "3.2.01" },
  { name: "Mechanische Lüftung mit Wärmerückgewinnung (MVHR)", materialClassId: "8.1.01" },
]

// Build material details list dynamically
const materialDetailsWithoutUuidAndServiceLifeList = referenceMaterials.map((material) => ({
  name: material.name,
  classId: material.materialClassId,
  classDescription: materialClasses[material.materialClassId],
}))

export function generateComponents(
  componentCount: number,
  layerCount: number,
  fakerSeedValue: number = 123
): BuildingComponent[] {
  faker.seed(fakerSeedValue)
  const componentsWithLayers: BuildingComponent[] = []
  for (let i = 0; i < componentCount; i++) {
    const randomCmponent = faker.helpers.arrayElement(components)
    const component = {
      ...randomCmponent,
      name: randomCmponent.name + " " + i,
    }
    componentsWithLayers.push({
      uuid: faker.string.uuid(),
      ...component,
      materials: generateMaterials(layerCount),
    })
  }
  return componentsWithLayers
}

function weightedRandomPoints(range1: [number, number], range2: [number, number]): number {
  // 40% chance of being in range1
  if (Math.random() < 0.4) {
    return faker.number.int({ min: range1[0], max: range1[1] })
  } else {
    // 60% chance of being in the range2
    return faker.number.int({ min: range2[0], max: range2[1] })
  }
}

function randomRebuildPoints(): 0 | 50 | 75 | 100 {
  const values: Array<0 | 50 | 75 | 100> = [0, 50, 75, 100]
  const randomIndex = Math.floor(Math.random() * values.length)

  return values[randomIndex] as 0 | 50 | 75 | 100
}

const generateMaterialProduct = (): MaterialProduct => {
  return {
    uuid: faker.string.uuid(),
    technicalServiceLifeInYears: faker.number.int({ min: 1, max: 100 }),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    manufacturerName: faker.company.name(),
    proofDocuments: faker.helpers.arrayElements(
      [
        {
          url: "https://www.saint-gobain.com/sites/saint-gobain.com/files/media/document/20220512_IDS_VF.pdf",
          versionDate: "2022-05-12",
        },
        { url: "https://www.rigips.de/media/23851/download?attachment", versionDate: "2022-05-12" },
      ],
      {
        min: 0,
        max: 6,
      }
    ),
    versionDate: faker.date.past().toISOString(),
  }
}

const generateMaterials = (materialsCount: number) => Array.from({ length: materialsCount }, generateSingleMaterial)

function generateSingleMaterial(): Material {
  const eolPoints = weightedRandomPoints([-60, -20], [-19, 140])
  const rebuildPoints = randomRebuildPoints()

  const material: Material = {
    name: faker.helpers.arrayElement(["Gypsum Plasterboard"]),
    layerIndex: faker.number.int({ min: 1, max: 10 }),
    massInKg: faker.number.float({ min: 2, max: 500 }),
    specificProduct: generateMaterialProduct(),
    serviceLifeTableVersion: "Version 2024",
    serviceLifeInYears: faker.number.int({ min: 1, max: 100 }),
    trade: faker.helpers.arrayElement(materialTradeDetails),
    volume: faker.number.float({ min: 2, max: 500 }),
    materialGeometry: {
      unit: faker.helpers.arrayElement(["m", "m2", "m3", "pieces"]),
      amount: faker.number.float({ min: 1, max: 500 }),
    },
    genericMaterial: {
      ...faker.helpers.arrayElement(materialDetailsWithoutUuidAndServiceLifeList),
      uuid: faker.string.uuid(),
      oekobaudatDbVersion: "OBD_2020_II_A1",
    },
    circularity: {
      eolPoints: eolPoints,
      dismantlingPotentialClassId: faker.helpers.arrayElement(["I", "II", "III"]),
      circularityIndex: Math.round(0.7 * eolPoints + 0.3 * rebuildPoints),
      methodologyVersion: faker.helpers.arrayElement(["KSB BNB 2.0.6", "KSB BNB 4.1.4"]),
      rebuildPoints,
      // category: faker.helpers.arrayElement(["Zerstörungsfrei"]),
      proofReuse: faker.helpers.arrayElement(["Rücknahmegarantie"]),
      interferingSubstances: [
        {
          className: faker.helpers.arrayElement(["S1", "S2", "S3"]),
          description: faker.helpers.arrayElement(["Kleber", "Schrauben"]),
        },
      ],
    },
    pollutants: {
      // TODO: Define properties here when they are clear
    },
    // ressources: {
    //   rawMaterialsInKg: {
    //     [MaterialResourceTypeNamesSchema.Enum.Mineral]: faker.number.float({ min: 2, max: 5000 }),
    //     [MaterialResourceTypeNamesSchema.Enum.Metallic]: faker.number.float({ min: 2, max: 5000 }),
    //     [MaterialResourceTypeNamesSchema.Enum.Fossil]: faker.number.float({ min: 2, max: 5000 }),
    //     [MaterialResourceTypeNamesSchema.Enum.Forestry]: faker.number.float({ min: 2, max: 5000 }),
    //     [MaterialResourceTypeNamesSchema.Enum.Agrar]: faker.number.float({ min: 2, max: 5000 }),
    //     [MaterialResourceTypeNamesSchema.Enum.Aqua]: faker.number.float({ min: 2, max: 5000 }),
    //   },
    //   embodiedEnergyInKwh: {
    //     A1A2A3: faker.number.float({ min: 40, max: 15000 }),
    //     B1: faker.number.float({ min: 40, max: 15000 }),
    //     B4: faker.number.float({ min: 40, max: 15000 }),
    //     B6: faker.number.float({ min: 40, max: 15000 }),
    //     C3: faker.number.float({ min: 40, max: 15000 }),
    //     C4: faker.number.float({ min: 40, max: 15000 }),
    //   },
    //   embodiedEmissionsInKgCo2Eq: {
    //     A1A2A3: faker.number.float({ min: 40, max: 8000 }),
    //     B1: faker.number.float({ min: 40, max: 8000 }),
    //     B4: faker.number.float({ min: 40, max: 8000 }),
    //     B6: faker.number.float({ min: 40, max: 8000 }),
    //     C3: faker.number.float({ min: 40, max: 8000 }),
    //     C4: faker.number.float({ min: 40, max: 8000 }),
    //   },
    //   recyclingContentInKg: faker.number.float({ min: 40, max: 8000 }),
    // },
  }
  return material
}

export default function generatePassport(
  componentCount: number,
  layerCount: number,
  fakerSeedValue: number = 123
): PassportData {
  faker.seed(fakerSeedValue)

  const randomDate = faker.date.between({ from: "2020-01-01", to: "2024-12-31" })
  // Format the date to YYYY-MM-DD
  const formattedRandomDate = randomDate.toISOString().split("T")[0]!

  const buildingPermitYear = faker.number.int({ min: 1950, max: 2022 })
  const buildingCompletionYear = faker.number.int({ min: buildingPermitYear, max: 2025 })

  const newPassportData: PassportData = {
    uuid: "a4ffd66a-c69b-4fb6-9c17-f43492db42f7",
    date: formattedRandomDate,
    authorName: faker.person.fullName(),
    dataSchemaVersion: "v1",
    // versionTag: "1.0.0",
    elcaProjectId: "",
    projectName: faker.helpers.arrayElement(["Bundesinstitut für Bau-, Stadt- und Raumforschung Berlin"]),
    generatorSoftware: {
      name: "ELCA Passport Generator",
      version: "1.0.0",
      url: "",
    },
    buildingBaseData: {
      buildingStructureId: {
        "ALKIS-ID": faker.helpers.maybe(() => faker.string.alphanumeric()),
        Identifikationsnummer: faker.helpers.maybe(() => faker.string.alphanumeric()),
        Aktenzeichen: faker.helpers.maybe(() => faker.string.alphanumeric()),
        "Lokale Gebäude-ID": faker.helpers.maybe(() => faker.string.alphanumeric()),
        "Nationale UUID": faker.helpers.maybe(() => faker.string.uuid()),
      },
      coordinates: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      address: faker.location.streetAddress() + ", " + faker.location.zipCode() + " " + faker.location.city(),
      buildingPermitYear,
      buildingCompletionYear,
      buildingType: faker.helpers.arrayElement(["1310 - Ministerien / Staatskanzleien / Landesvertretungen"]),
      numberOfUpperFloors: faker.number.int({ min: 1, max: 10 }),
      numberOfBasementFloors: faker.number.int({ min: 1, max: 2 }),
      plotArea: faker.number.int({ min: 500, max: 5000 }),
      nrf: faker.number.float({ min: 500, max: 5000 }),
      bgf: faker.number.float({ min: 600, max: 6000 }),
      bri: faker.number.float({ min: 1500, max: 15000 }),
      totalBuildingMass: faker.number.int({ min: 1000000, max: 10000000 }),
    },
    buildingComponents: generateComponents(componentCount, layerCount, fakerSeedValue),
  }

  return newPassportData
}
