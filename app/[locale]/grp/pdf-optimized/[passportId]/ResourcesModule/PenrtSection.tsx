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
import { aggregatePenrtData } from "domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import ResourcesChartLegendTable, { LegendTableDataItem } from "./ResourcesChartLegendTable"

type PenrtSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
}

const PenrtSection = ({ dinEnrichedBuildingComponents, nrf }: PenrtSectionProps) => {
  const t = useTranslations("Grp.Pdf.sections.overview.module2Resources")
  const {
    aggregatedData: aggregatedPenrtData,
    aggregatedDataTotal: aggregatedPenrtTotal,
    aggregatedDataTotalPerNrf: aggregatedPenrtTotalPerNrf,
  } = aggregatePenrtData(dinEnrichedBuildingComponents, nrf)

  const grayEnergyTotal = aggregatedPenrtData
    .filter((data) => data.isGray)
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const penrtLegendTableData: LegendTableDataItem[] = aggregatedPenrtData.map((data) => ({
    color: lifeCycleSubPhasesColorsMapper(data.lifecycleSubphaseId),
    name: t(`gwpAndPenrt.lifeCycleSubPhases.${data.lifecycleSubphaseId}`),
    value: data.aggregatedValue,
    percentage: data.aggregatedValuePercentage,
    isGray: data.isGray,
  }))

  penrtLegendTableData.push({
    color: "white",
    name: t("gwpAndPenrt.penrt.grayEnergyTotal"),
    value: grayEnergyTotal,
    pattern: "dots",
  })

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Graue Energie (PENRT)" />
      <ModuleSectionMain height={68}>
        <Box isCol>
          <Box>
            <Box height={24}>
              <ResourcesPenrtGwpDonutChart
                colors={lifeCycleSubPhasesColorsMapper}
                data={aggregatedPenrtData}
                isPdf={true}
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
            <ResourcesChartLegendTable data={penrtLegendTableData} unit="KwH" />
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default PenrtSection
