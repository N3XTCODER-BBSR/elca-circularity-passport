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

const ResourcesDonutChart = ({
  data,
  indexBy,
  labelPropertyName,
  patternPropertyName,
  keys,
  colors,
  innerRadius,
}: {
  data: Array<{ [key: string]: string | number }>
  indexBy: string
  labelPropertyName: string
  patternPropertyName: string
  keys: string[]
  colors?: ((datum: any) => string) | { datum: string }
  innerRadius?: number
}) => (
  <ResponsivePie
    // TODO: Consider to move this out into domain-level logic
    data={data.map((d) => ({
      id: d[indexBy],
      label: d.label,
      arcLinkLabel: d[labelPropertyName],
      value: keys.reduce((acc, key) => acc + (d[key] as number), 0),
      color: d.color,
      pattern: d[patternPropertyName],
    }))}
    animate={false}
    activeOuterRadiusOffset={8}
    enableArcLabels={false}
    enableArcLinkLabels={true}
    arcLinkLabel={(e) => `${e.data.arcLinkLabel}`}
    margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
    innerRadius={innerRadius || 0.6}
    padAngle={0.7}
    cornerRadius={3}
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
        color: "rgba(0, 0, 0, 0.15)",
        size: 12,
        padding: 3,
        stagger: true,
      },
    ]}
    fill={[
      {
        match: (d) => d.data.pattern === "dots",
        id: "dots",
      },
    ]}
    tooltip={(datum) => <CustomTooltip {...datum} data={datum} />}
  />
)

export default ResourcesDonutChart
