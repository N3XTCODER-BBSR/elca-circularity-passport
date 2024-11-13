import {
  LifeCycleSubPhaseId,
  MaterialResourceTypeNamesSchema,
} from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

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
    module1Materials: {
      moduleTitle: "Modul 1",
      moduleSubtitle: "Materialien",
      chartTitle: "Masse",
      navigationSections: {
        byMaterialClass: "Nach Baustoffgruppen",
        byComponentCategory: "Nach Bauteilkategorien",
      },
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
          title: "Primärenergie nicht-erneuerbar (PENRT)",
          labels: {
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kwH",
          },
          grayEnergyTotal: "Graue Energie, total",
          grayEnergyTotalPdf: "Grau Energie",
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
            overlay: "{percentageValue, number, percentage} / {aggregatedValue, number, integer} kg Co2eq",
          },
          grayEmissionsTotal: "Graue Emissionen, total",
          grayEmissionsTotalPdf: "Graue Emissionen",
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
      moduleTitle: "Modul 3",
      moduleSubTitle: "Zirkularität",
      eol: {
        title: "EoL Klasse",
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
      back: "Zurück",
      componentName: "Komponenten-Name",
      uuid: "UUID",
      costGroup: "Kostengruppe DIN276",
    },
    componentLayer: {
      sequenceNumber: "Laufende Nummer",
      mass: "Masse",
      materialGeometry: "Geometrie der Bauteilschichten/ Komponenten",
      material: {
        materialDescription: "Material-Beschreibung",
        materialClassId: "UUID Materialgruppe",
        materialClassDescription: "Materialgruppenbezeichnung",
        uuidMaterial: "UUID Material",
        materialDatabase: "Baustoffdatenbank",
        serviceLife: "Nutzungsdauer",
        lbPerformanceRange: "Leistungsbereich (LB)",
        lvNumber: "Leistungsverzeichnis (LV) nr.",
        itemInLv: "Position im LV",
        area: "Fläche",
        technicalServiceLife: "Technische Lebensdauer",
        uuidProduct: "UUID Produkt",
        productDescription: "Produktbezeichnung",
        manufacturerName: "Herstellername",
        proofDocument: "Nachweisdokument",
        versionNumberServiceLife: "Versionsnummer Nutzungsdauer-Tabelle",
        oekobaudatVersion: "Ökobaudat-Version",
      },
      resources: {
        rawMaterials: "Rohstoffe",
        primaryEnergy: "Primärenergie-Aufwand (nicht erneuerbar, gesamt)",
        carbonContent: "Anteil des gebundenen Kohlenstoffs",
        recyclingContent: "Anteil Sekundärmaterial",
        globalWarmingPotential: "Treibhaus-Potenzial (gesamt)",
        [MaterialResourceTypeNamesSchema.Enum.Forestry]: "Forst",
        [MaterialResourceTypeNamesSchema.Enum.Aqua]: "Wasser",
        [MaterialResourceTypeNamesSchema.Enum.Agrar]: "Agrar",
        [MaterialResourceTypeNamesSchema.Enum.Fossil]: "Fossil",
        [MaterialResourceTypeNamesSchema.Enum.Metallic]: "Metallisch",
        [MaterialResourceTypeNamesSchema.Enum.Mineral]: "Mineralisch",
        total: "gesamt",
      },
      circularity: {
        general: "Allgemein",
        materialCompatibility: "Materialverträglichkeit - Störstoffe",
        eolClass: "Klasse EOL",
        eolPoints: "Punkte EOL",
        proofReuse: "Nachweis Wiederverwendung",
        version: "Version",
        category: "Kategorie",
      },
    },
    tabBar: {
      material: "Material",
      resources: "Ressourcen",
      circularity: "Zirkularität",
    },
  },
}

const translationsPlattformGeneric = {
  Circularity: {
    Components: {
      Layers: {
        CircularityInfo: {
          title: "Zirkularität",
          CircularityPotential: {
            title: "Zirkularitätspotenzial",
            EolUnbuilt: {
              Class: {
                title: "EoL (unverbaut) Klasse",
              },
              Points: {
                title: "EoL (unverbaut) Punkte",
              },
            },
          },
        },
      },
    },
  },
  Grp: {
    Web: {
      title: "Ressourcenpass für Gebäude",
      description:
        "Das BBSR (Bundesinstitut für Bau-, Stadt-und Raumforschung, Referat WB6 Bauen und Umwelt) stellt dieses Tool kostenlos zur Verfügung.",
      project: "Projekt",
      exportPdf: "PDF Exportieren",
      NavBar: {
        overview: "Überblick",
        catalog: "Katalog",
      },
      sections: {
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
      signin: {
        title: "eLCA Zirkularitätsindex",
        subTitle: {
          a: "Anmeldung mit Ihren ",
          b: "eLCA",
          c: "-Zugangsdaten",
        },
        form: {
          usernameLabel: "Email",
          usernamePlaceholder: "you@example.com",
          passwordLabel: "Passwort",
          passwordPlaceholder: "Passwort",
          loginButton: "Einloggen",
          errorMessage: "Login fehlgeschlagen.",
        },
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
  GenericComponents: {
    TotalAndNrfRelativeValuesDisplay: {
      total: "gesamt",
      areaRelated: "Flächenbezogen",
    },
    AggregationSelector: {
      byMaterialClass: "Nach Baustoffgruppen",
      byComponentCategory: "Nach Bauteilkategorien",
      total: "Gesamt",
    },
  },
  Common: {
    materialClasses: {
      "1_1_01": "Mineralische Bauprodukte",
      "4_3_01": "Metalle",
      "2_4_01": "Isoliermaterialien",
      "3_2_01": "Holz",
      "5_1_01": "Abdeckungen",
      "7_2_01": "Komponenten für Fenster und Vorhangfassaden",
      "8_1_01": "Gebäudetechnik",
    },
    costGroups: {
      "300": "Bauwerk - Baukonstruktionen",
      "310": "Baugrube",
      "311": "Baugrubenherstellung",
      "312": "Baugrubenumschließung",
      "313": "Wasserhaltung",
      "319": "Baugrube, Sonstiges",
      "320": "Gründung",
      "321": "Baugrundverbesserung",
      "322": "Flachgründungen",
      "323": "Tiefgründungen",
      "324": "Unterböden und Bodenplatten",
      "325": "Bodenbeläge",
      "326": "Bauwerksabdichtungen",
      "327": "Drainagen",
      "329": "Gründungen, Sonstiges",
      "330": "Außenwände",
      "331": "Tragende Außenwände",
      "332": "Nichttragende Außenwände",
      "333": "Außenstützen",
      "334": "Außentüren und -fenster",
      "335": "Außenwandbekleidungen außen",
      "336": "Außenwandbekleidungen innen",
      "337": "Elementierte Außenwände",
      "338": "Sonnenschutz",
      "339": "Außenwände, Sonstiges",
      "340": "Innenwände",
      "341": "Tragende Innenwände",
      "342": "Nichttragende Innenwände",
      "343": "Innenstützen",
      "344": "Innentüren und -fenster",
      "345": "Innenwandbekleidungen",
      "346": "Elementierte Innenwände",
      "349": "Innenwände, Sonstiges",
      "350": "Decken",
      "351": "Deckenkonstruktion",
      "352": "Deckenbeläge",
      "353": "Deckenbekleidungen",
      "359": "Decken, Sonstiges",
      "360": "Dächer",
      "361": "Dachkonstruktionen",
      "362": "Dachfenster, Dachöffnungen",
      "363": "Dachbeläge",
      "364": "Dachbekleidungen - Putz und Bekleidungen",
      "369": "Dächer, Sonstiges",
      "370": "Baukonstruktive Einbauten",
      "371": "Allgemeine Einbauten",
      "372": "Besondere Einbauten",
      "379": "Baukonstruktive Einbauten, Sonstiges",
      "390": "Sonstige Maßnahmen für Baukonstruktionen",
      "391": "Baustelleneinrichtung",
      "392": "Gerüste",
      "393": "Sicherungsmaßnahmen",
      "394": "Abbruchmaßnahmen",
      "395": "Instandsetzungen",
      "396": "Materialentsorgung",
      "397": "Zusätzliche Maßnahmen",
      "398": "Provisorische Baukonstruktionen",
      "399": "Sonstige Maßnahmen für Baukonstruktionen, Sonstiges",
      "500": "Außenanlagen",
      "510": "Geländeflächen",
      "511": "Oberbodenarbeiten",
      "512": "Bodenarbeiten",
      "519": "Geländeflächen, sonstiges",
      "520": "Befestigte Flächen",
      "521": "Wege",
      "522": "Straßen",
      "523": "Plätze, Höfe",
      "524": "Stellplätze",
      "525": "Sportplatzflächen",
      "526": "Spielplatzflächen",
      "527": "Gleisanlagen",
      "529": "Befestigte Flächen, sonstiges",
      "530": "Baukonstruktionen in Außenanlagen",
      "531": "Einfriedungen",
      "532": "Schutzkonstruktionen",
      "533": "Mauern, Wände",
      "534": "Rampen, Treppen, Tribünen",
      "535": "Überdachungen",
      "536": "Brücken, Stege",
      "537": "Kanal- und Schachtbauanlagen",
      "538": "Wasserbauliche Anlagen",
      "539": "Baukonstruktionen in Außenanlagen, sonstiges",
      "540": "Technische Anlagen in Außenanlagen",
      "541": "Abwasseranlagen",
      "542": "Wasseranlagen",
      "543": "Gasanlagen",
      "544": "Wärmeversorgungsanlagen",
      "545": "Lufttechnische Anlagen",
      "546": "Starkstromanlagen",
      "547": "Fernmelde- und informationstechnische Anlagen",
      "548": "Nutzungsspezifische Anlagen",
      "549": "Technische Anlagen in Außenanlagen, sonstiges",
      "550": "Einbauten in Außenanlagen",
      "551": "Allgemeine Einbauten",
      "552": "Besondere Einbauten",
      "559": "Einbauten in Außenanlagen, sonstiges",
      "560": "Wasserflächen",
      "561": "Abdichtungen",
      "562": "Bepflanzungen",
      "569": "Wasserflächen, sonstiges",
      "570": "Pflanz- und Saatflächen",
      "571": "Oberbodenarbeiten",
      "572": "Vegetationstechnische Bodenbearbeitung",
      "573": "Sicherungsbauweisen",
      "574": "Pflanzen",
      "575": "Rasen und Ansaaten",
      "576": "Begrünung unterbauter Flächen",
      "579": "Pflanz- und Saatflächen, sonstiges",
      "590": "Sonstige Außenanlagen",
      "591": "Baustelleneinrichtung",
      "592": "Gerüste",
      "593": "Sicherungsmaßnahmen",
      "594": "Abbruchmaßnahmen",
      "595": "Instandsetzungen",
      "596": "Materialentsorgung",
      "597": "Zusätzliche Maßnahmen",
      "598": "Provisorische Außenanlagen",
      "599": "Sonstige Maßnahmen für Außenanlagen, sonstiges",
    },
  },
}

export default translationsPlattformGeneric

export type TranslationsPlattformGeneric = typeof translationsPlattformGeneric
