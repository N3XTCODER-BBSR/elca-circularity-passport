import { ResponsiveBar } from "@nivo/bar"
import CustomTooltip from "app/(components)/generic/CustomToolTip"
import { eolClassColorsMapper } from "constants/styleConstants"
import { twMerge } from "tailwind-merge"

const CircularityIndexBarChartBreakdown = ({
  //   circularityTotalIndexPoints,
  margin,
  data,
}: {
  //   circularityTotalIndexPoints: number
  data: { datum: number; identifier: string }[]
  // [{ datum: circularityTotalIndexPoints, identifier: "Gesamt" }]
  margin: { top: number; right: number; bottom: number; left: number }
}) => {
  return (
    <>
      {/* circularityTotalIndexPoints: {circularityTotalIndexPoints}
      FOO */}
      <ResponsiveBar
        //   animate={!isPdf}
        data={data}
        // data={(data) => ({
        //   datum: data.
        // })}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: "0.8rem",
              },
            },
          },
        }}
        //   keys={["circularityIndexPoints"]}
        indexBy="identifier"
        margin={margin}
        keys={["datum"]}
        colors={(datum) => {
          // dark green	>60
          // green	40-60
          // yellow	20-40
          // red	<20

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
        //   colors={(d) => eolClassColorsMapper(d.data.eolClass)}
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
              // Your click handler logic here
              alert(`Tick ${tick.value} clicked`)
            }

            return (
              <g transform={`translate(${tick.x},${tick.y})`} onClick={handleClick} style={{ cursor: "pointer" }}>
                <rect x={-100} y={-10} width={100} height={20} fill="#e0e0e0" rx={4} ry={4} />
                <text x={-50} y={5} textAnchor="middle" fontSize="0.8rem" fill="#000">
                  {tick.value}
                </text>
              </g>
            )
          },
        }}
        //   tooltip={(datum) => <CustomTooltip value={datum.data.overlayText} />}
        totalsOffset={9}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        role="application"
      />
    </>
  )
}

export default CircularityIndexBarChartBreakdown
