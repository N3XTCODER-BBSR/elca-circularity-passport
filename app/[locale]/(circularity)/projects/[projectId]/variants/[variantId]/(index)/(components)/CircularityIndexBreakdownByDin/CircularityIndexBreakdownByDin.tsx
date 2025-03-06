"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { ChartAndBreadCrumbComponent } from "./ChartAndBreadCrumbComponent"
import { transformCircularityDataAndDinHierachyToChartTree } from "./transformCircularityDataAndDinHierachyToChartTree"

export type MetricType = "circularityIndex" | "eolBuiltPoints" | "dismantlingPoints"

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

  // Get the appropriate title based on the metric type
  const getMetricTitle = () => {
    switch (props.metricType) {
      case "eolBuiltPoints":
        return t("eolBuiltPointsTitle", { fallback: "End of Life (Built) Points by Cost Group" })
      case "dismantlingPoints":
        return t("dismantlingPointsTitle", { fallback: "Dismantling Points by Cost Group" })
      case "circularityIndex":
      default:
        return t("title")
    }
  }

  return (
    <ChartAndBreadCrumbComponent
      rootChartDataNode={chartData}
      leafClickHandler={exampleLeafClickHandler}
      title={getMetricTitle()}
      labelTotalDimensionalValue={t(`totalDimensionValue.${props.dimensionalFieldName}`)}
      unitNameTotalDimensionalValue={tUnits(`${props.dimensionalFieldName === "mass" ? "Kg" : "M3"}.short`)}
      metricType={props.metricType}
    />
  )
}
