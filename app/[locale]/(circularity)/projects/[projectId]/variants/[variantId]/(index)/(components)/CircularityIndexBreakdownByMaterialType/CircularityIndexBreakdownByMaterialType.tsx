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
import { transformCircularityDataAndMaterialTypesToChartData } from "./transformCircularityDataAndMaterialTypeDataToChartData"
import {
  ChartAndBreadCrumbComponent,
  ChartDataNode,
} from "../CircularityIndexBreakdownByDin/ChartAndBreadCrumbComponent"

export type ProcessCategory = {
  node_id: number
  name: string
  ref_num: string | null
}

export type MaterialNode = {
  component_uuid: string
  component_name: string
  product_id: number
  name: string
  process_category_node_id: number
  volume: number
  mass: number
  circularityIndex: number
  eolBuiltPoints: number
  dismantlingPoints: number
}

type CircularityIndexBreakdownByMaterialTypeProps = {
  catalogPath: string
  projectName: string
  dimensionalFieldName: DimensionalFieldName
  processCategories: ProcessCategory[]
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
  metricType: MetricType
}

export default function CircularityIndexBreakdownByMaterialType(props: CircularityIndexBreakdownByMaterialTypeProps) {
  const router = useRouter()
  const t = useTranslations("CircularityTool.sections.overview.moduleByMaterialCategory")
  const tUnits = useTranslations("Units")

  // Map layers to MaterialNodes
  const products: MaterialNode[] = props.circularityData.flatMap((el) =>
    el.layers.map((layer) => ({
      component_uuid: layer.element_uuid,
      component_name: layer.element_name,
      product_id: layer.component_id,
      name: layer.process_name,
      process_category_node_id: layer.process_category_node_id,
      // TODO (L): check whether this should actually fall back 'silently' to 0
      volume: (layer.volume ?? 0) * (layer.quantity ?? 0) || 0, // if volume might be null, default to 0 or handle upstream
      mass: (layer.mass ?? 0) * (layer.quantity ?? 0) || 0, // if mass might be null, default to 0 or handle upstream
      circularityIndex: layer.circularityIndex ?? 0,
      eolBuiltPoints: layer.eolBuilt?.points ?? 0,
      dismantlingPoints: layer.dismantlingPoints ?? 0,
    }))
  )

  function leafClickHandler(resourceId: string) {
    const detailLink = `${props.catalogPath}/components/${resourceId}`
    router.push(detailLink)
  }

  const chartData: ChartDataNode = transformCircularityDataAndMaterialTypesToChartData(
    props.processCategories,
    products,
    props.dimensionalFieldName,
    props.projectName,
    props.metricType,
    true
  )

  return (
    <ChartAndBreadCrumbComponent
      rootChartDataNode={chartData}
      leafClickHandler={leafClickHandler}
      title={t("title")}
      labelTotalDimensionalValue={t(`totalDimensionValue.${props.dimensionalFieldName}`)}
      unitNameTotalDimensionalValue={tUnits(`${props.dimensionalFieldName === "mass" ? "Kg" : "M3"}.short`)}
      metricType={props.metricType}
    />
  )
}
