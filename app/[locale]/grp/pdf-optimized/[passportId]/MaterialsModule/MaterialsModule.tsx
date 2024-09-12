import {
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/materials/materials-data-aggregation"
import { DinEnrichedPassportData } from "app/[locale]/grp/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
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
import MaterialsBarChart from "./MaterialsBarChart"

const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const aggregatedDataByBuildingComponentCategory = aggregateMaterialsDataByBuildingComponentCategory(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const aggregatedDataByByMaterialClass = aggregateMaterialsDataByMaterialClass(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const chartDataGroupedByBuildingMaterialClass =
    aggregatedDataByByMaterialClass.aggregatedByClassIdWithPercentageSorted.map((data) => ({
      categoryName: data.materialClassDescription,
      mass: data.aggregatedMass,
      aggregatedMassPercentage: data.aggregatedMassPercentage,
      // label is of format xx% (abc t)
      label: data.label,
    }))

  const chartDataGroupedByBuildingComponentCategory =
    aggregatedDataByBuildingComponentCategory.aggretatedByCategoryWithPercentageSorted.map((data) => ({
      categoryName: data.costGroupCategoryName,
      mass: data.aggregatedMass,
      aggregatedMassPercentage: data.aggregatedMassPercentage,
      // label is of format xx% (abc t)
      label: data.label,
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
                <MaterialsBarChart data={chartDataGroupedByBuildingComponentCategory} />
              </ModuleSectionMain>
            </ModuleSectionContainer>

            <ModuleSectionContainer>
              <TextXSLeading4 light>Nach Baustoffgruppen</TextXSLeading4>
              <ModuleSectionMain height={40}>
                <MaterialsBarChart data={chartDataGroupedByBuildingMaterialClass} />
              </ModuleSectionMain>
            </ModuleSectionContainer>
          </ModuleMain>
        </ModuleSectionContainer>
      </ModuleMain>
    </ModuleContainer>
  )
}
export default BuildingInformation
