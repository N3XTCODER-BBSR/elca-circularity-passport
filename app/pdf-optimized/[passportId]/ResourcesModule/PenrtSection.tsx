import { Box } from "app/(components)/(generic)/layout-elements"
import { aggregateGwpOrPenrt } from "app/(modules)/(passport-overview)/resources/resources-data-aggregation"
import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  TextXSLeading4,
} from "app/pdf-optimized/(components)/layout-elements"
import PieChartLegendTable from "./PieChartLegendTable"
import ResourcesPieChart from "./ResourcesPieChart"

type PenrtSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const PenrtSectionSection = ({ dinEnrichedBuildingComponents, nrf }: PenrtSectionProps) => {
  const keys = ["aggregatedValue"]

  const aggregatedPenrt = aggregateGwpOrPenrt(dinEnrichedBuildingComponents, "penrtAB6C")
  const aggregatedPenrtTotal = Math.round(
    aggregatedPenrt.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )
  const aggregatedPenrtTotalPerNrf = Math.round(aggregatedPenrtTotal / nrf)

  const colorPalette = ["#eaf1f6", "#c6d6e6", "#8fa6c5", "#a896c5", "#6b66aa", "#a6a3c7", "#8b83a6"]

  const aggregatedPenrtWithColors = aggregatedPenrt.map((data, idx) => ({
    ...data,
    color: colorPalette[idx % colorPalette.length]!,
  }))

  const colorMapper = (datum: any) => {
    return datum.data.color
  }

  const legendTableData = aggregatedPenrtWithColors.map((data) => ({
    color: data.color,
    name: data.categoryName,
    value: data.aggregatedValue,
    percentage: data.aggregatedValuePercentage,
  }))

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Graue Energie (PENRT)" />
      <ModuleSectionMain height={68}>
        <Box isCol>
          <Box>
            <Box height={24}>
              <ResourcesPieChart
                colors={colorMapper}
                data={aggregatedPenrtWithColors}
                indexBy={"costGroupCategoryNumberAndName"}
                keys={keys}
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
            <PieChartLegendTable data={legendTableData} />
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default PenrtSectionSection
