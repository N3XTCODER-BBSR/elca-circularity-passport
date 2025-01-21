"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import React from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { ChartAndBreadCrumbComponent } from "./ChartAndBreadCrumbComponent"
import { transformCircularityDataAndDinHierachyToChartTree } from "./transformCircularityDataAndDinHierachyToChartTree"
// Example usage in a page or parent component

type CircularityIndexBreakdownByDin = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  projectName: string
  catalogPath: string
}

export default function CircularityIndexBreakdownByDin(props: CircularityIndexBreakdownByDin) {
  const router = useRouter()
  const t = useTranslations("CircularityTool.sections.overview.moduleByCostGroup")
  const tUnits = useTranslations("Units")

  function exampleLeafClickHandler(resourceId: string) {
    const detailLink = `${props.catalogPath}/components/${resourceId}`
    if (detailLink) router.push(detailLink)
  }

  const chartData = transformCircularityDataAndDinHierachyToChartTree(props.circularityData, props.projectName)

  return (
    <ChartAndBreadCrumbComponent
      rootChartDataNode={chartData}
      leafClickHandler={exampleLeafClickHandler}
      title={t("title")}
      labelTotalDimensionalValue={t("totalMass")}
      unitNameTotalDimensionalValue={tUnits("Kg.short")}
    />
  )
}
