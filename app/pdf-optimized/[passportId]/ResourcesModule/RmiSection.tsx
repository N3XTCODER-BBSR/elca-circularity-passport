import { Box } from "app/(components)/(generic)/layout-elements"
import { aggregateRmiData } from "app/(modules)/(passport-overview)/resources/resources-data-aggregation"
import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  TextXSLeading4,
} from "app/pdf-optimized/(components)/layout-elements"
import PieChartLegendTable from "./PieChartLegendTable"
import ResourcesPieChart from "./ResourcesPieChart"

type RmiSectionProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const RmiSection = ({ dinEnrichedBuildingComponents, nrf }: RmiSectionProps) => {
  const aggregatedDataRmiRenewable = aggregateRmiData(
    dinEnrichedBuildingComponents,
    [
      { propertyName: "rmiForestry", labelName: "Forst" },
      { propertyName: "rmiAgrar", labelName: "Agrar" },
      { propertyName: "rmiAqua", labelName: "Wasser" },
    ],
    nrf
  )

  const aggregatedDataRmiNonRenewable = aggregateRmiData(
    dinEnrichedBuildingComponents,
    [
      { propertyName: "rmiFossil", labelName: "Fossil" },
      { propertyName: "rmiMetallic", labelName: "Metallisch" },
      { propertyName: "rmiMineral", labelName: "Mineralisch" },
    ],
    nrf
  )

  const aggregatedDataRmi = aggregateRmiData(
    dinEnrichedBuildingComponents,
    [
      { propertyName: "rmiFossil", labelName: "Fossil" },
      { propertyName: "rmiMetallic", labelName: "Metallisch" },
      { propertyName: "rmiMineral", labelName: "Mineralisch" },
      { propertyName: "rmiForestry", labelName: "Forst" },
      { propertyName: "rmiAgrar", labelName: "Agrar" },
      { propertyName: "rmiAqua", labelName: "Wasser" },
    ],
    nrf
  )

  const keys = ["aggregatedValue"]

  const colorsMapper = (datum: any) => {
    const colorsMapping = {
      Forst: "#7DC0A6",
      Wasser: "#8ECAC4",
      Agrar: "#B3DBB8",
      Mineralisch: "#E1E7EF",
      Metallisch: "#CBD5E1",
      Fossil: "#94A3B8",
    }

    return colorsMapping[datum.id as keyof typeof colorsMapping]
  }

  const legendTableData = aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage.map((data) => ({
    color: colorsMapper({ id: data.resourceTypeName }),
    name: data.resourceTypeName,
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
                colors={colorsMapper}
                data={aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage}
                indexBy={"resourceTypeName"}
                keys={keys}
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
            <PieChartLegendTable data={legendTableData} />
            {/* <div className="overflow-x-auto text-[6pt]"> */}
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
