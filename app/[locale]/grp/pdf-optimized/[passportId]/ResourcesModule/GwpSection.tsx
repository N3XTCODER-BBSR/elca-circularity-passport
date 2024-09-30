import { useTranslations } from "next-intl"
import ResourcesPenrtGwpDonutChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesPenrtGwpDonutChart"
import { Box } from "app/[locale]/grp/(components)/generic/layout-elements"
import {
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  TextXSLeading4,
} from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { lifeCycleSubPhasesColorsMapper } from "constants/styleConstants"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { aggregateGwpData } from "domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import ResourcesChartLegendTable, { LegendTableDataItem } from "./ResourcesChartLegendTable"

type GwpSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const GwpSection = ({ dinEnrichedBuildingComponents, nrf }: GwpSectionProps) => {
  const t = useTranslations("Grp.Pdf.sections.overview.module2Resources")

  const {
    aggregatedData: aggregatedGwpData,
    aggregatedDataTotal: aggregatedGwpTotal,
    aggregatedDataTotalPerNrf: aggregatedGwpTotalPerNrf,
  } = aggregateGwpData(dinEnrichedBuildingComponents, nrf)

  const grayEmissionsTotal = aggregatedGwpData
    .filter((data) => data.isGray)
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const gwpLegendTableData: LegendTableDataItem[] = aggregatedGwpData.map((data, idx) => ({
    color: lifeCycleSubPhasesColorsMapper(data.lifecycleSubphaseId),
    name: t(`gwpAndPenrt.lifeCycleSubPhases.${data.lifecycleSubphaseId}`),
    value: data.aggregatedValue,
    percentage: data.aggregatedValuePercentage,
    pattern: data.isGray ? "dots" : undefined,
  }))

  gwpLegendTableData.push({
    color: "white",
    name: t("gwpAndPenrt.gwp.grayEmissionsTotal"),
    value: grayEmissionsTotal,
    pattern: "dots",
  })

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Global Warming Potential (GWP)" />
      <ModuleSectionMain height={68}>
        {" "}
        <Box isCol>
          <Box>
            <Box height={24}>
              {" "}
              <ResourcesPenrtGwpDonutChart
                colors={lifeCycleSubPhasesColorsMapper}
                data={aggregatedGwpData}
                isPdf={true}
              />
            </Box>
            <Box>
              <div className="m-[4pt] text-[5.76]">
                <div className="mb-[4pt]">
                  <TextXSLeading4 light>Flachenbezogen</TextXSLeading4>
                  <br />
                  <TextXSLeading4 semiBold>{aggregatedGwpTotalPerNrf.toFixed(2)} kg CO2-eq/m2 NRF</TextXSLeading4>
                </div>
                <div>
                  <TextXSLeading4 light>Gesamt</TextXSLeading4>
                  <br />
                  <TextXSLeading4>{aggregatedGwpTotal.toFixed(2)} t CO2-eq</TextXSLeading4>
                </div>
              </div>
            </Box>
          </Box>
          <Box>
            <ResourcesChartLegendTable data={gwpLegendTableData} unit="kg CO2-eq" />
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default GwpSection
