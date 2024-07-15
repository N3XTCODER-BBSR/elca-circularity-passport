"use client"

import { BarDatum, ResponsiveBar } from "@nivo/bar"

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const BarChart = ({ data, indexBy, keys, labelKey }: { data: BarDatum[]; indexBy: string; keys: string[], labelKey: string }) => (
  <>
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.2}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "category10" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
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
      tooltip={() => null}
      totalsOffset={9}
      enableLabel={true}
      label={(e) => `${e.data[labelKey]}`}
      // labelPosition="end"
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={"white"}
      // labelTextColor={{
      //   from: "color",
      //   modifiers: [["darker", 1.6]],
      // }}
      //   legends={[
      //     {
      //       dataFrom: "keys",
      //       anchor: "bottom-right",
      //       direction: "column",
      //       justify: false,
      //       translateX: 120,
      //       translateY: 0,
      //       itemsSpacing: 2,
      //       itemWidth: 100,
      //       itemHeight: 20,
      //       itemDirection: "left-to-right",
      //       itemOpacity: 0.85,
      //       symbolSize: 20,
      //       effects: [
      //         {
      //           on: "hover",
      //           style: {
      //             itemOpacity: 1,
      //           },
      //         },
      //       ],
      //     },
      //   ]}
      role="application"
      //   ariaLabel="Nivo bar chart demo"
      //   barAriaLabel={(e) => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
    />
  </>
)

export default BarChart
