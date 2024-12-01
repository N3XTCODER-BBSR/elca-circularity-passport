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
            return (
              // <g transform={`translate(${tick.x},${tick.y})`}>
              //   <text x={-10} y={0} dy={16} textAnchor="end" transform="rotate(-90)" fontSize="0.8rem">
              //     FOO
              //   </text>
              <button
                // onClick={() => onUpdateCateogryClick(componentsByCategory.categoryNumber)}
                type="button"
                className={twMerge(
                  // selectedCategoryNumber === componentsByCategory.categoryNumber
                  //   ? "bg-gray-50 text-indigo-600"
                  //   : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                  "group flex w-full gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
                )}
              >
                <div className="flex w-full items-center gap-x-3">
                  <div className="text-left">FOO </div>(
                  <span
                    aria-hidden="true"
                    className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                  >
                    1234
                  </span>
                  )
                </div>
              </button>
              // </g>
            )
          },
          // format: replaceWhiteSpaceWithLineBreak,
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
