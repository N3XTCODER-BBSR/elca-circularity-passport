import { fakerDE as faker } from "@faker-js/faker"
import { BuildingComponent, Layer, Material, PassportData } from "utils/zod/passportSchema"

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
    costGroupCategory: 320,
    costGroupCategoryName: "Gründung",
  },
  {
    name: "Außenwand N",
    costGroupDIN276: 331,
    costGroupCategory: 330,
    costGroupCategoryName: "Außenwände",
  },
  {
    name: "Balkonbrüstung",
    costGroupDIN276: 332,
    costGroupCategory: 330,
    costGroupCategoryName: "Außenwände",
  },
  {
    name: "Innenwand tragend",
    costGroupDIN276: 341,
    costGroupCategory: 340,
    costGroupCategoryName: "Innenwände",
  },
  {
    name: "Dach O",
    costGroupDIN276: 361,
    costGroupCategory: 360,
    costGroupCategoryName: "Dächer",
  },
  {
    name: "Naturschwimmbecken",
    costGroupDIN276: 562,
    costGroupCategory: 560,
    costGroupCategoryName: "Wasserflächen",
  },
]

const materials: Material[] = [
  {
    materialDescription: "Beton C25/30 (Normalgewicht)",
    classificationNumber: "1.1.01",
    classification: "Mineralische Bauprodukte",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Bewehrungsstahl (B500B)",
    classificationNumber: "4.1.01",
    classification: "Metalle",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Keramikfliesen",
    classificationNumber: "1.3.01",
    classification: "Mineralische Bauprodukte",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Mineralwolle-Dämmung",
    classificationNumber: "2.2.01",
    classification: "Isoliermaterialien",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Brettschichtholz (GL24h)",
    classificationNumber: "3.1.01",
    classification: "Holz",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Aluminiumblech (gewalzt)",
    classificationNumber: "4.3.01",
    classification: "Metalle",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Bitumen-Dachbahn",
    classificationNumber: "5.1.01",
    classification: "Abdeckungen",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "PVC-Fensterrahmen",
    classificationNumber: "7.1.01",
    classification: "Komponenten für Fenster und Vorhangfassaden",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Gipskartonplatte",
    classificationNumber: "1.4.01",
    classification: "Mineralische Bauprodukte",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Expandiertes Polystyrol (EPS) Dämmung",
    classificationNumber: "2.4.01",
    classification: "Isoliermaterialien",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Kupferblech (gewalzt)",
    classificationNumber: "4.5.01",
    classification: "Metalle",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Eichenholz",
    classificationNumber: "3.2.01",
    classification: "Holz",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Asphalt (Straßenbau)",
    classificationNumber: "1.5.01",
    classification: "Mineralische Bauprodukte",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Schaumglas-Dämmung",
    classificationNumber: "2.6.01",
    classification: "Isoliermaterialien",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Zinkblech (gewalzt)",
    classificationNumber: "4.7.01",
    classification: "Metalle",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Melamin-beschichtete Spanplatte",
    classificationNumber: "3.3.01",
    classification: "Holz",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "EPDM-Dachmembran",
    classificationNumber: "5.2.01",
    classification: "Abdeckungen",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Doppelverglasungseinheit",
    classificationNumber: "7.2.01",
    classification: "Komponenten für Fenster und Vorhangfassaden",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Kreuzlagenholz (CLT)",
    classificationNumber: "3.4.01",
    classification: "Holz",
    materialDatabase: "OBD_2020_II_A1",
  },
  {
    materialDescription: "Mechanische Lüftung mit Wärmerückgewinnung (MVHR)",
    classificationNumber: "8.1.01",
    classification: "Gebäudetechnik",
    materialDatabase: "OBD_2020_II_A1",
  },
]

function generateComponents(componentCount: number, layerCount: number) {
  const componentsWithLayers: BuildingComponent[] = []
  for (let i = 0; i < componentCount; i++) {
    const component = faker.helpers.arrayElement(components)
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

const generateLayers = (layerCount: number) => Array.from({ length: layerCount }, generateSingleLayer)

function generateSingleLayer(): Layer {
  const eolPoints = weightedRandomEolPoints()

  const layer: Layer = {
    lnr: faker.number.int({ min: 1, max: 10 }),
    floor: faker.random.word(),
    room: faker.random.word(),
    amount: faker.number.int({ min: 2, max: 500 }),
    componentGeometry: "m2",
    mass: faker.number.float({ min: 2, max: 500 }),
    material: faker.helpers.arrayElement(materials),
    serviceLife: faker.number.int({ min: 10, max: 100 }),
    technicalServiceLife: faker.number.int({ min: 10, max: 100 }),
    uuidProduct: faker.string.uuid(),
    // TODO: use more realistic demo data
    productDescription: faker.commerce.productDescription(),
    manufacturerName: faker.company.name(),
    proofDocument: faker.random.word(),
    versionDate: faker.date.past().toISOString(),
    // TODO: use more realistic demo data
    wasteCode: faker.random.word(),
    circularity: {
      interferingSubstances: [
        {
          name: faker.random.word(),
          quantity: faker.number.int({ min: 1, max: 100 }),
        },
      ],
      eol: {
        points: eolPoints,
      },
    },
    pollutants: {
      // TODO: Define properties here when they are clear
    },
    ressources: {
      rmiMineral: faker.number.float({ min: 2, max: 5000 }),
      rmiMetallic: faker.number.float({ min: 2, max: 5000 }),
      rmiFossil: faker.number.float({ min: 2, max: 5000 }),
      rmiForestry: faker.number.float({ min: 2, max: 5000 }),
      rmiAgrar: faker.number.float({ min: 2, max: 5000 }),
      rmiAqua: faker.number.float({ min: 2, max: 5000 }),
      gwpAB6C: faker.number.float({ min: 40, max: 8000 }),
      penrtAB6C: faker.number.float({ min: 40, max: 15000 }),
    },
    serviceLifeYear: faker.number.int({ min: 10, max: 100 }),
  }
  return layer
}

export default function generatePassport(componentCount: number, layerCount: number): PassportData {
  const newPassportData: PassportData = {
    dataSchemaVersion: "v1",
    uuid: faker.string.uuid(),
    versionTag: "1.0.0",
    elcaProjectId: "",
    generatorSoftware: {
      name: "ELCA Passport Generator",
      version: "1.0.0",
      url: "",
    },
    buildingBaseData: {
      buildingStructureId: faker.string.uuid(),
      address: faker.address.streetAddress() + ", " + faker.address.zipCode() + " " + faker.address.city(),
      buildingYear: faker.number.int({ min: 1950, max: 2025 }),
      // TODO: add more building types
      buildingType: faker.helpers.arrayElement(["1310 - Ministerien / Staatskanzleien / Landesvertretungen"]),
      numberOfFloors: faker.number.int({ min: 1, max: 10 }),
      plotArea: faker.number.int({ min: 500, max: 5000 }),
      nrf: faker.number.float({ min: 500, max: 5000 }),
      bgf: faker.number.float({ min: 600, max: 6000 }),
      bri: faker.number.float({ min: 1500, max: 15000 }),
      propertyArea: faker.number.int({ min: 500, max: 5000 }),
      sealedPropertyAreaProportion: faker.number.float({ min: 0, max: 1 }),
      totalBuildingMass: faker.number.int({ min: 1000000, max: 10000000 }),
      dataQuality: "Estimiert",
      queryPlanningDocumentsAvailable: faker.datatype.boolean(),
      planningDocuments: "",
      hazardousSubstanceReportAvailable: faker.datatype.boolean(),
      assessments: "",
    },
    buildingComponents: generateComponents(componentCount, layerCount),
  }

  return newPassportData
}
