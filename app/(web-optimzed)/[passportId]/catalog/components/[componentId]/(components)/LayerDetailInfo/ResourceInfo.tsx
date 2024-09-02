import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/(generic)/SideBySideDescriptionListsWithHeadline"
import SingleValueDisplay from "app/(components)/(generic)/SingleValueDisplay"
import { Ressources } from "app/(utils)/data-schema/versions/v1/passportSchema"

const ResourceInfo = ({ resources }: { resources?: Ressources }) => {
  const rmiTotal = Math.round(
    (resources?.rawMaterials.rmiMineral || 0) +
      (resources?.rawMaterials.rmiMetallic || 0) +
      (resources?.rawMaterials.rmiFossil || 0) +
      (resources?.rawMaterials.rmiAgrar || 0) +
      (resources?.rawMaterials.rmiAqua || 0) +
      (resources?.rawMaterials.rmiForestry || 0)
  )

  const resourceInfoKeyValues = [
    { key: "RMI gesamt [kg]", value: rmiTotal },
    { key: "RMI mineralisch [kg]", value: resources?.rawMaterials.rmiMineral.toFixed(2) },
    { key: "RMI metallisch [kg]", value: resources?.rawMaterials.rmiMetallic.toFixed(2) },
    { key: "RMI fossil [kg]", values: resources?.rawMaterials.rmiFossil.toFixed(2) },
    { key: "RMI forstwirtschaftlich [kg]", value: resources?.rawMaterials.rmiForestry.toFixed(2) },
    { key: "RMI agrarisch [kg]", value: resources?.rawMaterials.rmiAgrar.toFixed(2) },
    { key: "RMI aquatisch [kg]", value: resources?.rawMaterials.rmiAqua.toFixed(2) },
  ]

  const sustainableForestryKeyValues: KeyValueTuple[] = [
    {
      key: "BNB 1.1.7/QNG Anlage 3 Erfüllt?",
      value:
        resources?.sustainableForestry?.bnb117qng313Fulfilled != null
          ? resources?.sustainableForestry?.bnb117qng313Fulfilled
            ? "Ja"
            : "Nein"
          : "N/A",
    },
    {
      key: "FSC/PeFC-Holzanteil [m %]",
      value: resources?.sustainableForestry?.fscPefcWoodContentInMPercent
        ? `${resources?.sustainableForestry?.fscPefcWoodContentInMPercent?.toFixed(2)}%`
        : "N/A",
    },
  ]
  const sustainableBuildingIndustryKeyValues: KeyValueTuple[] = [
    {
      key: "QNG Anlage 3 Erfüllt?",
      value:
        resources?.sustainableBuildingIndustry?.qng313Fulfilled != null
          ? resources?.sustainableBuildingIndustry?.qng313Fulfilled
            ? "Ja"
            : "Nein"
          : "N/A",
    },
    {
      key: " Recyclinganteil [m %]",
      value:
        resources?.sustainableBuildingIndustry?.recycledContentInMPercent != null
          ? `${resources?.sustainableBuildingIndustry?.recycledContentInMPercent?.toFixed(2)}%`
          : "N/A",
    },
  ]

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline="Raw Materials" data={resourceInfoKeyValues} />
      <SingleValueDisplay
        headline="Graue Energie"
        label="PENRT aus Modul A, B6, C [kWh]"
        value={Math.floor(resources?.embodiedEnergy.penrtAB6C || 0)}
      />
      <SingleValueDisplay
        headline="Graue Emmision"
        label="GWP aus Modul A, B6, C [kg CO2 eq]"
        value={Math.floor(resources?.embodiedEmissions.gwpAB6C || 0)}
      />
      <SingleValueDisplay
        headline="Anteil des gebundenen Kohlenstoffs "
        label="Anteil des gebundenen Kohlenstoffs  [kg]"
        value={Math.floor(resources?.carbonContent.carbonContent || 0)}
      />
      <SingleValueDisplay
        headline="Anteil Sekundärmaterial"
        label="Anteil Sekundärmaterial  [kg]"
        value={Math.floor(resources?.recylingContent.recyclingContent || 0)}
      />
      <SideBySideDescriptionListsWithHeadline
        headline="Nachhaltiger Forstwirtschaft"
        data={sustainableForestryKeyValues}
      />
      <SideBySideDescriptionListsWithHeadline
        headline="Nachhaltige Bauwirtschaft"
        data={sustainableBuildingIndustryKeyValues}
      />
    </div>
  )
}

export default ResourceInfo
