"use client"

import { ResponsiveBar } from "@nivo/bar"
import { useTranslations } from "next-intl"

export type MaterialsBarChartDatum = {
  groupName: string
  aggregatedMass: number
  aggregatedMassPercentage: number
}

type MaterialsBarChartProps = {
  data: MaterialsBarChartDatum[]
  labelFormatter?: (data: MaterialsBarChartDatum) => string
  isPdf?: boolean
}

const replaceWhiteSpaceWithLineBreak = (label: string) => label?.replace(/\s+/g, "\n")

const MaterialsBarChart = ({ data, labelFormatter, isPdf = false }: MaterialsBarChartProps) => {
  const t = useTranslations("Grp.Web.sections.overview.module1Materials")

  const pdfMargins = { top: 0, right: 20, bottom: 20, left: 100 }
  const webMargins = { top: 0, right: 150, bottom: 50, left: 300 }

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: isPdf ? "5pt" : "10pt",
              fontWeight: "light",
            },
          },
        },
      }}
      totalsOffset={isPdf ? 9 : 0}
      animate={!isPdf}
      enableGridX={false}
      enableGridY={false}
      keys={["aggregatedMassPercentage"]}
      indexBy={"groupName"}
      isInteractive={!isPdf}
      margin={isPdf ? pdfMargins : webMargins}
      padding={isPdf ? 0.4 : 0.2}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "category10" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      minValue={0}
      maxValue={isPdf ? "auto" : 100}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: isPdf ? -6 : 5,
        format: (value) => `${value} %`,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
        format: replaceWhiteSpaceWithLineBreak,
      }}
      tooltip={({ data }) => (
        <div
          style={{
            padding: "5px 10px",
            background: "white",
            border: "1px solid #ccc",
          }}
        >
          <strong>{data.groupName}</strong>
          <br />
          {labelFormatter != null ? labelFormatter(data) : null}
        </div>
      )}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={"white"}
      role="application"
    />
  )
}

export default MaterialsBarChart
