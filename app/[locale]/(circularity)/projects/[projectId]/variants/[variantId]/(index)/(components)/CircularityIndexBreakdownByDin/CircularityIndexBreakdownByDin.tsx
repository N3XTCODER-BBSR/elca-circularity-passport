"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { DimensionalFieldName, MetricType } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
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
