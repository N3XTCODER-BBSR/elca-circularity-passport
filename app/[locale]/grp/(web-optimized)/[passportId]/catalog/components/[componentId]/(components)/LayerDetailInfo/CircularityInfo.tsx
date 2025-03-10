/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
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
