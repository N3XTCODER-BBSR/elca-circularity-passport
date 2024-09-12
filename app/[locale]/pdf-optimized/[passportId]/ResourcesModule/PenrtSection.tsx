import { Box } from "app/[locale]/(components)/(generic)/layout-elements"
import {
  aggregateGwpOrPenrt,
  penrtAggregationConfig,
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

type PenrtSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const PenrtSectionSection = ({ dinEnrichedBuildingComponents, nrf }: PenrtSectionProps) => {
  const keys = ["aggregatedValue"]

  const aggregatedPenrt = aggregateGwpOrPenrt(dinEnrichedBuildingComponents, penrtAggregationConfig)
  const aggregatedPenrtTotal = Math.round(
    aggregatedPenrt.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )
  const aggregatedPenrtTotalPerNrf = Math.round(aggregatedPenrtTotal / nrf)

  const colorPalette: string[] = PALETTE_LIFECYCLE_PHASES

  const aggregatedPenrtWithColors = aggregatedPenrt.map((data, idx) => ({
    ...data,
    color: colorPalette[idx % colorPalette.length]!,
  }))

  const colorMapper = (datum: any) => {
    return datum.data.color
  }

  // TODO: it's nto DRY since it's replicated also in the web version
  // (and it's even multiplicated by 2) since it's the same situation for gwp

  const grayEnergyTotal = aggregatedPenrtWithColors
    .filter((data) => data.pattern === "dots")
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const legendTableData = [
    ...aggregatedPenrtWithColors.map((data) => ({
      color: data.color,
      name: data.lifecycleSubphaseName,
      value: data.aggregatedValue,
      percentage: data.aggregatedValuePercentage,
    })),
    {
      color: "white",
      name: "Graue Energie",
      value: grayEnergyTotal,
      pattern: "dots",
    },
  ]

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Graue Energie (PENRT)" />
      <ModuleSectionMain height={68}>
        <Box isCol>
          <Box>
            <Box height={24}>
              <ResourcesDonutChart
                colors={colorMapper}
                data={aggregatedPenrtWithColors}
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
                  <TextXSLeading4 semiBold>{aggregatedPenrtTotalPerNrf.toFixed(2)} KwH/m2 NRF</TextXSLeading4>
                </div>
                <div>
                  <TextXSLeading4 light>Gesamt</TextXSLeading4>
                  <br />
                  <TextXSLeading4>{aggregatedPenrtTotal.toFixed(2)} t CO2-eq</TextXSLeading4>
                </div>
              </div>
            </Box>
          </Box>
          <Box>
            <PieChartLegendTable data={legendTableData} unit="KwH" />
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default PenrtSectionSection
