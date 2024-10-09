import { useTranslations } from "next-intl"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import getEolClassNameByPoints from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { Circularity } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

const CircularityInfo = ({ circularity }: { circularity?: Circularity }) => {
  const eolClass = getEolClassNameByPoints(circularity?.eolPoints)
  const t = useTranslations("Grp.Web.sections.detailPage.componentLayer.circularity")
  const resourceInfoKeyValues = [
    { key: t("eolClass"), value: eolClass },
    { key: t("eolPoints"), value: circularity?.eolPoints?.toFixed(2) },
    { key: t("version"), value: circularity?.version },
    { key: t("category"), value: circularity?.category },
    { key: t("proofReuse"), value: circularity?.proofReuse },
  ]

  const interferingSubstancesKeyValues =
    circularity?.interferingSubstances.map((interferingSubstance) => ({
      key: interferingSubstance.className,
      value: interferingSubstance.description,
    })) || []

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline={t("general")} data={resourceInfoKeyValues} />
      <SideBySideDescriptionListsWithHeadline
        headline={t("materialCompatibility")}
        data={interferingSubstancesKeyValues}
      />{" "}
    </div>
  )
}

export default CircularityInfo
