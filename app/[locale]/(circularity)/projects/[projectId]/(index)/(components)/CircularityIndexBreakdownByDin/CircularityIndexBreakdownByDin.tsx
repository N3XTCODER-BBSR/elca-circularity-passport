"use client"

import React from "react"
import { useRouter } from "next/navigation"
import CircularityIndexBarChartBreakdown from "../CircularityIndexBarChartBreakdown"
import { useDinBreakdownData } from "./useDinBreakdownData"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

export type ChartDatum = {
  datum: number
  identifier: string
  label: string
}

export type BreadCrumbEntry = {
  label: string
  identifier: string
  level: number
}

export type CircularityIndexBreakdownByDinProps = {
  projectId: number
  projectName: string
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

/**
 * This component is domain-logic agnostic. It only cares about:
 * - Displaying breadcrumbs
 * - Displaying a chart
 * - Handling user interactions (chart label clicks, breadcrumb navigation)
 *
 * The domain logic (e.g. DIN hierarchy, circularity calculations) is handled outside,
 * in the `useDinBreakdownData` hook. This component just uses the returned data.
 */
const CircularityIndexBreakdownByDin = ({
  projectId,
  projectName,
  circularityData,
  margin,
}: CircularityIndexBreakdownByDinProps) => {
  const router = useRouter()

  const {
    chartData,
    breadCrumbs,
    totalWeight,
    currentTitle,
    handleChartLabelClick,
    handleBreadCrumbClick,
    isLeafLevel,
    getDetailLinkForLeaf,
  } = useDinBreakdownData({ projectId, projectName, circularityData })

  const onChartLabelClick = (label: string) => {
    if (isLeafLevel) {
      const detailLink = getDetailLinkForLeaf(label)
      if (detailLink) router.push(detailLink)
    } else {
      handleChartLabelClick(label)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center">
        {/* chartData: {JSON.stringify(chartData)} */}
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Zirkularitätsindex DIN 276</h2>
        <div>
          Total mass:{" "}
          {totalWeight.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          kg
        </div>
        <div className="mt-4 px-8 py-4">{currentTitle}</div>
      </div>

      <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
        {breadCrumbs.map((entry, idx) =>
          idx === breadCrumbs.length - 1 ? (
            <span key={entry.identifier} className="text-gray500 text-sm">
              {entry.label}
            </span>
          ) : (
            <React.Fragment key={entry.identifier}>
              <button
                className="text-gray500 text-sm"
                onClick={() => handleBreadCrumbClick(entry.level, entry.identifier)}
              >
                {entry.label}
              </button>
              {" > "}
            </React.Fragment>
          )
        )}
        <div className="mx-8 mb-64 h-[200px]">
          <CircularityIndexBarChartBreakdown
            data={chartData.map(({ datum, identifier }) => ({ datum, identifier }))}
            margin={margin}
            clickHandler={onChartLabelClick}
          />
        </div>
      </div>
    </>
  )
}

export default CircularityIndexBreakdownByDin
