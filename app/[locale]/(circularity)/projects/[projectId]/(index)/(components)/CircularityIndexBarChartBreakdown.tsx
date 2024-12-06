import React from "react"
import { ResponsiveBar } from "@nivo/bar"

type CircularityIndexBarChartBreakdownProps = {
  data: { datum: number; identifier: string }[]
  margin: { top: number; right: number; bottom: number; left: number }
  clickHandler: (clickedLabel: string) => void
}

const key = "datum"

const CircularityIndexBarChartBreakdown = ({ margin, data, clickHandler }: CircularityIndexBarChartBreakdownProps) => {
  const identifiers = new Set(data.map((d) => d[key]))
  const length = identifiers.size

  return (
    <div style={{ height: `${length * 2.25 + 5.5}rem` }} className="w-full">
      <ResponsiveBar
        data={data}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: "0.8rem",
              },
            },
          },
        }}
        indexBy="identifier"
        margin={margin}
        keys={[key]}
        colors={(datum) => mapDatumToColor(datum.data.datum)}
        padding={0.2}
        groupMode="grouped"
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        minValue={-60}
        maxValue={140}
        axisTop={null}
        axisRight={null}
        axisBottom={standardAxisProps()}
        axisLeft={customAxisLeftProps(clickHandler)}
        totalsOffset={9}
        animate={false}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        role="application"
      />
    </div>
  )
}

/** Helper functions for chart styling **/

function mapDatumToColor(value: number): string {
  if (value > 60) return "#008000"
  if (value >= 40) return "#00FF00"
  if (value >= 20) return "#FFFF00"
  return "#FF0000"
}

function standardAxisProps() {
  return {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legendPosition: "middle" as const,
    legendOffset: 32,
    truncateTickAt: 0,
  }
}

function customAxisLeftProps(clickHandler: (label: string) => void) {
  return {
    ...standardAxisProps(),
    renderTick: (tick: any) => {
      const handleClick = () => {
        clickHandler(tick.value)
      }

      return (
        <g transform={`translate(${tick.x},${tick.y})`} onClick={handleClick} style={{ cursor: "pointer" }}>
          <text x={-60} y={5} textAnchor="middle" fontWeight={"regular"} fontSize="0.8rem" fill="#000">
            {tick.value}
          </text>
        </g>
      )
    },
  }
}

export default CircularityIndexBarChartBreakdown
