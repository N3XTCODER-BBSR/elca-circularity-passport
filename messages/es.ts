import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { TranslationsPlattformGeneric } from "./de"

const lifeCycleSubPhases: Record<LifeCycleSubPhaseId, string> = {
  A1A2A3: "Módulo A1 - A3",
  B1: "Módulo B1",
  B4: "Módulo B4",
  B6: "Módulo B6",
  C3: "Módulo C3",
  C4: "Módulo C4",
}

// const translationsGrpPlattformGeneric: TranslationsPlattformGeneric = {
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
          title: "Energía Primaria No Renovable (PENRT)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kwH",
          },
          grayEnergyTotal: "Emisiones Grises, total",
          grayEnergyTotalPdf: "Emisiones Grises",
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
          title: "Potencial de Calentamiento Global (GWP)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kg Co2eq",
          },
          grayEmissionsTotal: "Energía Gris, total",
          grayEmissionsTotalPdf: "Energía Gris",
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
      moduleTitle: "Módulo 3",
      moduleSubTitle: "Circularidad",
      eol: {
        title: "Clase EoL",
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
    moduleByMaterialCategory: {
      title: "Por Categoría de Material",
      totalMass: "Masa total",
    },
  },
  projectsPage: {
    yourProjects: "Tus proyectos",
    createdOn: "Creado el",
    createdBy: "Creado por",
    variants: "Variantes",
  },
  variantsPage: {
    project: "proyecto",
    createdOn: "Creado el",
  },
  detailPage: {
    component: {
      back: "Volver",
      componentName: "Nombre del Componente",
      uuid: "UUID",
      costGroup: "Grupo de Costos DIN276",
    },
    componentLayer: {
      sequenceNumber: "Número Secuencial",
      mass: "Masa",
      materialGeometry: "Geometría de las Capas de Componentes / Componentes",
      material: {
        materialDescription: "Descripción del Material",
        materialClassId: "id de categoría",
        materialClassDescription: "Descripción de la Clase de Material",
        uuidMaterial: "UUID Material",
        materialDatabase: "Base de Datos de Materiales",
        serviceLife: "Vida Útil",
        lbPerformanceRange: "Rango de Rendimiento (LB)",
        lvNumber: "Número de Especificación (LV)",
        itemInLv: "Posición en LV",
        area: "Área",
        technicalServiceLife: "Vida Útil Técnica",
        uuidProduct: "UUID Producto",
        productDescription: "Descripción del Producto",
        manufacturerName: "Nombre del Fabricante",
        proofDocument: "Documento de Evidencia",
        versionNumberServiceLife: "Número de Versión de la Tabla de Vida Útil",
        oekobaudatVersion: "Versión Ökobaudat",
      },
      resources: {
        rawMaterials: "Materias Primas",
        primaryEnergy: "Consumo de Energía Primaria (no renovable, total)",
        recyclingContent: "Contenido Reciclado",
        globalWarmingPotential: "Potencial de Calentamiento Global (total)",
        Forestry: "Forestal",
        Aqua: "Agua",
        Agrar: "Agrícola",
        Fossil: "Fósil",
        Metallic: "Metálico",
        Mineral: "Mineral",
        total: "total",
      },
      circularity: {
        general: "General",
        materialCompatibility: "Compatibilidad del Material - Contaminantes",
        eolClass: "Clase EOL",
        disturbingSubstanceNameUnspecified: "sin especificar",
        circularityIndex: "Índice de Circularidad",
        dismantlingClass: "Clase de Desmantelamiento",
        eolPoints: "Puntos EOL",
        proofReuse: "Prueba de Reutilización",
        version: "Versión",
        category: "Categoría",
      },
    },
    tabBar: {
      material: "Material",
      resources: "Recursos",
      circularity: "Circularidad",
    },
  },
}

const translationsPlattformGeneric: TranslationsPlattformGeneric = {
  Circularity: {
    Components: {
      name: "Nombre del Componente",
      uuid: "UUID",
      costGroup: "Grupo de Coste DIN 276",
      numberInstalled: "Número Instalado",
      referenceUnit: "Unidad de Referencia",
      noBuildingMaterials: "No hay nada aquí. Agrega un material de construcción en elca para comenzar.",
      headers: {
        metrics: {
          mass: "Masa",
          volume: "Volumen",
          points: "Puntos",
          class: "Clase",
        },
        materialDensity: "Densidad del Material",
        circularityPotential: "Potencial de Circularidad (instalado)",
        dismantlingPotential: "Potencial de Desmontaje",
      },
      buildingMaterialsHeading: "Materiales (relativos a 1 {refUnit})",
      layersHeading: "Capas (de interior a exterior)",
      nonLayersHeading: "Otros Materiales",
      Layers: {
        mass: "Masa",
        volume: "Volumen",
        headers: {
          metrics: {
            points: "Puntos",
            class: "Clase",
          },
          dismantlingPotential: "Potencial de Desmontaje",
          eolUnbuilt: "Potencial de Circularidad (no instalado)",
          materialCompatibility: "Compatibilidad del Material",
          circularityPotential: "Potencial de Circularidad (instalado)",
        },
        incomplete: "Incompleto",
        excludedFromCalculation: "Excluido del cálculo",
        CircularityInfo: {
          sections: {
            disturbingSubstances: {
              classNamesForSelectorButtons: {
                S0: "S0 - Sin sustancias contaminantes",
                S1: "S1",
                S2: "S2",
                S3: "S3",
                S4: "S4",
              },
              substanceNameInputPlaceholder: "Nombre de la sustancia contaminante",
              specificScenarioForS4: {
                modal: {
                  title: "Escenario EOL en caso de S4",
                  selectEolScenario: "Selección de un escenario EOL",
                  warningBox:
                    "Se ha seleccionado una sustancia contaminante S4. Los puntos EOL no se pueden deducir automáticamente. Seleccione manualmente un nuevo escenario EOL considerando la sustancia contaminante.",
                  ctaHint: "Seleccione una opción del menú desplegable y use la guía de referencia a continuación.",
                  referenceInstructionTable: {
                    tableTitle: "Guía de Referencia",
                    columnHeaders: {
                      tBaustoffProduct: "Producto tBaustoff",
                      eolScenarioSpecific: "Escenario EOL - Construido (específico)",
                    },
                  },
                },
              },
            },
            dismantlingPotential: {
              dismantlingClassNames: {
                1: "Desmontado de manera no destructiva",
                2: "Se puede desmontar con daños mínimos",
                3: "Desmontable de manera destructiva sin impurezas",
                4: "Solo se puede desmontar con impurezas",
              },
            },
          },
          title: "Circularidad",
          tBaustoffMaterial: "tBaustoff",
          tBaustoffSelector: {
            select: "Seleccionar",
            modalBody:
              "No se encontró coincidencia para este producto Ökobaudat. Seleccione un material tBaustoff de la lista.",
            cancel: "Cancelar",
            save: "Guardar",
          },
          circularityIndex: "Indice de Circularidad",
          EolDataSection: {
            title: "Potencial de Circularidad - No construido",
            details: "Detalles",
            EolUnbuilt: {
              Class: {
                class: "Clase EOL",
                title: "Clase EOL (No construido)",
                specific: "Clase EOL (Específica)",
                real: "Clase EOL (Real)",
                potential: "Clase EOL (Potencial)",
              },
              Points: {
                points: "Puntos EOL",
                title: "Puntos EOL (No construido)",
                specific: "Puntos EOL (Específicos)",
                real: "Puntos EOL (Reales)",
                potential: "Puntos EOL (Potenciales)",
              },
              Scenario: {
                real: "Escenario EOL (Real)",
                potential: "Escenario EOL (Potencial)",
                specific: "Escenario EOL (Específico)",
              },
            },
            ModalPage1: {
              title: "El escenario EOL seleccionado actualmente es:",
              description: "¿Desea sobrescribir estos valores?",
              buttonNo: "No, mantener los valores",
              buttonYes: "Sí, sobrescribir",
            },
            ModalPage2: {
              title: "Escenario EOL (Específico)",
              empty: "[VACÍO]",
              proof: "Prueba para sobrescribir el escenario EOL predeterminado",
              description: "¿Desea sobrescribir estos valores?",
              buttonCancel: "Cancelar",
              buttonSave: "Guardar",
              buttonEdit: "Editar",
              proofPlaceholder: "Proporcione su prueba aquí...",
            },
          },
          RebuildSection: {
            title: "Potencial de Desmontaje",
            rebuildClass: "Clase de Desmontaje",
            rebuildPoints: "Puntos de Desmontaje",
            error: "Por favor, seleccione el potencial de desmontaje",
          },
          EolBuiltSection: {
            title: "Potencial de Circularidad - Construido",
            emptyState:
              "Seleccione sustancias contaminantes; si no hay ninguna, seleccione 'Sin sustancias contaminantes - S0'.",
            eolScenarioS4: "Escenario EOL en caso de S4",
            selectEolScenario: "Seleccione manualmente un nuevo escenario EOL",
            overrideEolScenarioButton: "+ Escenario EOL Construido (Específico)",
            eolScenarioBuiltSpecific: "Escenario EOL Construido (Específico)",
            points: "Puntos EOL (Construido)",
            class: "Clase EOL (Construido)",
            disturbingSubstances: "Contaminantes",
            newSubstance: "Nuevo Contaminante",
          },
        },
      },
    },
  },
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
        buildingPassport: "Pasaporte",
        switchProject: "Cambiar proyecto",
        switchVariant: "Cambiar variante",
        back: "Atrás",
      },
      sections: {
        variants: translationsGrpPlattformGeneric.variantsPage,
        projects: translationsGrpPlattformGeneric.projectsPage,
        overview: translationsGrpPlattformGeneric.overview,
        detailPage: translationsGrpPlattformGeneric.detailPage,
      },
    },
    Pdf: {
      sections: {
        overview: translationsGrpPlattformGeneric.overview,
      },
    },
  },
  CircularityTool: {
    sections: {
      passportsForProject: {
        title: "Pases de Recursos Generados del Edificio",
        passIssueDate: "Fecha de emisión del pase",
        passUuid: "ID del pase",
        createPassport: "Crear un nuevo pase",
        creatingPassport: "Creación del pase en progreso...",
      },
      signin: {
        title: "Índice de Circularidad eLCA",
        subTitle: {
          a: "Inicie sesión con sus ",
          b: "credenciales eLCA",
          c: "",
        },
        form: {
          usernameLabel: "Correo electrónico",
          usernamePlaceholder: "tu@ejemplo.com",
          passwordLabel: "Contraseña",
          passwordPlaceholder: "Contraseña",
          loginButton: "Iniciar sesión",
          errorMessage: "Error en el inicio de sesión.",
        },
      },
      overview: {
        projectNotFound: "Proyecto con esta ID para el usuario actual no encontrado.",
        emptyState: {
          title: "Se necesitan datos para mostrar el Índice de Circularidad",
          body: "Para mostrar el Índice de Circularidad, asegúrese de que cada producto de construcción esté completo o sea parte del cálculo. Una vez que se actualice esta información, sus datos se mostrarán aquí.",
          cta: "Actualizar datos del edificio",
        },
        noComponentsState: {
          title: "No se encontraron componentes de construcción relevantes",
          body: "El índice de circularidad se calcula para los componentes de construcción en los grupos de costos: 320, 330, 340, 350 y 360. Por favor, vaya a eLCA y agregue componentes de construcción en uno de estos grupos para comenzar, y asegúrese de que no estén excluidos del cálculo.",
        },
        metricTypeSelectorOptions: {
          circularityIndex: "Índice de circularidad (ZI)",
          eolBuiltPoints: "Potencial de circularidad (Z)",
          dismantlingPoints: "Potencial de disminución (R)",
        },
        title: "Evaluación de la Circularidad",
        moduleTotal: {
          title: "Total",
          label: "total",
          points: "Puntos",
        },
        moduleByCostGroup: {
          title: "Por Grupo de Costos (DIN 276)",
          totalDimensionValue: {
            mass: "Masa Total",
            volume: "Volumen Total",
          },
        },
        moduleByMaterialCategory: {
          title: "Por Categoría de Material",
          totalDimensionValue: {
            mass: "Masa Total",
            volume: "Volumen Total",
          },
        },
        materialExport: {
          exportMaterialsToCsv: "Exportar (csv)",
          fields: {
            componentUuid: "UUID del componente",
            volumePerUnit: "Volumen (m3) por unidad",
            massPerUnit: "Masa (kg) por unidad",
            processName: "Nombre del proceso",
            amount: "Cantidad",
            unit: "Unidad",
            thickness: "Espesor (mm)",
            share: "Proporción (%)",
            componentId: "ID del componente",
            materialCompatibilityClass: "Clase de compatibilidad",
            materialCompatibilityPoints: "Puntos de compatibilidad",
          },
        },
        aggregatedInventoryExport: {
          totalVolumePerMaterial: "Volumen Total (m³) por Material",
          totalMassPerMaterial: "Masa Total (kg) por Material",
          aggregatedInventory: "Inventario Agregado - Potencial de Circularidad",
          tBaustoffAndEolClassColTitle: "tBaustoff / Clase EoL",
          volumeSection: "Potencial de Circularidad, datos de Volumen (m³)",
          massSection: "Potencial de Circularidad, datos de Masa (kg)",
          exportAggregatedInventoryToCsv: "Exportar (csv)",
          totalVolumePerEolClass: "Volumen total (m³) por clase EOL",
          totalMassPerEolClass: "Masa total (kg) por clase EOL",
          percentagePerClass: "Porcentaje total (%) por clase EOL",
          eolClassLabel: "Clase EOL:",
          materialLabel: "Material:",
          total: "Total",
        },
      },
      catalog: {
        back: "Atrás",
        title: "Catálogo",
        complete: "Completo",
        incomplete: "Incompleto",
      },
    },
  },
  Units: {
    Kwh: {
      short: "kwH",
    },
    Kg: {
      short: "kg",
      long: "kilogramo",
    },
    Tons: {
      short: "t",
      long: "toneladas",
    },
    M3: {
      short: "m3",
      long: "Metros cúbicos",
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
    AggregationSelector: {
      byMaterialClass: "Por Clase de Material",
      byComponentCategory: "Por Categoría de Componente",
      total: "Total",
    },
  },
  Footer: {
    links: {
      userTestingGuide: "Guía de Usuario",
      privacyPolicy: "Política de Privacidad",
      imprint: "Aviso legal",
    },
    copyright: "BBSR Todos los derechos reservados.",
  },
  Common: {
    materialClasses: {
      "1": "Productos minerales para la construcción",
      "2": "Materiales aislantes",
      "3": "Madera",
      "4": "Metales",
      "5": "Revestimientos",
      "6": "Plásticos",
      "7": "Componentes para ventanas y muros cortina",
      "8": "Ingeniería de servicios para edificios",
      "9": "Otros",
      "10": "Materiales compuestos",
    },
    costGroups: {
      "300": "Edificio - Obras Estructurales",
      "310": "Excavación",
      "311": "Preparación de Excavación",
      "312": "Cierres de Excavación",
      "313": "Retención de Agua",
      "319": "Excavación, Misceláneo",
      "320": "Fundación",
      "321": "Mejoramiento del Suelo",
      "322": "Cimientos Superficiales",
      "323": "Cimientos Profundos",
      "324": "Subsuelo y Losas del Suelo",
      "325": "Revestimientos de Piso",
      "326": "Impermeabilización Estructural",
      "327": "Drenajes",
      "329": "Fundaciones, Misceláneo",
      "330": "Muros Exteriores",
      "331": "Muros Exteriores Portantes",
      "332": "Muros Exteriores No Portantes",
      "333": "Columnas Exteriores",
      "334": "Puertas y Ventanas Exteriores",
      "335": "Revestimientos de Muros Exteriores, Exteriores",
      "336": "Revestimientos de Muros Exteriores, Interiores",
      "337": "Muros Exteriores Prefabricados",
      "338": "Protección Solar",
      "339": "Muros Exteriores, Misceláneo",
      "340": "Muros Interiores",
      "341": "Muros Interiores Portantes",
      "342": "Muros Interiores No Portantes",
      "343": "Columnas Interiores",
      "344": "Puertas y Ventanas Interiores",
      "345": "Revestimientos de Muros Interiores",
      "346": "Muros Interiores Prefabricados",
      "349": "Muros Interiores, Misceláneo",
      "350": "Techos",
      "351": "Estructura del Techo",
      "352": "Revestimientos del Techo",
      "353": "Forros del Techo",
      "359": "Techos, Misceláneo",
      "360": "Cubiertas",
      "361": "Estructuras del Techo",
      "362": "Ventanas del Techo, Aberturas en el Techo",
      "363": "Revestimientos del Techo",
      "364": "Revestimientos del Techo - Yeso y Forros",
      "369": "Cubiertas, Misceláneo",
      "370": "Instalaciones Estructurales",
      "371": "Instalaciones Generales",
      "372": "Instalaciones Especiales",
      "379": "Instalaciones Estructurales, Misceláneo",
      "390": "Otras Medidas para Obras Estructurales",
      "391": "Montaje del Sitio de Construcción",
      "392": "Andamios",
      "393": "Medidas de Seguridad",
      "394": "Medidas de Demolición",
      "395": "Reparaciones",
      "396": "Eliminación de Materiales",
      "397": "Medidas Adicionales",
      "398": "Estructuras Temporales",
      "399": "Otras Medidas para Obras Estructurales, Misceláneo",
      "500": "Instalaciones Exteriores",
      "510": "Áreas de Terreno",
      "511": "Trabajos de Suelo Superior",
      "512": "Movimiento de Tierras",
      "519": "Áreas de Terreno, Misceláneo",
      "520": "Áreas Pavimentadas",
      "521": "Caminos",
      "522": "Carreteras",
      "523": "Plazas, Patios",
      "524": "Áreas de Estacionamiento",
      "525": "Superficies de Canchas Deportivas",
      "526": "Superficies de Áreas de Juegos",
      "527": "Vías Férreas",
      "529": "Áreas Pavimentadas, Misceláneo",
      "530": "Estructuras en Instalaciones Exteriores",
      "531": "Cierres",
      "532": "Estructuras de Protección",
      "533": "Muros",
      "534": "Rampas, Escaleras, Tribunas",
      "535": "Cubiertas",
      "536": "Puentes, Pasarelas",
      "537": "Instalaciones de Canales y Pozos",
      "538": "Instalaciones de Ingeniería Hidráulica",
      "539": "Estructuras en Instalaciones Exteriores, Misceláneo",
      "540": "Instalaciones Técnicas en Instalaciones Exteriores",
      "541": "Instalaciones de Aguas Residuales",
      "542": "Instalaciones de Agua",
      "543": "Instalaciones de Gas",
      "544": "Instalaciones de Suministro de Calor",
      "545": "Sistemas de Aire Acondicionado",
      "546": "Instalaciones de Alta Tensión",
      "547": "Sistemas de Telecomunicaciones e Información",
      "548": "Instalaciones de Uso Específico",
      "549": "Instalaciones Técnicas en Instalaciones Exteriores, Misceláneo",
      "550": "Instalaciones en Instalaciones Exteriores",
      "551": "Instalaciones Generales",
      "552": "Instalaciones Especiales",
      "559": "Instalaciones en Instalaciones Exteriores, Misceláneo",
      "560": "Superficies de Agua",
      "561": "Impermeabilización",
      "562": "Plantas",
      "569": "Superficies de Agua, Misceláneo",
      "570": "Áreas de Plantación y Siembra",
      "571": "Trabajos de Suelo Superior",
      "572": "Cultivo del Suelo Vegetativo",
      "573": "Métodos de Construcción Protectora",
      "574": "Plantas",
      "575": "Césped y Siembra",
      "576": "Verdeado de Áreas Subterráneas",
      "579": "Áreas de Plantación y Siembra, Misceláneo",
      "590": "Otras Instalaciones Exteriores",
      "591": "Montaje del Sitio de Construcción",
      "592": "Andamios",
      "593": "Medidas de Seguridad",
      "594": "Medidas de Demolición",
      "595": "Reparaciones",
      "596": "Eliminación de Materiales",
      "597": "Medidas Adicionales",
      "598": "Instalaciones Exteriores Temporales",
      "599": "Otras Medidas para Instalaciones Exteriores, Misceláneo",
    },
  },
  errors: {
    unauthorized: "No autorizado",
    unauthenticated: "No autenticado",
    db: "Error de base de datos",
    unknown: "Error desconocido",
    validation: "Error de validación",
  },
}

export default translationsPlattformGeneric
