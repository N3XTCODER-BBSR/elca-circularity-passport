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
import { useState } from "react"
import MaterialsBarChart, {
  MaterialsBarChartDatum,
} from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/materials/MaterialsBarChart"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "lib/domain-logic/grp/modules/passport-overview/materials/materials-data-aggregation"
import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"

const navigationSections = [
  {
    translationKey: "navigationSections.byMaterialClass",
    id: "1",
  },
  {
    translationKey: "navigationSections.byComponentCategory",
    id: "2",
  },
]

type MaterialsProps = {
  dinEnrichedPassportData: DinEnrichedPassportData
  className?: string
}

const Materials: React.FC<MaterialsProps> = ({ dinEnrichedPassportData, className }) => {
  const t = useTranslations("Grp.Web.sections.overview.module1Materials")
  const tCostGroups = useTranslations("Common.costGroups")
  const tMaterialClasses = useTranslations("Common.materialClasses")
  const unitsTranslations = useTranslations("Units")
  const format = useFormatter()
  const [currentNavSectionId, setCurrentNavSectionId] = useState<string>("1")

  const aggregatedDataByBuildingComponentCategory = aggregateMaterialsDataByBuildingComponentCategory(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const aggregatedDataByMaterialClass = aggregateMaterialsDataByMaterialClass(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const chartDataGroupedByMaterialClass: MaterialsBarChartDatum[] =
    aggregatedDataByMaterialClass.aggregatedByClassId.map((data) => {
      return {
        groupName: data.materialClassDescription,
        groupId: data.materialClassId,
        identifier: tMaterialClasses(`${data.materialClassId}`),
        aggregatedMassPercentage: data.aggregatedMassPercentage,
        aggregatedMass: data.aggregatedMass,
      }
    })

  const chartDataGroupedByComponentCategory: MaterialsBarChartDatum[] =
    aggregatedDataByBuildingComponentCategory.aggregatedByCategory.map((data) => {
      return {
        groupName: data.costGroupCategoryName,
        groupId: data.costGroupCategoryId.toString(),
        identifier: data.costGroupCategoryId + " " + tCostGroups(`${data.costGroupCategoryId}`),
        aggregatedMassPercentage: data.aggregatedMassPercentage,
        aggregatedMass: data.aggregatedMass,
      }
    })

  const totalMass = aggregatedDataByBuildingComponentCategory.totalMass
  const totalMassRelativeToNrf = aggregatedDataByBuildingComponentCategory.totalMassRelativeToNrf

  return (
    <div className={className}>
      <h2 className="text-l max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("moduleTitle")}
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("moduleSubtitle")}
      </h3>
      <div className="mx-auto flex h-[300px] min-w-[834px] max-w-[834px] flex-col text-center">
        <h4 className="text-l mb-4 font-extrabold lg:text-2xl xl:text-xl">{t("chartTitle")}</h4>
        <div className="flex flex-row items-center ">
          <TotalAndNrfRelativeValuesDisplay
            totalValue={totalMass}
            nrfRelativeValue={totalMassRelativeToNrf}
            unit={unitsTranslations("Kg.short")}
          />
          <select
            className="min-w-32 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentNavSectionId}
            onChange={(e) => setCurrentNavSectionId(e.target.value)}
          >
            {navigationSections.map((section) => (
              <option key={section.id} value={section.id}>
                {t(section.translationKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="h-[500px]">
          {currentNavSectionId === "1" && (
            <MaterialsBarChart
              data={chartDataGroupedByMaterialClass}
              labelFormatter={(data) =>
                `${format.number(data.aggregatedMassPercentage, { maximumFractionDigits: 2 })}% (${format.number(
                  data.aggregatedMass,
                  { maximumFractionDigits: 2 }
                )} ${unitsTranslations("Kg.short")})`
              }
            />
          )}
          {currentNavSectionId === "2" && (
            <MaterialsBarChart
              data={chartDataGroupedByComponentCategory}
              labelFormatter={(data) =>
                `${format.number(data.aggregatedMassPercentage, { maximumFractionDigits: 2 })}% (${format.number(
                  data.aggregatedMass,
                  { maximumFractionDigits: 2 }
                )} ${unitsTranslations("Kg.short")})`
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Materials
