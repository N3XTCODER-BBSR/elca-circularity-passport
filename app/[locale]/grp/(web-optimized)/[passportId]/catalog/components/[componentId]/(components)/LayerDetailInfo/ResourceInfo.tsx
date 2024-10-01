import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import SingleValueDisplay from "app/(components)/generic/SingleValueDisplay"
import { Ressources } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import {
  calculateGwpABC,
  calculateQpABC,
  calculateRmiTotal,
} from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"

const ResourceInfo = ({ resources }: { resources: Ressources }) => {
  const rmiTotal = calculateRmiTotal(resources)
  const qpABC = calculateQpABC(resources)
  const gwpABC = calculateGwpABC(resources)

  const resourceInfoKeyValues = [
    { key: "RMI gesamt [kg]", value: rmiTotal },
    { key: "RMI mineralisch [kg]", value: resources?.rawMaterials.Mineral.toFixed(2) },
    { key: "RMI metallisch [kg]", value: resources?.rawMaterials.Metallic.toFixed(2) },
    { key: "RMI fossil [kg]", values: resources?.rawMaterials.Fossil.toFixed(2) },
    { key: "RMI forstwirtschaftlich [kg]", value: resources?.rawMaterials.Forestry.toFixed(2) },
    { key: "RMI agrarisch [kg]", value: resources?.rawMaterials.Agrar.toFixed(2) },
    { key: "RMI aquatisch [kg]", value: resources?.rawMaterials.Aqua.toFixed(2) },
  ]

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
