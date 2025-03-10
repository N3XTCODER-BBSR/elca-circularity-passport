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

import { useFormatter, useTranslations } from "next-intl"
import CircularityBarChart, {
  CircularityBarChartDatum,
} from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/circularity/CircularityBarChart"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import aggregateCircularityData from "lib/domain-logic/grp/modules/passport-overview/circularity/circularity-data-aggregation"
import DummyAccordion from "../../../DummyAccordion"

type CircularityProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  className?: string
}

const Circularity: React.FC<CircularityProps> = ({ dinEnrichedBuildingComponents, className }) => {
  const t = useTranslations("Grp.Web.sections.overview.module3Circularity")
  const tCostGroups = useTranslations("Common.costGroups")
  const tAggregationSelector = useTranslations("GenericComponents.AggregationSelector")
  const aggregatedData = aggregateCircularityData(dinEnrichedBuildingComponents)
  const format = useFormatter()

  const chartDataForAvgEolPointsPerComponentCostCategory: CircularityBarChartDatum[] =
    aggregatedData.avgEolPointsPerComponentCostCategory.map((data) => {
      const identifier = `${data.dinCategoryLevelNumber} ${tCostGroups(data.dinCategoryLevelNumber.toString())}`
      return {
        eolPoints: data.weightedAvgEolPoints,
        identifier,
        eolClass: data.eolClass,
        overlayText: `${identifier}: ${data.eolClass} (${Math.round(data.weightedAvgEolPoints)})`,
      }
    })

  const formattedCircularityIndexPoints = format.number(aggregatedData.totalAvgEolPoints, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const chartDataForAvgEolPoints: CircularityBarChartDatum[] = [
    {
      eolPoints: aggregatedData.totalAvgEolPoints,
      identifier: tAggregationSelector("total"),
      eolClass: aggregatedData.totalEolClass,
      overlayText: `${aggregatedData.totalEolClass} (${formattedCircularityIndexPoints})`,
    },
  ]
  const faqContent = [
    {
      Q: t("eol.faq.1.Q"),
      A: t("eol.faq.1.A"),
    },
    {
      Q: t("eol.faq.2.Q"),
      A: t("eol.faq.2.A"),
    },
  ]

  return (
    <div className={className}>
      <h2 className="text-l max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("moduleTitle")}
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("moduleSubTitle")}
      </h3>
      <div className="center flex flex-col items-center text-center">
        <b className="text-md mb-4 max-w-xl text-center leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
          {t("eol.title")}
        </b>
        <p>{formattedCircularityIndexPoints}</p>

        <div className="h-[100px] md:w-2/4">
          <CircularityBarChart data={chartDataForAvgEolPoints} margin={{ top: 0, right: 30, bottom: 50, left: 150 }} />
        </div>
      </div>
      <div className="center mt-10 flex flex-col items-center">
        <h4 className="text-md mb-4 max-w-xl text-center leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
          {tAggregationSelector("byComponentCategory")}
        </h4>
        <div className="h-[300px] md:w-2/4">
          <CircularityBarChart
            data={chartDataForAvgEolPointsPerComponentCostCategory}
            margin={{ top: 0, right: 30, bottom: 50, left: 150 }}
          />
        </div>
      </div>
      <div className="mb-16 mt-24 w-full">
        <DummyAccordion faqContent={faqContent} />
      </div>
    </div>
  )
}

export default Circularity
