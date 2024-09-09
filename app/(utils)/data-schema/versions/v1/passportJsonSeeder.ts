import { fakerDE as faker } from "@faker-js/faker"
import {
  BuildingComponent,
  Layer,
  MaterialProduct,
  MaterialTradeDetails,
  MaterialWaste,
  PassportData,
} from "./passportSchema"

// TODO: use this once we have clarity about material categories
// const materialCategories = [
//   { id: "1", name: "Mineralische Bauprodukte", obdCategories: ["1"] },
//   { id: "2", name: "Isoliermaterialien", obdCategories: ["2"] },
//   { id: "3", name: "Holz", obdCategories: ["3"] },
//   { id: "4", name: "Metalle", obdCategories: ["4"] },
//   { id: "5", name: "Abdeckungen", obdCategories: ["5"] },
//   { id: "7", name: "Komponenten für Fenster und Vorhangfassaden", obdCategories: ["7"] },
//   { id: "8", name: "Gebäudetechnik", obdCategories: ["8"] },
//   { id: "9", name: "Sonstige", obdCategories: ["6", "9", "10", "100"] },
// ]

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
    area: 10.24,
  },
]
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
interface Material {
  materialDescription: string
  materialClassId: MaterialClassId // Only valid keys from materialClasses
}

const materials: Material[] = [
  { materialDescription: "Beton C25/30 (Normalgewicht)", materialClassId: "1.1.01" },
  { materialDescription: "Bewehrungsstahl (B500B)", materialClassId: "4.3.01" },
  { materialDescription: "Keramikfliesen", materialClassId: "1.1.01" },
  { materialDescription: "Mineralwolle-Dämmung", materialClassId: "2.4.01" },
  { materialDescription: "Brettschichtholz (GL24h)", materialClassId: "3.2.01" },
  { materialDescription: "Aluminiumblech (gewalzt)", materialClassId: "4.3.01" },
  { materialDescription: "Bitumen-Dachbahn", materialClassId: "5.1.01" },
  { materialDescription: "PVC-Fensterrahmen", materialClassId: "7.2.01" },
  { materialDescription: "Gipskartonplatte", materialClassId: "1.1.01" },
  { materialDescription: "Expandiertes Polystyrol (EPS) Dämmung", materialClassId: "2.4.01" },
  { materialDescription: "Kupferblech (gewalzt)", materialClassId: "4.3.01" },
  { materialDescription: "Eichenholz", materialClassId: "3.2.01" },
  { materialDescription: "Asphalt (Straßenbau)", materialClassId: "1.1.01" },
  { materialDescription: "Schaumglas-Dämmung", materialClassId: "2.4.01" },
  { materialDescription: "Zinkblech (gewalzt)", materialClassId: "4.3.01" },
  { materialDescription: "Melamin-beschichtete Spanplatte", materialClassId: "3.2.01" },
  { materialDescription: "EPDM-Dachmembran", materialClassId: "5.1.01" },
  { materialDescription: "Doppelverglasungseinheit", materialClassId: "7.2.01" },
  { materialDescription: "Kreuzlagenholz (CLT)", materialClassId: "3.2.01" },
  { materialDescription: "Mechanische Lüftung mit Wärmerückgewinnung (MVHR)", materialClassId: "8.1.01" },
]

// Build material details list dynamically
const materialDetailsWithoutUuidAndServiceLifeList = materials.map((material) => ({
  materialDescription: material.materialDescription,
  materialClassId: material.materialClassId,
  materialClassDescription: materialClasses[material.materialClassId],
}))

export function generateComponents(componentCount: number, layerCount: number): BuildingComponent[] {
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
      layers: generateLayers(layerCount),
    })
  }
  return componentsWithLayers
}

function weightedRandomEolPoints() {
  // 40% chance of being in the range [-60, -20]
  if (Math.random() < 0.4) {
    return faker.number.int({ min: -60, max: -20 })
  } else {
    // 60% chance of being in the range [-19, 140]
    return faker.number.int({ min: -19, max: 140 })
  }
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

const generateMaterialWaste = (): MaterialWaste => {
  return {
    wasteCode: faker.random.word(),
  }
}

const generateLayers = (layerCount: number) => Array.from({ length: layerCount }, generateSingleLayer)

function generateSingleLayer(): Layer {
  const eolPoints = weightedRandomEolPoints()

  const layer: Layer = {
    name: faker.helpers.arrayElement(["Gypsum Plasterboard"]),
    lnr: faker.number.int({ min: 1, max: 10 }),
    mass: faker.number.float({ min: 2, max: 500 }),
    materialGeometry: {
      unit: faker.helpers.arrayElement(["m", "m2", "m3", "pieces"]),
      amount: faker.number.float({ min: 1, max: 500 }),
    },
    material: {
      ...faker.helpers.arrayElement(materialDetailsWithoutUuidAndServiceLifeList),
      oekobaudatVersion: "OBD_2020_II_A1",
      uuid: faker.string.uuid(),
      serviceLifeInYears: faker.number.int({ min: 1, max: 100 }),
      trade: faker.helpers.arrayElement(materialTradeDetails),
      product: generateMaterialProduct(),
      waste: generateMaterialWaste(),
    },
    circularity: {
      eolPoints: eolPoints,
      version: faker.helpers.arrayElement(["KSB BNB 2.0.6", "KSB BNB 4.1.4"]),
      category: faker.helpers.arrayElement(["Zerstörungsfrei"]),
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
    ressources: {
      rawMaterials: {
        rmiMineral: faker.number.float({ min: 2, max: 5000 }),
        rmiMetallic: faker.number.float({ min: 2, max: 5000 }),
        rmiFossil: faker.number.float({ min: 2, max: 5000 }),
        rmiForestry: faker.number.float({ min: 2, max: 5000 }),
        rmiAgrar: faker.number.float({ min: 2, max: 5000 }),
        rmiAqua: faker.number.float({ min: 2, max: 5000 }),
      },
      embodiedEnergy: {
        penrtA1A2A3: faker.number.float({ min: 40, max: 15000 }),
        penrtB1: faker.number.float({ min: 40, max: 15000 }),
        penrtB4: faker.number.float({ min: 40, max: 15000 }),
        penrtB6: faker.number.float({ min: 40, max: 15000 }),
        penrtC3: faker.number.float({ min: 40, max: 15000 }),
        penrtC4: faker.number.float({ min: 40, max: 15000 }),
      },
      embodiedEmissions: {
        gwpA1A2A3: faker.number.float({ min: 40, max: 8000 }),
        gwpB1: faker.number.float({ min: 40, max: 8000 }),
        gwpB4: faker.number.float({ min: 40, max: 8000 }),
        gwpB6: faker.number.float({ min: 40, max: 8000 }),
        gwpC3: faker.number.float({ min: 40, max: 8000 }),
        gwpC4: faker.number.float({ min: 40, max: 8000 }),
      },
      carbonContent: faker.number.float({ min: 40, max: 8000 }),
      recyclingContent: faker.number.float({ min: 40, max: 8000 }),
    },
  }
  return layer
}

export default function generatePassport(componentCount: number, layerCount: number): PassportData {
  const randomDate = faker.date.between("2020-01-01", "2024-12-31")
  // Format the date to YYYY-MM-DD
  const formattedRandomDate = randomDate.toISOString().split("T")[0]!

  const buildingPermitYear = faker.number.int({ min: 1950, max: 2022 })
  const buildingCompletionYear = faker.number.int({ min: buildingPermitYear, max: 2025 })

  const newPassportData: PassportData = {
    uuid: "a4ffd66a-c69b-4fb6-9c17-f43492db42f7",
    date: formattedRandomDate,
    authorName: faker.person.fullName(),
    dataSchemaVersion: "v1",
    versionTag: "1.0.0",
    elcaProjectId: "",
    projectName: faker.helpers.arrayElement([
      "Bundesministerium für ökologische Innovation, Biodiversitätsschutz und nachhaltigen Konsum – Dienstsitz Berlin",
      faker.company.name(),
    ]),
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
      address: faker.address.streetAddress() + ", " + faker.address.zipCode() + " " + faker.address.city(),
      buildingPermitYear,
      buildingCompletionYear,
      // TODO: add more building types
      buildingType: faker.helpers.arrayElement(["1310 - Ministerien / Staatskanzleien / Landesvertretungen"]),
      numberOfUpperFloors: faker.number.int({ min: 1, max: 10 }),
      numberOfBasementFloors: faker.number.int({ min: 1, max: 2 }),
      plotArea: faker.number.int({ min: 500, max: 5000 }),
      nrf: faker.number.float({ min: 500, max: 5000 }),
      bgf: faker.number.float({ min: 600, max: 6000 }),
      bri: faker.number.float({ min: 1500, max: 15000 }),
      totalBuildingMass: faker.number.int({ min: 1000000, max: 10000000 }),
    },
    buildingComponents: generateComponents(componentCount, layerCount),
  }

  return newPassportData
}
