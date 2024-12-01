import { ResponsiveBar } from "@nivo/bar"
import CustomTooltip from "app/(components)/generic/CustomToolTip"
import { eolClassColorsMapper } from "constants/styleConstants"
import { twMerge } from "tailwind-merge"

const CustomButtonsLayer = (props) => {
  const { bars, width, height, margin } = props

  console.log("FOO props", props)

  return (
    <div
      style={{
        backgroundColor: "red",
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        pointerEvents: "none", // Ensure that events pass through
      }}
    >
      {bars.map((bar) => {
        const handleClick = () => {
          // Your click handler logic
          console.log(`Bar ${bar.data.indexValue} clicked`)
        }

        return (
          <button
            key={bar.key}
            onClick={handleClick}
            style={{
              position: "absolute",
              top: bar.y + margin.top - 10, // Adjust as needed
              left: 0,
              width: "300px",
              height: "20px",
              backgroundColor: "#fff",
              border: "none",
              textAlign: "left",
              padding: "0 10px",
              cursor: "pointer",
              pointerEvents: "auto", // Enable pointer events
            }}
          >
            <span style={{ fontWeight: "bold", color: "#000" }}>{bar.data.indexValue} FOO</span>
            <span
              style={{
                float: "right",
                backgroundColor: "#fff",
                border: "1px solid #000",
                borderRadius: "2px",
                padding: "2px 5px",
                height: "5px",
                lineHeight: "5px",
                color: "#000",
              }}
            >
              2
            </span>
          </button>
        )
      })}
    </div>
  )
}

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
        layers={["grid", "axes", "bars", "markers", "legends", CustomButtonsLayer]}
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
        // axisLeft={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legendPosition: "middle",
        //   legendOffset: -40,
        //   truncateTickAt: 0,
        // renderTick: (tick) => {
        //   const handleClick = () => {
        //     // Your click handler logic here
        //     console.log(`Tick ${tick.value} clicked`)
        //   }

        //   // Button dimensions and styling
        //   const buttonWidth = 300
        //   const buttonHeight = 20
        //   const buttonPadding = 10

        //   // Badge dimensions and styling
        //   const badgeText = '2' // Static number
        //   const badgePadding = 2
        //   const badgeBorderRadius = 2
        //   const badgeHeight = 5 // As per your requirement
        //   const badgeWidth = 20 // Adjust as needed for text width

        //   // Calculate positions
        //   const buttonX = -buttonWidth
        //   const buttonY = -buttonHeight / 2
        //   const leftTextX = buttonX + buttonPadding
        //   const leftTextY = 5 // Vertically centered
        //   const badgeX = -badgeWidth - buttonPadding
        //   const badgeY = -badgeHeight / 2

        //   return (
        //     <g
        //       transform={`translate(${tick.x},${tick.y})`}
        //       onClick={handleClick}
        //       style={{ cursor: 'pointer' }}
        //     >
        //       {/* Button Background */}
        //       <rect
        //         x={buttonX}
        //         y={buttonY}
        //         width={buttonWidth}
        //         height={buttonHeight}
        //         fill="#fff"
        //         rx={4}
        //         ry={4}
        //       />
        //       {/* Left-Aligned Text */}
        //       <text
        //         x={leftTextX}
        //         y={leftTextY}
        //         textAnchor="start"
        //         fontSize="12px"
        //         fill="#000"
        //         fontWeight="bold"
        //       >
        //         {tick.value}
        //       </text>
        //       {/* Badge Border */}
        //       <rect
        //         x={badgeX}
        //         y={badgeY}
        //         width={badgeWidth}
        //         height={badgeHeight + badgePadding * 2}
        //         fill="none"
        //         stroke="#000"
        //         strokeWidth="1"
        //         rx={badgeBorderRadius}
        //         ry={badgeBorderRadius}
        //       />
        //       {/* Badge Text */}
        //       <text
        //         x={badgeX + badgeWidth / 2}
        //         y={leftTextY}
        //         textAnchor="middle"
        //         fontSize="12px"
        //         fill="#000"
        //       >
        //         {badgeText}
        //       </text>
        //     </g>
        //   )
        // },
        // }}
        axisLeft={null}
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
