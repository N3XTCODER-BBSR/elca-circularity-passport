"use client"

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

type CircularityIndexBreakdownByDinProps = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
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
      {/* <CircularityIndexBreakdownByDin
        circularityTotalIndexPoints={circularityIndexPoints}
        margin={{ top: 0, right: 30, bottom: 50, left: 150 }}
      /> */}
    </div>
  )
}

export default CircularityIndexBreakdownByDin
