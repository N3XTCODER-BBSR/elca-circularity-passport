import _ from "lodash"

const translationsGrpPlattformGeneric = {
  overview: {
    module2Resources: {
      rmi: {
        categories: {
          renewable: "Erneuerbar",
          nonRenewable: "Nicht-erneuerbar",
        },
        names: {
          rmiForestry: "Forst",
          rmiAqua: "Wasser",
          rmiAgrar: "Agrar",
          rmiFossil: "Fossil",
          rmiMetallic: "Metallisch",
          rmiMineral: "Mineralisch",
        },
        labels: {
          overlay: "{aggregatedValue, number, integer} Tonnen - {percentageValue, number, percentage}",
        },
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
    },
  },
}

const mergedTranslations = _.merge({}, translationsWebSpecific, translationsPlattformGeneric)

export default mergedTranslations
