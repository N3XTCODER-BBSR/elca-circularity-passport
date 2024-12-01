"use client"

import CircularityBarChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/circularity/CircularityBarChart"
import CircularityIndexTotalBarChart from "../CircularityIndexTotalBarChart"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import CircularityIndexBarChartBreakdown from "./CircularityIndexBarChartBreakdown"

type CircularityIndexBreakdownByDinProps = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

const CircularityIndexBreakdownByDin = ({ circularityData }: CircularityIndexBreakdownByDinProps) => {
  // const circularityIndexPointsStr = `${circularityIndexPoints.toFixed(2)} points`
  return (
    <div className="m-8 h-[100px]">
      {/* <CircularityBarChart
          data={[
            {
              eolPoints: circularityIndexPoints,
              identifier: "Zirkularitätsindex",
              eolClass: "A",
              overlayText: "OVERLYA TEXT",
            },
          ]}
          margin={{ top: 0, right: 30, bottom: 50, left: 150 }}
        /> */}
      <CircularityIndexBarChartBreakdown margin={{ top: 0, right: 30, bottom: 50, left: 150 }} data={[]} />
    </div>
  )
}

export default CircularityIndexBreakdownByDin
