import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

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
          overlay: "{aggregatedValue, number, integer} Tons - {percentageValue, number, percentage}",
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
        },
        gwp: {
          title: "Global Warming Potential (GWP)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kg CO2eq",
          },
          grayEmissionsTotal: "Gray Emissions, total",
          grayEmissionsTotalPdf: "Gray Emissions",
        },
        lifeCycleSubPhases,
      },
    },
  },
}

const translationsPlatformGeneric = {
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
      },
    },
    Pdf: {
      sections: {
        overview: translationsGrpPlatformGeneric.overview,
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
  },
}

export default translationsPlatformGeneric
