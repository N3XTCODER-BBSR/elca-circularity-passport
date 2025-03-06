"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { transformCircularityDataAndMaterialTypesToChartData } from "./transformCircularityDataAndMaterialTypeDataToChartData"
import {
  ChartAndBreadCrumbComponent,
  ChartDataNode,
} from "../CircularityIndexBreakdownByDin/ChartAndBreadCrumbComponent"
import { MetricType } from "../CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"

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
