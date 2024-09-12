import { Box } from "app/[locale]/(components)/generic/layout-elements"
import {
  aggregateGwpOrPenrt,
  gwpAggregationConfig,
} from "app/[locale]/(components)/domain-specific/modules/passport-overview/resources/resources-data-aggregation"
import { DinEnrichedBuildingComponent } from "app/[locale]/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  TextXSLeading4,
} from "app/[locale]/pdf-optimized//(components)/layout-elements"
import { PALETTE_LIFECYCLE_PHASES } from "constants/styleConstants"
import PieChartLegendTable from "./PieChartLegendTable"
import ResourcesDonutChart from "./ResourcesDonutChart"

type GwpSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const GwpSection = ({ dinEnrichedBuildingComponents, nrf }: GwpSectionProps) => {
  const keys = ["aggregatedValue"]

  const aggregatedGwp = aggregateGwpOrPenrt(dinEnrichedBuildingComponents, gwpAggregationConfig)
  const aggregatedGwpTotal = Math.round(aggregatedGwp.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0))
  const aggregatedGwpTotalPerNrf = (aggregatedGwpTotal / nrf).toFixed(2)

  const colorPalette: string[] = PALETTE_LIFECYCLE_PHASES

  const aggregatedGwpWithColors = aggregatedGwp.map((data, idx) => ({
    ...data,
    color: colorPalette[idx % colorPalette.length]!,
  }))

  const colorMapper = (datum: any) => {
    return datum.data.color
  }

  // TODO: it's nto DRY since it's replicated also in the web version
  // (and it's even multiplicated by 2) since it's the same situation for penrt

  const grayEmissionsTotal = aggregatedGwpWithColors
    .filter((data) => data.pattern === "dots")
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const legendTableData = [
    ...aggregatedGwpWithColors.map((data) => ({
      color: data.color,
      name: data.lifecycleSubphaseName,
      value: data.aggregatedValue,
      percentage: data.aggregatedValuePercentage,
    })),
    {
      color: "white",
      name: "Graue Emissionen",
      value: grayEmissionsTotal,
      pattern: "dots",
    },
  ]

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Global Warming Potential (GWP)" />
      <ModuleSectionMain height={68}>
        {" "}
        <Box isCol>
          <Box>
            <Box height={24}>
              {" "}
              <ResourcesDonutChart
                colors={colorMapper}
                data={aggregatedGwpWithColors}
                indexBy={"costGroupCategoryNumberAndName"}
                keys={keys}
                patternPropertyName="pattern"
              />
            </Box>
            <Box>
              <div className="m-[4pt] text-[5.76]">
                <div className="mb-[4pt]">
                  <TextXSLeading4 light>Flachenbezogen</TextXSLeading4>
                  <br />
                  <TextXSLeading4 semiBold>{aggregatedGwpTotalPerNrf} kg CO2-eq/m2 NRF</TextXSLeading4>
                </div>
                <div>
                  <TextXSLeading4 light>Gesamt</TextXSLeading4>
                  <br />
                  <TextXSLeading4>{aggregatedGwpTotal} t CO2-eq</TextXSLeading4>
                </div>
              </div>
            </Box>
          </Box>
          <Box>
            <PieChartLegendTable data={legendTableData} unit="kg CO2-eq" />
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default GwpSection
