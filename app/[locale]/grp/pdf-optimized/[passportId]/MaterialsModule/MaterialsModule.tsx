import MaterialsBarChart, {
  MaterialsBarChartDatum,
} from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/materials/MaterialsBarChart"
import {
  Box,
  ModuleContainer,
  ModuleMain,
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  ModuleTitle,
  TextXSLeading4,
} from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  AggregatedMaterialsData,
  AggregatedMaterialsDataByMaterial,
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "lib/domain-logic/grp/modules/passport-overview/materials/materials-data-aggregation"

const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const aggregatedDataByBuildingComponentCategory: AggregatedMaterialsData =
    aggregateMaterialsDataByBuildingComponentCategory(
      dinEnrichedPassportData.dinEnrichedBuildingComponents,
      dinEnrichedPassportData.buildingBaseData.nrf
    )

  const aggregatedDataByByMaterialClass: AggregatedMaterialsDataByMaterial = aggregateMaterialsDataByMaterialClass(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const chartDataGroupedByBuildingMaterialClass: MaterialsBarChartDatum[] =
    aggregatedDataByByMaterialClass.aggregatedByClassId.map((data) => ({
      groupName: data.materialClassDescription,
      aggregatedMass: data.aggregatedMass,
      aggregatedMassPercentage: data.aggregatedMassPercentage,
    }))

  const chartDataGroupedByBuildingComponentCategory: MaterialsBarChartDatum[] =
    aggregatedDataByBuildingComponentCategory.aggregatedByCategory.map((data) => ({
      groupName: data.costGroupCategoryName,
      aggregatedMass: data.aggregatedMass,
      aggregatedMassPercentage: data.aggregatedMassPercentage,
    }))

  return (
    <ModuleContainer>
      <ModuleTitle title="Modul 1: Materialien" />

      <ModuleMain>
        <ModuleSectionContainer>
          <ModuleSectionTitle title="Masse" />
          <Box>
            <div className="self-start" style={{ flex: 0, flexBasis: "fit-content", marginRight: "12mm" }}>
              <dl className="mb-2">
                <TextXSLeading4 light>Flächenbezogen: </TextXSLeading4>
                <TextXSLeading4 semiBold>
                  {aggregatedDataByBuildingComponentCategory.totalMassRelativeToNrf.toFixed(2)} t
                </TextXSLeading4>
              </dl>
            </div>
            <div className="self-start" style={{ flex: 0, flexBasis: "fit-content", marginRight: "12mm" }}>
              <dl className="mb-2">
                <TextXSLeading4 light>Gesamt: </TextXSLeading4>
                <TextXSLeading4 semiBold>
                  {aggregatedDataByBuildingComponentCategory.totalMass.toFixed(2)} t
                </TextXSLeading4>
              </dl>
            </div>
          </Box>
          <ModuleMain>
            <ModuleSectionContainer>
              <TextXSLeading4 light>Nach Bauteilkategorien</TextXSLeading4>
              <ModuleSectionMain height={40}>
                <MaterialsBarChart data={chartDataGroupedByBuildingComponentCategory} isPdf />
              </ModuleSectionMain>
            </ModuleSectionContainer>

            <ModuleSectionContainer>
              <TextXSLeading4 light>Nach Baustoffgruppen</TextXSLeading4>
              <ModuleSectionMain height={40}>
                <MaterialsBarChart data={chartDataGroupedByBuildingMaterialClass} isPdf />
              </ModuleSectionMain>
            </ModuleSectionContainer>
          </ModuleMain>
        </ModuleSectionContainer>
      </ModuleMain>
    </ModuleContainer>
  )
}
export default BuildingInformation
