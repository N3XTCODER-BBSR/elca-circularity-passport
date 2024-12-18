"use client"

import { useFormatter } from "next-intl"
import CircularityIndexTotalBarChart from "./CircularityIndexTotalBarChart"

const CircularityIndexTotalNumber = ({ circularityIndexPoints }: { circularityIndexPoints: number }) => {
  const format = useFormatter()

  const formattedCircularityIndexPoints = format.number(circularityIndexPoints, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const circularityIndexPointsStr = `${formattedCircularityIndexPoints} points`
  return (
    <div className="mx-8 mb-0 mt-8 h-[250px]">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Zirkularitätsindex gesamt</h2>
        <div className="mt-4 rounded-lg border-2 px-8 py-4 text-3xl font-bold">{circularityIndexPointsStr}</div>
      </div>
      <div className="m-8 h-[100px]">
        <CircularityIndexTotalBarChart
          circularityTotalIndexPoints={circularityIndexPoints}
          margin={{ top: 0, right: 30, bottom: 50, left: 150 }}
        />
      </div>
    </div>
  )
}

export default CircularityIndexTotalNumber
