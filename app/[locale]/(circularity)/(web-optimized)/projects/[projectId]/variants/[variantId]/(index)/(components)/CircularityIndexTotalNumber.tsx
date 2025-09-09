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
"use client"

import { useTranslations } from "next-intl"
import { MetricType } from "lib/domain-logic/circularity/misc/domain-types"
import { useCircularityFormatter } from "lib/presentation-logic/circularity/formatCircularityMetric"
import CircularityIndexTotalBarChart from "./CircularityIndexTotalBarChart"
import { chartMargin } from "lib/presentation-logic/circularity/chartHeightUtils"

const CircularityMetricTotalNumber = ({
  circularityMetricPoints: circularityIndexPoints,
  metricType,
}: {
  circularityMetricPoints: number
  metricType: MetricType
}) => {
  const { formatCircularityMetric } = useCircularityFormatter()
  const t = useTranslations("CircularityTool.sections.overview.moduleTotal")

  const formattedCircularityIndexPoints = formatCircularityMetric(circularityIndexPoints)
  const circularityIndexPointsStr = `${formattedCircularityIndexPoints} ${t("points")}`
  return (
    <div>
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-400">{t("title")}</h3>
        <div
          className="mt-4 rounded-lg border-2 px-8 py-4 text-2xl font-bold"
          data-testid={`circularity-metric-total-number__points-div`}
        >
          {circularityIndexPointsStr}
        </div>
      </div>
      <div className="mt-8 h-[100px]">
        <CircularityIndexTotalBarChart
          metricType={metricType}
          circularityTotalIndexPoints={circularityIndexPoints}
          margin={chartMargin}
        />
      </div>
    </div>
  )
}

export default CircularityMetricTotalNumber
