"use client"

import { ResponsivePie } from "@nivo/pie"
import { useTranslations } from "next-intl"
import CustomTooltip from "app/(components)/generic/CustomToolTip"
import { LifeCycleSubPhaseId } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import type { AggregatedGwpOrPenrtData } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"

type Colors = (lifeCycleSubPhaseId: LifeCycleSubPhaseId) => string

type ResourcesPenrtGwpDonutChartProps = {
  data: AggregatedGwpOrPenrtData[]
  colors?: Colors
  isPdf?: boolean
  overlayLabelTranslationKey?: string
}

type ComputedDatum = {
  id: string
  label: string
  arcLinkLabel: string
  value: number
  color: string
  pattern?: string
}

const ResourcesPenrtGwpDonutChart = ({
  data,
  colors = (resourceTypeName: LifeCycleSubPhaseId) => "",
  isPdf,
  overlayLabelTranslationKey,
}: ResourcesPenrtGwpDonutChartProps) => {
  const translations = useTranslations("Grp.Web.sections.overview.module2Resources.gwpAndPenrt")

  const cornerRadius = isPdf ? 0 : 3
  const padAngle = isPdf ? 0 : 0.7
  const margins = isPdf ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 20, right: 20, bottom: 40, left: 20 }

  if (overlayLabelTranslationKey == null && !isPdf) {
    console.error("overlayLabelTranslationKey needs to be set when isPdf=false")
    return null
  }

  return (
    <ResponsivePie
      data={data.map((d) => {
        const label = translations(overlayLabelTranslationKey, {
          aggregatedValue: d.aggregatedValue,
          percentageValue: d.aggregatedValuePercentage / 100,
        })

        const compudatedDatum: ComputedDatum = {
          id: d.lifecycleSubphaseId,
          label,
          arcLinkLabel: translations(`lifeCycleSubPhases.${d.lifecycleSubphaseId}`),
          value: d.aggregatedValue,
          pattern: d.isGray ? "dots" : undefined,
          color: colors(d.lifecycleSubphaseId),
        }

        return compudatedDatum
      })}
      activeOuterRadiusOffset={8}
      enableArcLabels={false}
      arcLinkLabel={(e) => `${e.data.arcLinkLabel}`}
      innerRadius={0.6}
      padAngle={padAngle}
      cornerRadius={cornerRadius}
      margin={margins}
      borderWidth={0}
      colors={(datum) => datum.data.color}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(0, 0, 0, 0.15)",
          size: isPdf ? 4 : 12,
          padding: isPdf ? 1 : 3,
          stagger: true,
        },
      ]}
      fill={[
        {
          match: (d) => d.data.pattern === "dots",
          id: "dots",
        },
      ]}
      tooltip={(datum) => <CustomTooltip value={datum.datum.label as string} />}
      enableArcLinkLabels={!isPdf}
      isInteractive={!isPdf}
      animate={!isPdf}
    />
  )
}

export default ResourcesPenrtGwpDonutChart
