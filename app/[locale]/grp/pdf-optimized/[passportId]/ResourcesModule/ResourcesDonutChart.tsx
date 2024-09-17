"use client"
import { ResponsivePie } from "@nivo/pie"

const DonutChart = ({
  data,
  indexBy,
  keys,
  colors,
  patternPropertyName,
}: {
  data: Array<{ [key: string]: string | number }>
  indexBy: string
  keys: string[]
  patternPropertyName: string
  colors?: ((datum: any) => string) | { datum: string }
}) => (
  <ResponsivePie
    animate={false}
    isInteractive={false}
    // TODO: consider to move this into domain-logic layer
    data={data.map((d) => ({
      id: d[indexBy],
      label: d.label,
      value: keys.reduce((acc, key) => acc + (d[key] as number), 0),
      color: d.color,
      pattern: d[patternPropertyName],
    }))}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    innerRadius={0.6}
    padAngle={0}
    cornerRadius={0}
    activeOuterRadiusOffset={8}
    colors={colors || { scheme: "blues" }}
    borderWidth={0}
    enableArcLabels={false}
    enableArcLinkLabels={false}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(0, 0, 0, 0.15)",
        size: 4,
        padding: 1,
        stagger: true,
      },
    ]}
    fill={[
      {
        // TODO: Consider to refactor this or move out into domain/presentation-logic layer
        match: (d) => d.data.pattern === "dots",
        id: "dots",
      },
    ]}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 56,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "#999",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: "circle",
      },
    ]}
  />
)

export default DonutChart
