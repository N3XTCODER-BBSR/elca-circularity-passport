import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/(generic)/SideBySideDescriptionListsWithHeadline"
import SingleValueDisplay from "app/(components)/(generic)/SingleValueDisplay"
import { Ressources } from "app/(utils)/data-schema/versions/v1/passportSchema"

const ResourceInfo = ({ resources }: { resources: Ressources }) => {
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

  // TODO: these kind of aggregation logic NEEDS to go into a central aggregation / domain logic block (code organization wise)
  // TODO: also, it should ideally implemented in a way that is ensuring that - even if we add a new key to embodiedEnergy - we don't forget to add it to the aggregation (e.g. iterating over all keys and doing the summing dynamically)
  const qpABC =
    resources.embodiedEnergy.penrtA1A2A3 +
    resources?.embodiedEnergy.penrtB1 +
    resources?.embodiedEnergy.penrtB4 +
    resources?.embodiedEnergy.penrtB6 +
    resources?.embodiedEnergy.penrtC3 +
    resources?.embodiedEnergy.penrtC4

  const gwpABC =
    resources.embodiedEmissions.gwpA1A2A3 +
    resources?.embodiedEmissions.gwpB1 +
    resources?.embodiedEmissions.gwpB4 +
    resources?.embodiedEmissions.gwpB6 +
    resources?.embodiedEmissions.gwpC3 +
    resources?.embodiedEmissions.gwpC4

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline="Raw Materials" data={resourceInfoKeyValues} />
      <SingleValueDisplay
        headline="Primärenergie-Aufwand (nicht erneuerbar, gesamt)"
        label="kWh"
        value={Math.floor(qpABC || 0)}
      />
      <SingleValueDisplay headline="Treibhaus-Potenzial (gesamt)" label="kg co2eq" value={Math.floor(gwpABC || 0)} />
      <SingleValueDisplay
        headline="Anteil des gebundenen Kohlenstoffs "
        label="kg"
        value={Math.floor(resources?.carbonContent || 0)}
      />
      <SingleValueDisplay
        headline="Anteil Sekundärmaterial"
        label="kg"
        value={Math.floor(resources?.recyclingContent || 0)}
      />
    </div>
  )
}

export default ResourceInfo
