"use client"

import { BarDatum, ResponsiveBar } from "@nivo/bar"

const replaceWhiteSpaceWithLineBreak = (label: string) => label.replace(/\s+/g, "\n")

const CustomTooltip = ({ _id, _value, _color, data, labelKey }: any) => (
  <div
    style={{
      padding: "5px 10px",
      background: "white",
      border: "1px solid #ccc",
    }}
  >
    <strong>{data[labelKey]}</strong>
    <br />
  </div>
)

const colors = {
  A: "#3e5529",
  B: "#eaeee5",
  C: "#b1cf95",
  "C/D": "#b1cf95",
  D: "#E2EFDA",
  "D/E": "#E2EFDA",
  E: "#FFD967",
  "E/F": "#FFD967",
  F: "#E36C0A",
  "F/G": "#E36C0A",
  G: "#8e4d1c",
}
const getColor = (bar: BarDatum) => {
  // TODO: fix types
  // @ts-ignore
  return colors[bar.data.eolClass] || "black"!
}

const BarChart = ({
  data,
  indexBy,
  keys,
  labelKey,
  isTotalBuilding = false,
}: {
  data: BarDatum[]
  indexBy: string
  keys: string[]
  labelKey: string
  isTotalBuilding?: boolean
}) => {
  const formattedData = data.map((d) => {
    return {
      ...d,
      categoryNumberAndName: `${d.categoryNumberAndName} (${d.eolClass})`,
    }
  })

  return (
    <ResponsiveBar
      animate={false}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: "5.76pt",
            },
          },
        },
      }}
      data={isTotalBuilding ? data : formattedData}
      keys={keys}
      indexBy={indexBy}
      margin={{
        top: isTotalBuilding ? 30 : 0,
        right: isTotalBuilding ? 70 : 10,
        bottom: isTotalBuilding ? 90 : 50,
        left: isTotalBuilding ? 70 : 130,
      }}
      padding={0.2}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      // TODO: fix types (might be tricky because reason could be in the chart library)
      // @ts-ignore
      colors={getColor}
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
      tooltip={(datum) => <CustomTooltip {...datum} data={datum.data} labelKey={labelKey} />}
      totalsOffset={9}
      enableLabel={false}
      labelPosition="end"
      role="application"
    />
  )
}

export default BarChart
