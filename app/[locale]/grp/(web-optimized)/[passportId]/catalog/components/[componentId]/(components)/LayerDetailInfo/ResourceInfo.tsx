import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import SingleValueDisplay from "app/(components)/generic/SingleValueDisplay"
import { Ressources } from "domain-logic/grp/data-schema/versions/v1/passportSchema"

const ResourceInfo = ({ resources }: { resources: Ressources }) => {
  // TODO: move this into domain logic
  // TODO: also consider to iterate over all enum values of MaterialResourceTypeNamesSchema.Enum and sum them up dynamically
  const rmiTotal = Math.round(
    (resources?.rawMaterials.Mineral || 0) +
      (resources?.rawMaterials.Metallic || 0) +
      (resources?.rawMaterials.Fossil || 0) +
      (resources?.rawMaterials.Agrar || 0) +
      (resources?.rawMaterials.Aqua || 0) +
      (resources?.rawMaterials.Forestry || 0)
  )

  const resourceInfoKeyValues = [
    { key: "RMI gesamt [kg]", value: rmiTotal },
    { key: "RMI mineralisch [kg]", value: resources?.rawMaterials.Mineral.toFixed(2) },
    { key: "RMI metallisch [kg]", value: resources?.rawMaterials.Metallic.toFixed(2) },
    { key: "RMI fossil [kg]", values: resources?.rawMaterials.Fossil.toFixed(2) },
    { key: "RMI forstwirtschaftlich [kg]", value: resources?.rawMaterials.Forestry.toFixed(2) },
    { key: "RMI agrarisch [kg]", value: resources?.rawMaterials.Agrar.toFixed(2) },
    { key: "RMI aquatisch [kg]", value: resources?.rawMaterials.Aqua.toFixed(2) },
  ]

  // TODO: these kind of aggregation logic NEEDS to go into a central aggregation / domain logic block (code organization wise)
  // TODO: also, it should ideally implemented in a way that is ensuring that - even if we add a new key to embodiedEnergy - we don't forget to add it to the aggregation (e.g. iterating over all keys and doing the summing dynamically)
  const qpABC =
    resources.embodiedEnergy.A1A2A3 +
    resources?.embodiedEnergy.B1 +
    resources?.embodiedEnergy.B4 +
    resources?.embodiedEnergy.B6 +
    resources?.embodiedEnergy.C3 +
    resources?.embodiedEnergy.C4

  const gwpABC =
    resources.embodiedEmissions.A1A2A3 +
    resources?.embodiedEmissions.B1 +
    resources?.embodiedEmissions.B4 +
    resources?.embodiedEmissions.B6 +
    resources?.embodiedEmissions.C3 +
    resources?.embodiedEmissions.C4

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
