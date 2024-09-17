const grpPlattformGeneric = {
  overview: {
    module2Resources: {
      rmiCategories: {
        renewable: "Erneuerbar",
        nonRenewable: "Nicht-erneuerbar",
      },
      rmiNames: {
        forestry: "Forst",
        water: "Wasser",
        agrar: "Agrar",
        fossil: "Fossil",
        metallic: "Metallisch",
        mineral: "Mineralisch",
      },
    },
  },
}

export default {
  Grp: {
    Web: {
      title: "Ressourcenpass für Gebäude",
      description:
        "Das BBSR (Bundesinstitut für Bau-, Stadt-und Raumforschung, Referat WB6 Bauen und Umwelt) stellt dieses Tool kostenlos zur Verfügung.",
      sections: {
        overview: grpPlattformGeneric.overview,
      },
      NavBar: {
        overview: "Überblick",
        catalog: "Katalog",
      },
    },
  },
}
