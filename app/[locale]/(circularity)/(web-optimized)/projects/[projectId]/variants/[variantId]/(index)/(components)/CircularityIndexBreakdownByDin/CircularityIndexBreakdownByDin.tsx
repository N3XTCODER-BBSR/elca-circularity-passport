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

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"
import { DimensionalFieldName, MetricType } from "lib/domain-logic/circularity/misc/domain-types"
import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ChartAndBreadCrumbComponent } from "./ChartAndBreadCrumbComponent"
import { transformCircularityDataAndDinHierachyToChartTree } from "./transformCircularityDataAndDinHierachyToChartTree"

type CircularityIndexBreakdownByDinProps = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  projectName: string
  catalogPath: string
  dimensionalFieldName: DimensionalFieldName
  metricType: MetricType
}

export default function CircularityIndexBreakdownByDin(props: CircularityIndexBreakdownByDinProps) {
  const router = useRouter()
  const t = useTranslations("CircularityTool.sections.overview.moduleByCostGroup")
  const tUnits = useTranslations("Units")

  function exampleLeafClickHandler(resourceId: string) {
    const detailLink = `${props.catalogPath}/components/${resourceId}`
    if (detailLink) router.push(detailLink)
  }

  const chartData = transformCircularityDataAndDinHierachyToChartTree(
    props.circularityData,
    props.dimensionalFieldName,
    props.projectName,
    props.metricType
  )

  return (
    <ChartAndBreadCrumbComponent
      rootChartDataNode={chartData}
      leafClickHandler={exampleLeafClickHandler}
      title={t("title")}
      labelTotalDimensionalValue={t(`totalDimensionValue.${props.dimensionalFieldName}`)}
      unitNameTotalDimensionalValue={tUnits(`${props.dimensionalFieldName === "mass" ? "Kg" : "M3"}.short`)}
      metricType={props.metricType}
    />
  )
}
