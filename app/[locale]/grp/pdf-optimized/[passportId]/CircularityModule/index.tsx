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
import CircularityBarChart, {
  CircularityBarChartDatum,
} from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/circularity/CircularityBarChart"
import {
  Box,
  ModuleContainer,
  ModuleMain,
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  ModuleTitle,
} from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import aggregateCircularityData from "lib/domain-logic/grp/modules/passport-overview/circularity/circularity-data-aggregation"

type CircularityProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  className?: string
}

const Circularity: React.FC<CircularityProps> = ({ dinEnrichedBuildingComponents }) => {
  const aggregatedData = aggregateCircularityData(dinEnrichedBuildingComponents)

  const chartDataForAvgEolPointsPerComponentCostCategory: CircularityBarChartDatum[] =
    aggregatedData.avgEolPointsPerComponentCostCategory.map((data) => {
      // TODO: use i18n here for din276CategoryName?
      const identifier = `${data.dinCategoryLevelNumber} ${data.din276CategoryName}`
      return {
        eolPoints: data.weightedAvgEolPoints,
        identifier,
        eolClass: data.eolClass,
        overlayText: `${identifier}: ${data.eolClass} (${Math.round(data.weightedAvgEolPoints)})`,
      }
    })

  const chartDataForAvgEolPoints: CircularityBarChartDatum[] = [
    {
      eolPoints: aggregatedData.totalAvgEolPoints,
      // TODO: i18n
      identifier: "Gesamt",
      eolClass: aggregatedData.totalEolClass,
      overlayText: `${aggregatedData.totalEolClass} (${Math.round(aggregatedData.totalAvgEolPoints)})`,
    },
  ]

  return (
    <ModuleContainer>
      <ModuleTitle title="Modul 3: Zirkularität" />
      <ModuleMain>
        <ModuleSectionContainer>
          <ModuleSectionTitle title="EOL Klasse gesamt" />
          <ModuleSectionMain height={40}>
            <Box isCol>
              <h2 className="text-center text-[10.56pt] font-semibold">{aggregatedData.totalEolClass}</h2>
              <CircularityBarChart
                data={chartDataForAvgEolPoints}
                isPdf={true}
                margin={{
                  top: 15,
                  right: 70,
                  bottom: 90,
                  left: 70,
                }}
              />
            </Box>
          </ModuleSectionMain>
        </ModuleSectionContainer>

        <ModuleSectionContainer>
          <ModuleSectionTitle title="EOL Klasse nach Bauteilkategorien" />
          <ModuleSectionMain height={40}>
            <CircularityBarChart
              data={chartDataForAvgEolPointsPerComponentCostCategory}
              isPdf={true}
              margin={{
                top: 0,
                right: 10,
                bottom: 50,
                left: 130,
              }}
            />
          </ModuleSectionMain>
        </ModuleSectionContainer>
      </ModuleMain>
    </ModuleContainer>
  )
}
export default Circularity
