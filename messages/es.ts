import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

const lifeCycleSubPhases: Record<LifeCycleSubPhaseId, string> = {
  A1A2A3: "Módulo A1 - A3",
  B1: "Módulo B1",
  B4: "Módulo B4",
  B6: "Módulo B6",
  C3: "Módulo C3",
  C4: "Módulo C4",
}

const translationsGrpPlattformGeneric = {
  overview: {
    buildingBaseInformation: {
      title: "Información básica del edificio",
      buildingId: "ID del Edificio/Estructura",
      coordinates: "Coordenadas",
      address: "Dirección",
      yearOfBuildingPermit: "Año de Permiso de Construcción",
      yearOfCompletion: "Año de Finalización",
      numberOfAboveGroundFloors: "Número de Pisos Sobre el Suelo",
      numberOfUndergroundFloors: "Número de Pisos Subterráneos",
      netFloorArea: {
        label: "Superficie Neta",
        abbreviation: "SNF",
        description: {
          intro:
            "La Superficie Neta (SNF) se refiere a la suma de las áreas útiles de un edificio. Se calcula dividiendo la superficie en grupos de uso, como se detalla en la siguiente tabla:",
          point1:
            "el área de uso (AU) como la superficie que puede utilizarse de manera efectiva para el propósito adecuado del edificio",
          point2:
            "el área técnica (AT), que se utiliza para albergar instalaciones técnicas centrales (por ejemplo, calefacción, sala de máquinas para el ascensor, sala para operar sistemas de aire acondicionado)",
          point3:
            "el área de circulación (AC), que sirve para acceder a las habitaciones, para el tránsito dentro de los edificios o para la salida en caso de emergencia.",
        },
      },
      grossFloorArea: {
        label: "Superficie Bruta",
        abbreviation: "SBF",
        description:
          "La Superficie Bruta (SBF) es la suma de todas las superficies de todos los niveles de un edificio. Se debe calcular por piso.",
      },
      grossVolume: {
        label: "Volumen Bruto",
        abbreviation: "VB",
        description:
          "El Volumen Bruto (de edificios) según la norma DIN 277-1 (a partir de enero de 2016) es el volumen de un edificio delimitado por las superficies exteriores del cuerpo del edificio, desde la superficie inferior del suelo estructural (parte inferior de los suelos y losas que no están destinadas a la cimentación), los bordes exteriores de las paredes exteriores y la superficie del revestimiento del techo, incluidas las buhardillas o lucernarios.",
      },
      plotArea: "Área del Terreno",
      totalBuildingMass: "Masa Total del Edificio",
    },
    module1Materials: {
      moduleTitle: "Módulo 1",
      moduleSubtitle: "Materiales",
      chartTitle: "Masa",
      navigationSections: {
        byMaterialClass: "Por Grupos de Material",
        byComponentCategory: "Por Categorías de Componentes",
      },
    },
    module2Resources: {
      moduleTitle: "Módulo 2",
      moduleSubTitle: "Recursos",
      rmi: {
        title: "Recursos (RMI)",
        categories: {
          renewable: "Renovable",
          nonRenewable: "No Renovable",
        },
        names: {
          [MaterialResourceTypeNamesSchema.Enum.Forestry]: "Forestal",
          [MaterialResourceTypeNamesSchema.Enum.Aqua]: "Agua",
          [MaterialResourceTypeNamesSchema.Enum.Agrar]: "Agrícola",
          [MaterialResourceTypeNamesSchema.Enum.Fossil]: "Fósil",
          [MaterialResourceTypeNamesSchema.Enum.Metallic]: "Metálico",
          [MaterialResourceTypeNamesSchema.Enum.Mineral]: "Mineral",
        },
        labels: {
          overlay: "{aggregatedValue, number, integer} toneladas - {percentageValue, number, percentage}",
        },
      },
      gwpAndPenrt: {
        penrt: {
          title: "Energía Primaria No Renovable (PENRT)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kwH",
          },
          grayEnergyTotal: "Emisiones Grises, total",
          grayEnergyTotalPdf: "Emisiones Grises",
        },
        gwp: {
          title: "Potencial de Calentamiento Global (GWP)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kg Co2eq",
          },
          grayEmissionsTotal: "Energía Gris, total",
          grayEmissionsTotalPdf: "Energía Gris",
        },
        lifeCycleSubPhases,
      },
    },
  },
}

const translationsPlattformGeneric = {
  Grp: {
    Web: {
      title: "Pasaporte de Recursos para Edificios",
      description:
        "El BBSR (Instituto Federal de Investigación sobre la Construcción, Asuntos Urbanos y Espaciales, Sección WB6 Construcción y Medio Ambiente) proporciona esta herramienta de forma gratuita.",
      project: "Proyecto",
      exportPdf: "Exportar PDF",
      NavBar: {
        overview: "Resumen",
        catalog: "Catálogo",
      },
      sections: {
        overview: translationsGrpPlattformGeneric.overview,
      },
    },
    Pdf: {
      sections: {
        overview: translationsGrpPlattformGeneric.overview,
      },
    },
  },
  Units: {
    Kwh: {
      short: "kwH",
    },
    Tons: {
      short: "t",
      long: "toneladas",
    },
    KgCo2Eq: {
      short: "kg Co2eq",
    },
  },
  GenericComponents: {
    TotalAndNrfRelativeValuesDisplay: {
      total: "total",
      areaRelated: "relacionado con el área",
    },
  },
}

export default translationsPlattformGeneric
