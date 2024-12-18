"use client"

import { useRouter } from "next/navigation"
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

  function exampleLeafClickHandler(resourceId: string) {
    const detailLink = `${props.catalogPath}/components/${resourceId}`
    if (detailLink) router.push(detailLink)
  }

  const chartData = transformCircularityDataAndDinHierachyToChartTree(props.circularityData, props.projectName)

  return (
    <ChartAndBreadCrumbComponent
      rootChartDataNode={chartData}
      leafClickHandler={exampleLeafClickHandler}
      title="Zirkularitätsindex DIN 276"
      labelTotalDimensionalValue="Total mass"
      unitNameTotalDimensionalValue="kg"
    />
  )
}
