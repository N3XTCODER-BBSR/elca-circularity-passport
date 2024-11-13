import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { TranslationsPlattformGeneric } from "./de"

const lifeCycleSubPhases: Record<LifeCycleSubPhaseId, string> = {
  A1A2A3: "Module A1 - A3",
  B1: "Module B1",
  B4: "Module B4",
  B6: "Module B6",
  C3: "Module C3",
  C4: "Module C4",
}

const translationsGrpPlatformGeneric = {
  overview: {
    buildingBaseInformation: {
      title: "Building Base Information",
      buildingId: "Building ID",
      coordinates: "Coordinates",
      address: "Address",
      yearOfBuildingPermit: "Year of Building Permit",
      yearOfCompletion: "Year of Completion",
      numberOfAboveGroundFloors: "Number of Above-Ground Floors",
      numberOfUndergroundFloors: "Number of Underground Floors",
      netFloorArea: {
        label: "Net Floor Area",
        abbreviation: "NFA",
        description: {
          intro:
            "Net Floor Area (NFA) refers to the total usable floor space of a building. It is divided into usage groups according to the adjacent table:",
          point1: "The usable area (UFA) effectively usable as the main functional space of a building",
          point2:
            "The technical area (TA), used to house central technical systems (e.g., heating, elevator machinery room, air conditioning systems operation room)",
          point3:
            "The circulation area (CA), which serves as access to rooms, internal circulation, or exits in case of an emergency.",
        },
      },
      grossFloorArea: {
        label: "Gross Floor Area",
        abbreviation: "GFA",
        description:
          "Gross Floor Area (GFA) refers to the total area resulting from the sum of all floor plans at all levels of a building. It is calculated per story.",
      },
      grossVolume: {
        label: "Gross Volume",
        abbreviation: "GV",
        description:
          "The Gross Volume (of buildings) according to DIN 277-1 (January 2016 edition) refers to the volume of a structure, enclosed by the outer boundary surfaces of the building, formed from the lower surface of the structural floor, the outer edges of the external walls, and the surface of the roof coverings, including dormers or skylights.",
      },
      plotArea: "Plot Area",
      totalBuildingMass: "Total Building Mass",
    },
    module1Materials: {
      moduleTitle: "Module 1",
      moduleSubtitle: "Materials",
      chartTitle: "Mass",
      navigationSections: {
        byMaterialClass: "By Material Class",
        byComponentCategory: "By Component Category",
      },
    },
    module2Resources: {
      moduleTitle: "Module 2",
      moduleSubTitle: "Resources",
      rmi: {
        title: "Resources (RMI)",
        categories: {
          renewable: "Renewable",
          nonRenewable: "Non-renewable",
        },
        names: {
          [MaterialResourceTypeNamesSchema.Enum.Forestry]: "Forestry",
          [MaterialResourceTypeNamesSchema.Enum.Aqua]: "Water",
          [MaterialResourceTypeNamesSchema.Enum.Agrar]: "Agricultural",
          [MaterialResourceTypeNamesSchema.Enum.Fossil]: "Fossil",
          [MaterialResourceTypeNamesSchema.Enum.Metallic]: "Metallic",
          [MaterialResourceTypeNamesSchema.Enum.Mineral]: "Mineral",
        },
        labels: {
          overlay: "{aggregatedValue, number, integer} t - {percentageValue, number, percentage}",
        },
        faq: {
          "1": {
            Q: "question 1 for RMI",
            A: "hello world",
          },
          "2": {
            Q: "question 2 for RMI",
            A: "hi there",
          },
        },
      },
      gwpAndPenrt: {
        penrt: {
          title: "Non-renewable Primary Energy (PENRT)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kWh",
          },
          grayEnergyTotal: "Gray Energy, total",
          grayEnergyTotalPdf: "Gray Energy",
          faq: {
            "1": {
              Q: "question 1 for PENRT",
              A: "answer",
            },
            "2": {
              Q: "question 2 for PENRT",
              A: "answer",
            },
          },
        },
        gwp: {
          title: "Global Warming Potential (GWP)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kg CO2eq",
          },
          grayEmissionsTotal: "Gray Emissions, total",
          grayEmissionsTotalPdf: "Gray Emissions",
          faq: {
            "1": {
              Q: "question 1 for GWP",
              A: "answer",
            },
            "2": {
              Q: "question 2 for GWP",
              A: "answer",
            },
          },
        },
        lifeCycleSubPhases,
      },
    },
    module3Circularity: {
      moduleTitle: "Module 3",
      moduleSubTitle: "Circularity",
      eol: {
        title: "EoL Class",
        faq: {
          "1": {
            Q: "question 1 for EOL",
            A: "answer",
          },
          "2": {
            Q: "question 2 for EOL",
            A: "answer",
          },
        },
      },
    },
  },
  detailPage: {
    component: {
      back: "Back",
      componentName: "Component Name",
      uuid: "UUID",
      costGroup: "Cost Group DIN276",
    },
    componentLayer: {
      sequenceNumber: "Sequence Number",
      mass: "Mass",
      materialGeometry: "Geometry of Component Layers / Components",
      material: {
        materialDescription: "Material Description",
        materialClassId: "UUID Material Class",
        materialClassDescription: "Material Class Description",
        uuidMaterial: "UUID Material",
        materialDatabase: "Material Database",
        serviceLife: "Service Life",
        lbPerformanceRange: "Performance Range (LB)",
        lvNumber: "Specification (LV) no.",
        itemInLv: "Position in LV",
        area: "Area",
        technicalServiceLife: "Technical Service Life",
        uuidProduct: "UUID Product",
        productDescription: "Product Description",
        manufacturerName: "Manufacturer Name",
        proofDocument: "Proof Document",
        versionNumberServiceLife: "Version Number of Service Life Table",
        oekobaudatVersion: "Ökobaudat Version",
      },
      resources: {
        rawMaterials: "Raw Materials",
        primaryEnergy: "Primary Energy Consumption (non-renewable, total)",
        carbonContent: "Carbon Content",
        recyclingContent: "Recycling Content",
        globalWarmingPotential: "Global Warming Potential (total)",
        Forestry: "Forestry",
        Aqua: "Water",
        Agrar: "Agricultural",
        Fossil: "Fossil",
        Metallic: "Metallic",
        Mineral: "Mineral",
        total: "total",
      },
      circularity: {
        general: "General",
        materialCompatibility: "Material Compatibility - Contaminants",
        eolClass: "EOL Class",
        eolPoints: "EOL Points",
        proofReuse: "Proof of Reuse",
        version: "Version",
        category: "Category",
      },
    },
    tabBar: {
      material: "Material",
      resources: "Resources",
      circularity: "Circularity",
    },
  },
}

const translationsPlatformGeneric: TranslationsPlattformGeneric = {
  Circularity: {
    Components: {
      Layers: {
        CircularityInfo: {
          title: "Circularity",
          CircularityPotential: {
            title: "Circularity Potential",
            EolUnbuilt: {
              Class: {
                title: "EoL Class (unbuilt)",
              },
              Points: {
                title: "EoL Points (unbuilt)",
              },
            },
          },
        },
      },
    },
  },
  Grp: {
    Web: {
      title: "Building Resource Passport",
      description:
        "The BBSR (Federal Institute for Research on Building, Urban Affairs and Spatial Development, Department WB6 Construction and Environment) provides this tool free of charge.",
      project: "Project",
      exportPdf: "Export PDF",
      NavBar: {
        overview: "Overview",
        catalog: "Catalog",
      },
      sections: {
        overview: translationsGrpPlatformGeneric.overview,
        detailPage: translationsGrpPlatformGeneric.detailPage,
      },
    },
    Pdf: {
      sections: {
        overview: translationsGrpPlatformGeneric.overview,
      },
    },
  },
  CircularityTool: {
    sections: {
      signin: {
        title: "eLCA Circularity Index",
        subTitle: {
          a: "Sign in with your ",
          b: "eLCA",
          c: " credentials",
        },
        form: {
          usernameLabel: "Email",
          usernamePlaceholder: "you@example.com",
          passwordLabel: "Password",
          passwordPlaceholder: "Password",
          loginButton: "Log in",
          errorMessage: "Login failed.",
        },
      },
    },
  },
  Units: {
    Kwh: {
      short: "kWh",
    },
    Tons: {
      short: "t",
      long: "Tons",
    },
    KgCo2Eq: {
      short: "kg CO2eq",
    },
  },
  GenericComponents: {
    TotalAndNrfRelativeValuesDisplay: {
      total: "total",
      areaRelated: "area related",
    },
    AggregationSelector: {
      byMaterialClass: "By Material Class",
      byComponentCategory: "By Component Category",
      total: "Total",
    },
  },
  Common: {
    materialClasses: {
      "1_1_01": "Mineral Construction Products",
      "4_3_01": "Metals",
      "2_4_01": "Insulating Materials",
      "3_2_01": "Wood",
      "5_1_01": "Covers",
      "7_2_01": "Components for Windows and Curtain Walls",
      "8_1_01": "Building Technology",
    },
    costGroups: {
      "300": "Building - Structural Works",
      "310": "Excavation",
      "311": "Excavation Preparation",
      "312": "Excavation Enclosures",
      "313": "Water Retention",
      "319": "Excavation, Miscellaneous",
      "320": "Foundation",
      "321": "Soil Improvement",
      "322": "Shallow Foundations",
      "323": "Deep Foundations",
      "324": "Subsoils and Ground Slabs",
      "325": "Floor Coverings",
      "326": "Structural Waterproofing",
      "327": "Drainage",
      "329": "Foundations, Miscellaneous",
      "330": "Exterior Walls",
      "331": "Load-Bearing Exterior Walls",
      "332": "Non-Load-Bearing Exterior Walls",
      "333": "Exterior Columns",
      "334": "Exterior Doors and Windows",
      "335": "Exterior Wall Cladding, Outside",
      "336": "Exterior Wall Cladding, Inside",
      "337": "Prefabricated Exterior Walls",
      "338": "Sun Protection",
      "339": "Exterior Walls, Miscellaneous",
      "340": "Interior Walls",
      "341": "Load-Bearing Interior Walls",
      "342": "Non-Load-Bearing Interior Walls",
      "343": "Interior Columns",
      "344": "Interior Doors and Windows",
      "345": "Interior Wall Claddings",
      "346": "Prefabricated Interior Walls",
      "349": "Interior Walls, Miscellaneous",
      "350": "Ceilings",
      "351": "Ceiling Structure",
      "352": "Ceiling Coverings",
      "353": "Ceiling Claddings",
      "359": "Ceilings, Miscellaneous",
      "360": "Roofs",
      "361": "Roof Structures",
      "362": "Roof Windows, Roof Openings",
      "363": "Roof Coverings",
      "364": "Roof Claddings - Plaster and Coverings",
      "369": "Roofs, Miscellaneous",
      "370": "Structural Installations",
      "371": "General Installations",
      "372": "Special Installations",
      "379": "Structural Installations, Miscellaneous",
      "390": "Other Measures for Structural Works",
      "391": "Construction Site Setup",
      "392": "Scaffolding",
      "393": "Safety Measures",
      "394": "Demolition Measures",
      "395": "Repairs",
      "396": "Material Disposal",
      "397": "Additional Measures",
      "398": "Temporary Structures",
      "399": "Other Measures for Structural Works, Miscellaneous",
      "500": "Outdoor Facilities",
      "510": "Land Areas",
      "511": "Topsoil Works",
      "512": "Earthworks",
      "519": "Land Areas, Miscellaneous",
      "520": "Paved Areas",
      "521": "Paths",
      "522": "Roads",
      "523": "Squares, Courtyards",
      "524": "Parking Areas",
      "525": "Sports Field Surfaces",
      "526": "Playground Surfaces",
      "527": "Railway Tracks",
      "529": "Paved Areas, Miscellaneous",
      "530": "Structures in Outdoor Facilities",
      "531": "Enclosures",
      "532": "Protective Structures",
      "533": "Walls",
      "534": "Ramps, Stairs, Tribunes",
      "535": "Canopies",
      "536": "Bridges, Walkways",
      "537": "Canal and Shaft Construction",
      "538": "Water Engineering Installations",
      "539": "Structures in Outdoor Facilities, Miscellaneous",
      "540": "Technical Installations in Outdoor Facilities",
      "541": "Wastewater Installations",
      "542": "Water Installations",
      "543": "Gas Installations",
      "544": "Heat Supply Installations",
      "545": "Air Conditioning Systems",
      "546": "High Voltage Installations",
      "547": "Telecommunication and Information Systems",
      "548": "Usage-Specific Installations",
      "549": "Technical Installations in Outdoor Facilities, Miscellaneous",
      "550": "Installations in Outdoor Facilities",
      "551": "General Installations",
      "552": "Special Installations",
      "559": "Installations in Outdoor Facilities, Miscellaneous",
      "560": "Water Surfaces",
      "561": "Sealing",
      "562": "Planting",
      "569": "Water Surfaces, Miscellaneous",
      "570": "Planting and Seeding Areas",
      "571": "Topsoil Works",
      "572": "Vegetation Soil Cultivation",
      "573": "Protective Construction Methods",
      "574": "Plants",
      "575": "Lawn and Seeding",
      "576": "Greening of Subterranean Areas",
      "579": "Planting and Seeding Areas, Miscellaneous",
      "590": "Other Outdoor Facilities",
      "591": "Construction Site Setup",
      "592": "Scaffolding",
      "593": "Safety Measures",
      "594": "Demolition Measures",
      "595": "Repairs",
      "596": "Material Disposal",
      "597": "Additional Measures",
      "598": "Temporary Outdoor Facilities",
      "599": "Other Measures for Outdoor Facilities, Miscellaneous",
    },
  },
}

export default translationsPlatformGeneric
