"use client"

import { ResponsivePie } from "@nivo/pie"

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
  // colors: OrdinalColorScaleConfig<Omit<ComputedDatum<DefaultRawDatum>, 'color' | 'fill' | 'arc'>>
}) => (
  <ResponsivePie
    animate={false}
    isInteractive={false}
    data={data.map((d) => ({
      id: d[indexBy],
      label: d.label,
      value: keys.reduce((acc, key) => acc + (d[key] as number), 0),
      color: d.color,
    }))}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    innerRadius={0}
    padAngle={0}
    cornerRadius={0}
    activeOuterRadiusOffset={8}
    // colors={{ scheme: "blues" }}
    // colors={{ datum: 'data.color' }}
    colors={colors || { scheme: "blues" }}
    borderWidth={0}
    // borderColor={{
    //   from: "color",
    //   modifiers: [["darker", 0.2]],
    // }}
    enableArcLabels={false}
    enableArcLinkLabels={false}
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

export default PieChart
