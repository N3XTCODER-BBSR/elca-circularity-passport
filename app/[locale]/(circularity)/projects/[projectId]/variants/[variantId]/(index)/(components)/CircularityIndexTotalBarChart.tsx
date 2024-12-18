import { ResponsiveBar } from "@nivo/bar"
import { useFormatter } from "next-intl"
import { circularityBarCharColorMapping } from "constants/styleConstants"

const CircularityIndexTotalBarChart = ({
  circularityTotalIndexPoints,
  margin,
}: {
  circularityTotalIndexPoints: number
  margin: { top: number; right: number; bottom: number; left: number }
}) => {
  const format = useFormatter()

  return (
    <>
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
        data={[{ datum: circularityTotalIndexPoints, identifier: "Gesamt" }]}
        indexBy="identifier"
        margin={margin}
        keys={["datum"]}
        colors={(datum) => circularityBarCharColorMapping(datum.data.datum)}
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
        }}
        tooltip={(d) => (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <b>{d.data.identifier}</b>:{" "}
            {format.number(d.data.datum, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
          </div>
        )}
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
