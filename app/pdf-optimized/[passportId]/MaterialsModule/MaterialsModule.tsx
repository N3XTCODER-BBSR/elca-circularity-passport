import { aggregateMaterialsData } from "app/(modules)/(passport-overview)/materials/materials-data-aggregation"
import { DinEnrichedPassportData } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  Box,
  ModuleContainer,
  ModuleMain,
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  ModuleTitle,
} from "app/pdf-optimized/(components)/layout-elements"
import MaterialsBarChart from "./MaterialsBarChart"

const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const aggregatedData = aggregateMaterialsData(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  // TODO: Change this so keys is not showing the costGroupCategoryID (cryptic) but the respective categoryName
  // const keys = [...buildingComponents.map((component) => component.categoryName)]

  const chartData = aggregatedData.aggretatedByCategoryWithPercentageSorted.map((data) => ({
    categoryName: `${data.categoryName} (${data.aggregatedMassPercentage.toFixed(2)}%)`,
    mass: data.aggregatedMass,
    aggregatedMassPercentage: data.aggregatedMassPercentage,
    // label is of format xx% (abc t)
    label: data.label,
  }))

  return (
    <ModuleContainer>
      <ModuleTitle title="Modul 1: Materialien" />
      <Box>
        <div className="self-start" style={{ flex: 0, flexBasis: "fit-content", marginRight: "12mm" }}>
          <dl className="mb-2">
            <dt className="text-gray-500">Gesamtmasse:</dt>
            <dd className="text-black">{aggregatedData.totalMass.toFixed(2)} t</dd>
          </dl>
        </div>
        <div className="self-start" style={{ flex: 0, flexBasis: "fit-content", marginRight: "12mm" }}>
          <dl className="mb-2">
            <dt className="text-gray-500">Flächenbezogene Masse:</dt>
            <dd className="text-black">{aggregatedData.totalMassPercentage.toFixed(2)} t</dd>
          </dl>
        </div>
      </Box>
      <ModuleMain>
        <ModuleSectionContainer>
          <ModuleSectionTitle title="Masse nach Baustoffgruppen" />
          <ModuleSectionMain height={40}>
            <MaterialsBarChart data={chartData} />
          </ModuleSectionMain>
        </ModuleSectionContainer>

        <ModuleSectionContainer>
          <ModuleSectionTitle title="Masse nach Bauteilkategorien" />
          <ModuleSectionMain height={40}>
            <MaterialsBarChart data={chartData} />
          </ModuleSectionMain>
        </ModuleSectionContainer>
      </ModuleMain>
    </ModuleContainer>
  )
}
export default BuildingInformation
