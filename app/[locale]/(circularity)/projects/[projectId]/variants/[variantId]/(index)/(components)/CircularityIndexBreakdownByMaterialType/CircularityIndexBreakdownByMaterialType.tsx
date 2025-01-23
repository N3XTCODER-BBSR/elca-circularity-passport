"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
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
  product_id: number
  name: string
  process_category_node_id: number
  weight: number
  circularityIndex: number
}

type CircularityIndexBreakdownByMaterialTypeProps = {
  catalogPath: string
  projectName: string
  processCategories: ProcessCategory[]
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

export default function CircularityIndexBreakdownByMaterialType(props: CircularityIndexBreakdownByMaterialTypeProps) {
  const router = useRouter()
  const t = useTranslations("CircularityTool.sections.overview.moduleByMaterialCategory")
  const tUnits = useTranslations("Units")

  // Map layers to MaterialNodes
  const products: MaterialNode[] = props.circularityData.flatMap((el) =>
    el.layers.map((layer) => ({
      component_uuid: layer.element_uuid,
      product_id: layer.component_id,
      name: layer.element_name,
      process_category_node_id: layer.process_category_node_id,
      // TODO: check whether this should actually fall back 'silently' to 0
      weight: (layer.mass ?? 0) * (layer.quantity ?? 0) || 0, // if weight might be null, default to 0 or handle upstream
      circularityIndex: layer.circularityIndex ?? 0,
    }))
  )

  function leafClickHandler(resourceId: string) {
    const detailLink = `${props.catalogPath}/components/${resourceId}`
    router.push(detailLink)
  }

  const chartData: ChartDataNode = transformCircularityDataAndMaterialTypesToChartData(
    props.processCategories,
    products,
    props.projectName,
    true
  )

  return (
    <ChartAndBreadCrumbComponent
      rootChartDataNode={chartData}
      leafClickHandler={leafClickHandler}
      title={t("title")}
      labelTotalDimensionalValue={t("totalMass")}
      unitNameTotalDimensionalValue={tUnits("Kg.short")}
    />
  )
}
