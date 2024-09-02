"use client"

import { ResponsiveBar } from "@nivo/bar"

const replaceWhiteSpaceWithLineBreak = (label: string) => label?.replace(/\s+/g, "\n")

const CustomTooltip = ({ _id, _value, color, data, labelKey }: any) => (
  <div
    style={{
      padding: "5px 10px",
      background: "white",
      border: "1px solid #ccc",
      color,
    }}
  >
    <strong>{data[labelKey]}</strong>
    <br />
  </div>
)

type MaterialsBarChartDatum = {
  categoryName: string
  mass: number
  aggregatedMassPercentage: number
  label: string
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
const BarChart = ({ data }: { data: MaterialsBarChartDatum[] }) => {
  return (
    <ResponsiveBar
      animate={false}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: "0.8rem",
            },
          },
        },
      }}
      data={data}
      keys={["aggregatedMassPercentage"]}
      indexBy={"categoryName"}
      margin={{ top: 0, right: 130, bottom: 50, left: 100 }}
      padding={0.2}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "category10" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      minValue={0}
      maxValue={100}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickValues: [0, 20, 40, 60, 80, 100],
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
        format: (value) => `${value} %`,
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
      totalsOffset={9}
      tooltip={(datum) => <CustomTooltip {...datum} data={datum.data} labelKey="label" />}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={"white"}
      role="application"
    />
  )
}

export default BarChart
