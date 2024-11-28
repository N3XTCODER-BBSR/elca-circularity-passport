import { ResponsiveBar } from "@nivo/bar"
import CustomTooltip from "app/(components)/generic/CustomToolTip"
import { eolClassColorsMapper } from "constants/styleConstants"

const CircularityIndexTotalBarChart = ({
  circularityTotalIndexPoints,
  margin,
}: {
  circularityTotalIndexPoints: number
  margin: { top: number; right: number; bottom: number; left: number }
}) => {
  return (
    <>
      circularityTotalIndexPoints: {circularityTotalIndexPoints}
      FOO
      <ResponsiveBar
        //   animate={!isPdf}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: "0.8rem",
              },
            },
          },
        }}
        data={[{ datum: circularityTotalIndexPoints, identifier: "Gesamt" }]}
        //   keys={["circularityIndexPoints"]}
        indexBy="identifier"
        margin={margin}
        keys={["datum"]}
        colors={() => "#eaeee5"}
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

export default CircularityIndexTotalBarChart
