import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import _ from "lodash"

const lifeCycleSubPhases: Record<LifeCycleSubPhaseId, string> = {
  A1A2A3: "Modul A1 - A3",
  B1: "Modul B1",
  B4: "Modul B4",
  B6: "Modul B6",
  C3: "Modul C3",
  C4: "Modul C4",
}

const translationsGrpPlattformGeneric = {
  overview: {
    module2Resources: {
      moduleTitle: "Modul 2",
      moduleSubTitle: "Resourcen",
      rmi: {
        title: "Ressourcen (RMI)",
        categories: {
          renewable: "Erneuerbar",
          nonRenewable: "Nicht-erneuerbar",
        },
        names: {
          [MaterialResourceTypeNamesSchema.Enum.Forestry]: "Forst",
          [MaterialResourceTypeNamesSchema.Enum.Aqua]: "Wasser",
          [MaterialResourceTypeNamesSchema.Enum.Agrar]: "Agrar",
          [MaterialResourceTypeNamesSchema.Enum.Fossil]: "Fossil",
          [MaterialResourceTypeNamesSchema.Enum.Metallic]: "Metallisch",
          [MaterialResourceTypeNamesSchema.Enum.Mineral]: "Mineralisch",
        },
        labels: {
          overlay: "{aggregatedValue, number, integer} Tonnen - {percentageValue, number, percentage}",
        },
      },
      gwpAndPenrt: {
        penrt: {
          title: "Primärenergie nicht-erneuerbar (PENRT)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kwH",
          },
        },
        gwp: {
          title: "Global Warming Potential (GWP)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kg Co2eq",
          },
        },
        lifeCycleSubPhases,
      },
    },
  },
}

const translationsPlattformGeneric = {
  Grp: {
    Web: {
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
      long: "Tonnen",
    },
    KgCo2Eq: {
      short: "kg Co2eq",
    },
  },
}

const translationsWebSpecific = {
  Grp: {
    Web: {
      title: "Ressourcenpass für Gebäude",
      description:
        "Das BBSR (Bundesinstitut für Bau-, Stadt-und Raumforschung, Referat WB6 Bauen und Umwelt) stellt dieses Tool kostenlos zur Verfügung.",
      NavBar: {
        overview: "Überblick",
        catalog: "Katalog",
      },
      sections: {
        overview: {
          module1Materials: {
            title: "Modul 1",
            subtitle: "Materialien",
            chartTitle: "Masse",
            navigationSections: {
              byMaterialClass: "Nach Baustoffgruppen",
              byComponentCategory: "Nach Bauteilkategorien",
            },
          },
          module2Resources: {
            gwpAndPenrt: {
              penrt: {
                grayEnergyTotal: "Graue Emissionen, total",
              },
              gwp: {
                grayEmissionsTotal: "Graue Energie, total",
              },
            },
          },
        },
      },
    },
  },
}

const translationsPdfSpecific = {
  Grp: {
    Pdf: {
      sections: {
        overview: {
          module2Resources: {
            gwpAndPenrt: {
              penrt: {
                grayEnergyTotal: "Graue Energie",
              },
              gwp: {
                grayEmissionsTotal: "Graue Emissionen",
              },
            },
          },
        },
      },
    },
  },
}

const mergedTranslations = _.merge({}, translationsWebSpecific, translationsPdfSpecific, translationsPlattformGeneric)
export default mergedTranslations
