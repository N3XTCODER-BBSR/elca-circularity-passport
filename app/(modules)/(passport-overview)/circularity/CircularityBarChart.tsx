"use client"

import { BarDatum, ResponsiveBar } from "@nivo/bar"
import { CirculartyDataItem } from "./circularity-data-aggregation"

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

const colors: { [key: string]: string } = {
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
const getColor = (barDatum: { data: CirculartyDataItem }) => {
  return colors[barDatum.data.eolClass as string] || "black"
}

const BarChart = ({
  data,
  indexBy,
  keys,
  labelKey,
}: {
  data: BarDatum[]
  indexBy: string
  keys: string[]
  labelKey: string
}) => (
  <ResponsiveBar
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
    keys={keys}
    indexBy={indexBy}
    margin={{ top: 0, right: 30, bottom: 50, left: 150 }}
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
    role="application"
  />
)

export default BarChart
