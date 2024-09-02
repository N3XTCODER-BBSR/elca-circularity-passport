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

type GwpSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const GwpSection = ({ dinEnrichedBuildingComponents, nrf }: GwpSectionProps) => {
  const keys = ["aggregatedValue"]

  const aggregatedGwp = aggregateGwpOrPenrt(dinEnrichedBuildingComponents, "gwpAB6C")
  const aggregatedGwpTotal = Math.round(aggregatedGwp.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0))
  const aggregatedGwpTotalPerNrf = (aggregatedGwpTotal / nrf).toFixed(2)

  const colorPalette = ["#eaf1f6", "#c6d6e6", "#8fa6c5", "#a896c5", "#6b66aa", "#a6a3c7", "#8b83a6"]

  const aggregatedGwpWithColors = aggregatedGwp.map((data, idx) => ({
    color: colorPalette[idx % colorPalette.length]!,
    categoryName: data.categoryName,
    aggregatedValue: data.aggregatedValue,
    aggregatedValuePercentage: data.aggregatedValuePercentage,
  }))

  const colorMapper = (datum: any) => {
    return datum.data.color
  }

  const legendTableData = aggregatedGwpWithColors.map((data) => ({
    color: data.color,
    name: data.categoryName,
    value: data.aggregatedValue,
    percentage: data.aggregatedValuePercentage,
  }))

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Global Warming Potential (GWP)" />
      <ModuleSectionMain height={68}>
        {" "}
        <Box isCol>
          <Box>
            <Box height={24}>
              {" "}
              <ResourcesPieChart
                // colors={{ datum: "color" }}
                colors={colorMapper}
                data={aggregatedGwpWithColors}
                indexBy={"costGroupCategoryNumberAndName"}
                keys={keys}
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
            <PieChartLegendTable data={legendTableData} />
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default GwpSection
