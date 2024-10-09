import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import SingleValueDisplay from "app/(components)/generic/SingleValueDisplay"
import { Ressources } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import {
  calculateGwpABC,
  calculateQpABC,
  calculateRmiTotal,
} from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import { useTranslations } from "next-intl"

const ResourceInfo = ({ resources }: { resources: Ressources }) => {
  const rmiTotal = calculateRmiTotal(resources)
  const qpABC = calculateQpABC(resources)
  const gwpABC = calculateGwpABC(resources)
  const t = useTranslations("Grp.Web.sections.detailPage.componentLayer.resources")

  const resourceInfoKeyValues = [
    { key: `RMI ${t("total")} [kg]`, value: rmiTotal },
    { key: `RMI ${t("Mineral")} [kg]`, value: resources?.rawMaterials.Mineral.toFixed(2) },
    { key: `RMI ${t("Metallic")} [kg]`, value: resources?.rawMaterials.Metallic.toFixed(2) },
    { key: `RMI ${t("Fossil")} [kg]`, values: resources?.rawMaterials.Fossil.toFixed(2) },
    { key: `RMI ${t("Forestry")} [kg]`, value: resources?.rawMaterials.Forestry.toFixed(2) },
    { key: `RMI ${t("Agrar")} [kg]`, value: resources?.rawMaterials.Agrar.toFixed(2) },
    { key: `RMI ${t("Aqua")} [kg]`, value: resources?.rawMaterials.Aqua.toFixed(2) },
  ]

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline={t("rawMaterials")} data={resourceInfoKeyValues} />
      <SingleValueDisplay headline={t("primaryEnergy")} label="kWh" value={Math.floor(qpABC || 0)} />
      <SingleValueDisplay headline={t("globalWarmingPotential")} label="kg co2eq" value={Math.floor(gwpABC || 0)} />
      <SingleValueDisplay headline={t("carbonContent")} label="kg" value={Math.floor(resources?.carbonContent || 0)} />
      <SingleValueDisplay
        headline={t("recyclingContent")}
        label="kg"
        value={Math.floor(resources?.recyclingContent || 0)}
      />
    </div>
  )
}

export default ResourceInfo
