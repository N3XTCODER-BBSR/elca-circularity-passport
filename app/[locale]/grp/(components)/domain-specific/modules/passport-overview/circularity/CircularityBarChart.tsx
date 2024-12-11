"use client"

import { ResponsiveBar } from "@nivo/bar"
import CustomTooltip from "app/(components)/generic/CustomToolTip"
import { eolClassColorsMapper } from "constants/styleConstants"

const replaceWhiteSpaceWithLineBreak = (label: string) => label.replace(/\s+/g, "\n")

export type CircularityBarChartDatum = {
  eolPoints: number
  identifier: string
  eolClass: string
  overlayText: string
}

const CircularityBarChart = ({
  data,
  isPdf = false,
  margin,
}: {
  data: CircularityBarChartDatum[]
  isPdf?: boolean
  margin: { top: number; right: number; bottom: number; left: number }
}) => {
  return (
    <ResponsiveBar
      animate={!isPdf}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: isPdf ? "5.76pt" : "0.8rem",
            },
          },
        },
      }}
      data={data}
      keys={["eolPoints"]}
      indexBy="identifier"
      margin={margin}
      padding={0.2}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(d) => eolClassColorsMapper(d.data.eolClass)}
      // colors={(d) => "#eaeee5"}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      minValue={-60}
      maxValue={140}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
        format: replaceWhiteSpaceWithLineBreak,
      }}
      tooltip={(datum) => <CustomTooltip value={datum.data.overlayText} />}
      totalsOffset={9}
      enableGridX={false}
      enableGridY={false}
      enableLabel={false}
      role="application"
    />
  )
}

export default CircularityBarChart
