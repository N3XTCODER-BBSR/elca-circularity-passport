import { useTranslations } from "next-intl"
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
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "lib/domain-logic/grp/modules/passport-overview/materials/materials-data-aggregation"

const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const t = useTranslations("Grp.Web.sections.overview.module1Materials")
  const tCostGroups = useTranslations("Common.costGroups")
  const tMaterialClasses = useTranslations("Common.materialClasses")
  const unitsTranslations = useTranslations("Units")

  const aggregatedDataByBuildingComponentCategory = aggregateMaterialsDataByBuildingComponentCategory(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const aggregatedDataByMaterialClass = aggregateMaterialsDataByMaterialClass(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const chartDataGroupedByMaterialClass: MaterialsBarChartDatum[] =
    aggregatedDataByMaterialClass.aggregatedByClassId.map((data) => {
      return {
        groupName: data.materialClassDescription,
        groupId: data.materialClassId,
        identifier: tMaterialClasses(`${data.materialClassId.replace(/\./g, "_")}`),
        aggregatedMassPercentage: data.aggregatedMassPercentage,
        aggregatedMass: data.aggregatedMass,
      }
    })

  const chartDataGroupedByComponentCategory: MaterialsBarChartDatum[] =
    aggregatedDataByBuildingComponentCategory.aggregatedByCategory.map((data) => {
      return {
        groupName: data.costGroupCategoryName,
        groupId: data.costGroupCategoryId.toString(),
        identifier: data.costGroupCategoryId + " " + tCostGroups(`${data.costGroupCategoryId}`),
        aggregatedMassPercentage: data.aggregatedMassPercentage,
        aggregatedMass: data.aggregatedMass,
      }
    })

  const totalMass = aggregatedDataByBuildingComponentCategory.totalMass
  const totalMassRelativeToNrf = aggregatedDataByBuildingComponentCategory.totalMassRelativeToNrf

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
                <MaterialsBarChart data={chartDataGroupedByComponentCategory} isPdf />
              </ModuleSectionMain>
            </ModuleSectionContainer>

            <ModuleSectionContainer>
              <TextXSLeading4 light>Nach Baustoffgruppen</TextXSLeading4>
              <ModuleSectionMain height={40}>
                <MaterialsBarChart data={chartDataGroupedByMaterialClass} isPdf />
              </ModuleSectionMain>
            </ModuleSectionContainer>
          </ModuleMain>
        </ModuleSectionContainer>
      </ModuleMain>
    </ModuleContainer>
  )
}
export default BuildingInformation
