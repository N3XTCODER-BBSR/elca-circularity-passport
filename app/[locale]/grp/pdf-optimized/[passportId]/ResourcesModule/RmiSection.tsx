import { Box } from "app/[locale]/grp/(components)/generic/layout-elements"
import {
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  TextXSLeading4,
} from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { aggregateRmiData } from "domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import PieChartLegendTable from "./PieChartLegendTable"
import { rmiColorsMapper } from "constants/styleConstants"
import ResourcesPieChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesPieChart"
import { useTranslations } from "next-intl"

type RmiSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const RmiSection = ({ dinEnrichedBuildingComponents, nrf }: RmiSectionProps) => {
  const rmiTranslations = useTranslations("Grp.Pdf.sections.overview.module2Resources.rmi")

  const aggregatedDataRmiRenewable = aggregateRmiData(
    dinEnrichedBuildingComponents,
    // TODO: extract these to a constant into domain-logic
    "renewable",
    nrf
  )

  const aggregatedDataRmiNonRenewable = aggregateRmiData(
    dinEnrichedBuildingComponents,
    // TODO: extract these to a constant into domain-logic
    "nonRenewable",
    nrf
  )

  const aggregatedDataRmi = aggregateRmiData(
    dinEnrichedBuildingComponents,
    // TODO: extract these to a constant into domain-logic (and just merge the two arrays already defined on top for this one here)
    "all",
    nrf
  )

  const legendTableData = aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage.map((data) => ({
    color: rmiColorsMapper(data.resourceTypeName),
    name: rmiTranslations(`names.${data.resourceTypeName}`),
    value: data.aggregatedValue,
    percentage: data.percentageValue,
  }))

  return (
    <ModuleSectionContainer>
      <ModuleSectionTitle title="Rohstoff-einsatz (RMI)" />
      <ModuleSectionMain height={68}>
        <Box isCol>
          <Box>
            <Box height={24}>
              <ResourcesPieChart
                colors={rmiColorsMapper}
                data={aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage}
                isPdf={true}
              />
            </Box>
            <Box>
              <div className="m-[4pt] text-[5.76]">
                <div className="mb-[4pt]">
                  <TextXSLeading4 light>Flachenbezogen</TextXSLeading4>
                  <br />
                  <TextXSLeading4 semiBold>
                    {aggregatedDataRmi.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
                  </TextXSLeading4>
                </div>
                <div>
                  <TextXSLeading4 light>Gesamt</TextXSLeading4>
                  <br />
                  <TextXSLeading4>{aggregatedDataRmi.aggregatedDataTotal} t</TextXSLeading4>
                </div>
              </div>
            </Box>
          </Box>
          <Box>
            <PieChartLegendTable data={legendTableData} unit="t" />
          </Box>
          <Box>
            <table className="mt-[2mm] min-w-full overflow-x-auto bg-gray-50 text-[6pt]">
              <tbody>
                <tr>
                  <td className="whitespace-nowrap py-[1mm]">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900">Erneuerbar</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
                    {aggregatedDataRmiRenewable.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
                  </td>
                  <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
                    {aggregatedDataRmiRenewable.aggregatedDataTotal.toFixed(2)} t
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-[1mm]">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900">Nicht erneuerbar</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
                    {aggregatedDataRmiNonRenewable.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
                  </td>
                  <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
                    {aggregatedDataRmiNonRenewable.aggregatedDataTotal.toFixed(2)} t
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </ModuleSectionMain>
    </ModuleSectionContainer>
  )
}

export default RmiSection
