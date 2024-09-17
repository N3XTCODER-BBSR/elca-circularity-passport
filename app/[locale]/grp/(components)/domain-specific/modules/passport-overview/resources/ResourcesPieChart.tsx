"use client"

import { ResponsivePie } from "@nivo/pie"

const CustomTooltip = ({ _id, _value, color, data }: any) => (
  <div
    style={{
      padding: "5px 10px",
      background: "white",
      border: "1px solid #ccc",
      color,
    }}
  >
    <strong>{data.datum.label}</strong>
    <br />
  </div>
)

const PieChart = ({
  data,
  indexBy,
  keys,
  colors,
}: {
  data: Array<{ [key: string]: string | number }>
  indexBy: string
  keys: string[]
  colors?: ((datum: any) => string) | { datum: string }
}) => (
  <ResponsivePie
    // TODO: Consider to move this out into domain-level logic
    data={data.map((d) => ({
      id: d[indexBy],
      label: d.label,
      value: keys.reduce((acc, key) => acc + (d[key] as number), 0),
    }))}
    arcLabel={(e) => `${e.data.label}`}
    margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
    innerRadius={0}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    colors={colors || { scheme: "blues" }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.2]],
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "ruby",
        },
        id: "dots",
      },
      {
        match: {
          id: "c",
        },
        id: "dots",
      },
      {
        match: {
          id: "go",
        },
        id: "dots",
      },
      {
        match: {
          id: "python",
        },
        id: "dots",
      },
      {
        match: {
          id: "scala",
        },
        id: "lines",
      },
      {
        match: {
          id: "lisp",
        },
        id: "lines",
      },
      {
        match: {
          id: "elixir",
        },
        id: "lines",
      },
      {
        match: {
          id: "javascript",
        },
        id: "lines",
      },
    ]}
    tooltip={(datum) => <CustomTooltip {...datum} data={datum} />}
    enableArcLabels={false}
  />
)

export default PieChart
