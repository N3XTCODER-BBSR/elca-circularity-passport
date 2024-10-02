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
    buildingBaseInformation: {
      title: "Gebaude-Informationen",
      buildingId: "Gebäude/Bauwerk-ID",
      coordinates: "Koordinaten",
      address: "Adresse",
      yearOfBuildingPermit: "Jahr der Baugenehmigung",
      yearOfCompletion: "Jahr der Baufertigstellung",
      numberOfAboveGroundFloors: "Anzahl der Obergeschosse",
      numberOfUndergroundFloors: "Anzahl der Untergeschosse",
      netFloorArea: {
        label: "Netto-Raumfläche",
        abbreviation: "NRF",
        description: {
          intro:
            "Unter Netto-Raumfläche (NRF) versteht man die Summe der nutzbaren Grundflächen eines Gebäudes. Zur Berechnung wird sie gemäß nebenstehender Tabelle nochmals in Nutzungsgruppen unterteilt in:",
          point1: "die Nutzungsfläche (NUF) als zum sinngemäßen Gebrauch eines Gebäudes effektiv nutzbare Grundfläche",
          point2:
            "die Technikfläche (TF), die der zur Unterbringung von zentralen haustechnischen Anlagen dient (z. B. Heizung, Maschinenraum für den Aufzug, Raum für Betrieb von Klimaanlagen)",
          point3:
            "die Verkehrsfläche (VF), die dem Zugang zu den Räumen, dem Verkehr innerhalb von Gebäuden oder zum Verlassen im Notfall dient.",
        },
      },
      grossFloorArea: {
        label: "Brutto-Grundfläche",
        abbreviation: "BGF",
        description:
          "Brutto-Grundfläche (BGF) bezeichnet diejenige Fläche, die sich aus der Summe aller Grundflächen aller Grundrissebenen eines Gebäudes errechnet. Sie ist geschossweise zu ermitteln.",
      },
      grossVolume: {
        label: "Brutto-Rauminhalt",
        abbreviation: "BRI",
        description:
          "Der Brutto-Rauminhalt (von Gebäuden) ist nach DIN 277-1 (Stand Januar 2016) der Rauminhalt eines Baukörpers, begrenzt durch die äußeren Begrenzungsflächen des Bauwerkes, gebildet von der Unterfläche der konstruktiven Bauwerkssohle (Unterseite der Unterböden und Bodenplatten, die nicht der Fundamentierung dienen), den Außenkanten der Außenwände und der Oberfläche der Dachbeläge, einschließlich Dachgauben oder Dachoberlichter.",
      },
      plotArea: "Grundstücksfläche",
      totalBuildingMass: "Gesamtmasse des Gebäudes",
    },
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
