"use client"

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

import { ElcaElementWithComponents, EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { getTotalMass } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalMass"
import {
  getTotalVolume,
  MissingVolumeError,
} from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalVolume"
import { getTotalWeightedCircularityPotential } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalWeightedCircularityPotential"
import { getTotalWeightedDismantlingPotential } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalWeightedDismantlingPotential"
import { getDinCodeGroupLevel } from "lib/presentation-logic/circularity/formatDinCode"
import { formatVolumeWithUnit } from "lib/presentation-logic/circularity/formatVolumeWithUnit"
import { useCircularityFormatter } from "lib/presentation-logic/circularity/useCircularityFormatter"
import { useFormatter, useTranslations } from "next-intl"

import {
  CircularityPotentialBadge,
  DescriptionItem,
  DismantlingPotentialBadge,
  HorizontalDescriptionItem,
} from "./CircularityIndication"

export const ComponentDescription = ({
  componentData,
}: {
  componentData: ElcaElementWithComponents<EnrichedElcaElementComponent>
}) => {
  const { formatCircularityMetric } = useCircularityFormatter()
  const format = useFormatter()
  const t = useTranslations("Circularity.Components")
  const headersTranslations = useTranslations("Circularity.Components.headers")
  const unitsTranslations = useTranslations("Units")

  const dinGroupLevelNumber = getDinCodeGroupLevel(componentData.din_code)

  const totalWeightedCircularityPotential = getTotalWeightedCircularityPotential(componentData.layers)
  const totalWeightedDismantlingPotential = getTotalWeightedDismantlingPotential(componentData.layers)

  const totalMass = getTotalMass(componentData.layers)

  let totalVolumeString = ""
  try {
    const totalVolume = getTotalVolume(componentData.layers)
    totalVolumeString = formatVolumeWithUnit(totalVolume, format)
  } catch (error) {
    if (error instanceof MissingVolumeError) {
      totalVolumeString = "N/A"
    }
  }

  return (
    <div className="overflow-hidden border border-gray-200">
      <dl className="mb-3 py-2">
        <DescriptionItem label={t("name")} value={componentData.element_name} testId="name" />
        <DescriptionItem label={t("uuid")} value={componentData.element_uuid} testId="uuid" />
        <DescriptionItem label={t("costGroup")} value={dinGroupLevelNumber} testId="cost-group" />
        <DescriptionItem
          label={t("numberInstalled")}
          value={format.number(componentData.quantity, { maximumFractionDigits: 2 })}
          testId="number-installed"
        />
        <DescriptionItem label={t("referenceUnit")} value={componentData.unit} testId="ref-unit" />
      </dl>
      <div className="border-gray-20 grid grid-cols-3 border-t">
        <HorizontalDescriptionItem
          title={headersTranslations("materialDensity")}
          hasBorderRight
          labelValuePairs={[
            {
              label: headersTranslations("metrics.mass"),
              value: totalMass
                ? `${format.number(totalMass, { maximumFractionDigits: 2 })} ${unitsTranslations("Kg.short")}`
                : "-",
            },
            {
              label: headersTranslations("metrics.volume"),
              valueItem:
                totalVolumeString === "N/A" ? (
                  <span className="text-base font-semibold text-red">{totalVolumeString}</span>
                ) : undefined,
              value: totalVolumeString !== "N/A" ? totalVolumeString : undefined,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title={`${headersTranslations("dismantlingPotential")}:`}
          hasBorderRight
          labelValuePairs={[
            {
              label: headersTranslations("metrics.points"),
              value:
                totalWeightedDismantlingPotential !== null
                  ? formatCircularityMetric(totalWeightedDismantlingPotential)
                  : "-",
            },
            {
              label: headersTranslations("metrics.class"),
              valueItem: <DismantlingPotentialBadge value={totalWeightedDismantlingPotential} />,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title={`${headersTranslations("circularityPotential")}:`}
          labelValuePairs={[
            {
              label: headersTranslations("metrics.points"),
              value:
                totalWeightedCircularityPotential !== null
                  ? formatCircularityMetric(totalWeightedCircularityPotential)
                  : "-",
            },
            {
              label: headersTranslations("metrics.class"),
              valueItem: <CircularityPotentialBadge value={totalWeightedCircularityPotential} />,
            },
          ]}
        />
      </div>
    </div>
  )
}
