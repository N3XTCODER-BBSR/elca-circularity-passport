import { useFormatter, useTranslations } from "next-intl"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { getEolClassNameByPoints } from "lib/domain-logic/circularity/utils/circularityMappings"
import { Circularity } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

const CircularityInfo = ({ circularity }: { circularity?: Circularity }) => {
  const eolClass = getEolClassNameByPoints(circularity?.eolPoints)
  const t = useTranslations("Grp.Web.sections.detailPage.componentLayer.circularity")
  const format = useFormatter()
  const resourceInfoKeyValues = [
    {
      key: t("circularityIndex"),
      value:
        circularity?.circularityIndex != null
          ? format.number(circularity.circularityIndex, { maximumFractionDigits: 2 })
          : "-",
      testId: "circularity-index",
    },
    { key: t("eolClass"), value: eolClass },
    { key: t("dismantlingClass"), value: circularity?.dismantlingPotentialClassId },
    { key: t("version"), value: circularity?.methodologyVersion },
    { key: t("proofReuse"), value: circularity?.proofReuse },
  ]

  const interferingSubstancesKeyValues =
    circularity?.interferingSubstances
      ?.map((interferingSubstance) => ({
        key: interferingSubstance.className,
        // TODO (XL): improve the null handling here (comparing to string "NULL" is not ideal)
        value:
          interferingSubstance.description === "NULL"
            ? t("disturbingSubstanceNameUnspecified")
            : interferingSubstance.description,
      }))
      // TODO (XL): improve the null handling here (comparing to string "NULL" is not ideal)
      .filter((el) => el.key != null && el.key != "NULL") || []

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
