import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import getEolClassNameByPoints from "domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { Circularity } from "domain-logic/grp/data-schema/versions/v1/passportSchema"

const CircularityInfo = ({ circularity }: { circularity?: Circularity }) => {
  const eolClass = getEolClassNameByPoints(circularity?.eolPoints)

  const resourceInfoKeyValues = [
    { key: "Klasse EOL", value: eolClass },
    { key: "Punkte EOL", value: circularity?.eolPoints?.toFixed(2) },
    { key: "Version", value: circularity?.version },
    { key: "Kategorie", value: circularity?.category },
    { key: "Nachweis Wiederverwendung", value: circularity?.proofReuse },
  ]

  const interferingSubstancesKeyValues =
    circularity?.interferingSubstances.map((interferingSubstance) => ({
      key: interferingSubstance.className,
      value: interferingSubstance.description,
    })) || []

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline="General" data={resourceInfoKeyValues} />
      <SideBySideDescriptionListsWithHeadline
        headline="Material Compatibility - Interfering Substances"
        data={interferingSubstancesKeyValues}
      />{" "}
    </div>
  )
}

export default CircularityInfo
