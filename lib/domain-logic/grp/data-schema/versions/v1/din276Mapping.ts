export type ComponentType = {
  number: number
  name: string
}

export type ComponentCategory = {
  number: number
  name: string
  children: ComponentType[]
}

export type ComponentGroup = {
  number: number
  name: string
  children: ComponentCategory[]
}

export type Din276Hierarchy = ComponentGroup[]

export const costGroupCategoryNumbersToInclude = [320, 330, 340, 350, 360]

export const costGroupyDinNumbersToInclude = // for each entry in costGroupCategoryNumbersToInclude: all numbers for the decimal-range
  // e.g. for 320: 321, 322, 323, 324, 325, 326, 327, 329
  costGroupCategoryNumbersToInclude.flatMap((categoryNumber) => {
    const categoryNumberAsString = categoryNumber.toString()
    const decimalRange = categoryNumberAsString.slice(0, -1)
    return Array.from({ length: 10 }, (_, i) => parseInt(`${decimalRange}${i}`))
  })

// TODO (i18n): Use use i18n here!
export const din276Hierarchy: Din276Hierarchy = [
  {
    number: 300,
    name: "Bauwerk - Baukonstruktionen",
    children: [
      {
        number: 310,
        name: "Baugrube",
        children: [
          { number: 311, name: "Baugrubenherstellung" },
          { number: 312, name: "Baugrubenumschließung" },
          { number: 313, name: "Wasserhaltung" },
          { number: 319, name: "Baugrube, Sonstiges" },
        ],
      },
      {
        number: 320,
        name: "Gründung",
        children: [
          { number: 321, name: "Baugrundverbesserung" },
          { number: 322, name: "Flachgründungen" },
          { number: 323, name: "Tiefgründungen" },
          { number: 324, name: "Unterböden und Bodenplatten" },
          { number: 325, name: "Bodenbeläge" },
          { number: 326, name: "Bauwerksabdichtungen" },
          { number: 327, name: "Drainagen" },
          { number: 329, name: "Gründungen, Sonstiges" },
        ],
      },
      {
        number: 330,
        name: "Außenwände",
        children: [
          { number: 331, name: "Tragende Außenwände" },
          { number: 332, name: "Nichttragende Außenwände" },
          { number: 333, name: "Außenstützen" },
          { number: 334, name: "Außentüren und -fenster" },
          { number: 335, name: "Außenwandbekleidungen außen" },
          { number: 336, name: "Außenwandbekleidungen innen" },
          { number: 337, name: "Elementierte Außenwände" },
          { number: 338, name: "Sonnenschutz" },
          { number: 339, name: "Außenwände, Sonstiges" },
        ],
      },
      {
        number: 340,
        name: "Innenwände",
        children: [
          { number: 341, name: "Tragende Innenwände" },
          { number: 342, name: "Nichttragende Innenwände" },
          { number: 343, name: "Innenstützen" },
          { number: 344, name: "Innentüren und -fenster" },
          { number: 345, name: "Innenwandbekleidungen" },
          { number: 346, name: "Elementierte Innenwände" },
          { number: 349, name: "Innenwände, Sonstiges" },
        ],
      },
      {
        number: 350,
        name: "Decken",
        children: [
          { number: 351, name: "Deckenkonstruktion" },
          { number: 352, name: "Deckenbeläge" },
          { number: 353, name: "Deckenbekleidungen" },
          { number: 359, name: "Decken, Sonstiges" },
        ],
      },
      {
        number: 360,
        name: "Dächer",
        children: [
          { number: 361, name: "Dachkonstruktionen" },
          { number: 362, name: "Dachfenster, Dachöffnungen" },
          { number: 363, name: "Dachbeläge" },
          { number: 364, name: "Dachbekleidungen - Putz und Bekleidungen" },
          { number: 369, name: "Dächer, Sonstiges" },
        ],
      },
      {
        number: 370,
        name: "Baukonstruktive Einbauten",
        children: [
          { number: 371, name: "Allgemeine Einbauten" },
          { number: 372, name: "Besondere Einbauten" },
          { number: 379, name: "Baukonstruktive Einbauten, Sonstiges" },
        ],
      },
      {
        number: 390,
        name: "Sonstige Maßnahmen für Baukonstruktionen",
        children: [
          { number: 391, name: "Baustelleneinrichtung" },
          { number: 392, name: "Gerüste" },
          { number: 393, name: "Sicherungsmaßnahmen" },
          { number: 394, name: "Abbruchmaßnahmen" },
          { number: 395, name: "Instandsetzungen" },
          { number: 396, name: "Materialentsorgung" },
          { number: 397, name: "Zusätzliche Maßnahmen" },
          { number: 398, name: "Provisorische Baukonstruktionen" },
          { number: 399, name: "Sonstige Maßnahmen für Baukonstruktionen, Sonstiges" },
        ],
      },
    ],
  },
  {
    number: 500,
    name: "Außenanlagen",
    children: [
      {
        number: 510,
        name: "Geländeflächen",
        children: [
          { number: 511, name: "Oberbodenarbeiten" },
          { number: 512, name: "Bodenarbeiten" },
          { number: 519, name: "Geländeflächen, sonstiges" },
        ],
      },
      {
        number: 520,
        name: "Befestigte Flächen",
        children: [
          { number: 521, name: "Wege" },
          { number: 522, name: "Straßen" },
          { number: 523, name: "Plätze, Höfe" },
          { number: 524, name: "Stellplätze" },
          { number: 525, name: "Sportplatzflächen" },
          { number: 526, name: "Spielplatzflächen" },
          { number: 527, name: "Gleisanlagen" },
          { number: 529, name: "Befestigte Flächen, sonstiges" },
        ],
      },
      {
        number: 530,
        name: "Baukonstruktionen in Außenanlagen",
        children: [
          { number: 531, name: "Einfriedungen" },
          { number: 532, name: "Schutzkonstruktionen" },
          { number: 533, name: "Mauern, Wände" },
          { number: 534, name: "Rampen, Treppen, Tribünen" },
          { number: 535, name: "Überdachungen" },
          { number: 536, name: "Brücken, Stege" },
          { number: 537, name: "Kanal- und Schachtbauanlagen" },
          { number: 538, name: "Wasserbauliche Anlagen" },
          { number: 539, name: "Baukonstruktionen in Außenanlagen, sonstiges" },
        ],
      },
      {
        number: 540,
        name: "Technische Anlagen in Außenanlagen",
        children: [
          { number: 541, name: "Abwasseranlagen" },
          { number: 542, name: "Wasseranlagen" },
          { number: 543, name: "Gasanlagen" },
          { number: 544, name: "Wärmeversorgungsanlagen" },
          { number: 545, name: "Lufttechnische Anlagen" },
          { number: 546, name: "Starkstromanlagen" },
          { number: 547, name: "Fernmelde- und informationstechnische Anlagen" },
          { number: 548, name: "Nutzungsspezifische Anlagen" },
          { number: 549, name: "Technische Anlagen in Außenanlagen, sonstiges" },
        ],
      },
      {
        number: 550,
        name: "Einbauten in Außenanlagen",
        children: [
          { number: 551, name: "Allgemeine Einbauten" },
          { number: 552, name: "Besondere Einbauten" },
          { number: 559, name: "Einbauten in Außenanlagen, sonstiges" },
        ],
      },
      {
        number: 560,
        name: "Wasserflächen",
        children: [
          { number: 561, name: "Abdichtungen" },
          { number: 562, name: "Bepflanzungen" },
          { number: 569, name: "Wasserflächen, sonstiges" },
        ],
      },
      {
        number: 570,
        name: "Pflanz- und Saatflächen",
        children: [
          { number: 571, name: "Oberbodenarbeiten" },
          { number: 572, name: "Vegetationstechnische Bodenbearbeitung" },
          { number: 573, name: "Sicherungsbauweisen" },
          { number: 574, name: "Pflanzen" },
          { number: 575, name: "Rasen und Ansaaten" },
          { number: 576, name: "Begrünung unterbauter Flächen" },
          { number: 579, name: "Pflanz- und Saatflächen, sonstiges" },
        ],
      },
      {
        number: 590,
        name: "Sonstige Außenanlagen",
        children: [
          { number: 591, name: "Baustelleneinrichtung" },
          { number: 592, name: "Gerüste" },
          { number: 593, name: "Sicherungsmaßnahmen" },
          { number: 594, name: "Abbruchmaßnahmen" },
          { number: 595, name: "Instandsetzungen" },
          { number: 596, name: "Materialentsorgung" },
          { number: 597, name: "Zusätzliche Maßnahmen" },
          { number: 598, name: "Provisorische Außenanlagen" },
          { number: 599, name: "Sonstige Maßnahmen für Außenanlagen, sonstiges" },
        ],
      },
    ],
  },
]
