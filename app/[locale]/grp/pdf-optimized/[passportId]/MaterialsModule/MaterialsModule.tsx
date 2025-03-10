/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { useFormatter, useTranslations } from "next-intl"
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
  const format = useFormatter()

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

  const unit = unitsTranslations("Kg.short")

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
                  {format.number(aggregatedDataByBuildingComponentCategory.totalMassRelativeToNrf, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {unit}/m2 NRF
                </TextXSLeading4>
              </dl>
            </div>
            <div className="self-start" style={{ flex: 0, flexBasis: "fit-content", marginRight: "12mm" }}>
              <dl className="mb-2">
                <TextXSLeading4 light>Gesamt: </TextXSLeading4>
                <TextXSLeading4 semiBold>
                  {format.number(aggregatedDataByBuildingComponentCategory.totalMass, { maximumFractionDigits: 2 })}{" "}
                  {unit}
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
