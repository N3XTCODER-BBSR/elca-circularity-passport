import { ResponsiveBar } from "@nivo/bar"
import CustomTooltip from "app/(components)/generic/CustomToolTip"
import { eolClassColorsMapper } from "constants/styleConstants"
import { twMerge } from "tailwind-merge"

const CircularityIndexBarChartBreakdown = ({
  margin,
  data,
  clickHandler,
}: {
  data: { datum: number; identifier: string }[]
  margin: { top: number; right: number; bottom: number; left: number }
  clickHandler: (clickedLabel: string) => void
}) => {
  return (
    <>
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
        keys={["datum"]}
        colors={(datum) => {
          if (datum.data.datum > 60) return "#008000"
          if (datum.data.datum >= 40) return "#00FF00"
          if (datum.data.datum >= 20) return "#FFFF00"
          if (datum.data.datum < 20) return "#FF0000"

          return "#FF0000"
        }}
        padding={0.2}
        groupMode="grouped"
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
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
          renderTick: (tick) => {
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
        }}
        totalsOffset={9}
        animate={false}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        role="application"
      />
    </>
  )
}

export default CircularityIndexBarChartBreakdown
