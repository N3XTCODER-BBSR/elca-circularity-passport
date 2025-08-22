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
"use client"

import { FC, useState } from "react"
import { WhiteContainer } from "app/(components)/generic/layout-elements"
import { DimensionalFieldName, MetricType } from "lib/domain-logic/circularity/misc/domain-types"
import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  calculateTotalMetricValuesForProject,
  ProjectMetricValues,
} from "lib/domain-logic/circularity/utils/calculateTotalMetricValues"
import AggregatedInventoryCsvExportButton from "./CircularityDataCsvExport/AggregatedInventoryCsvExportButton"
import MetricSelector from "./MetricSelector"
import { useMetricOptions } from "../../(utils)/useMetricOptions"
import CircularityIndexBreakdownByDin from "../CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"
import CircularityIndexBreakdownByMaterialType, {
  ProcessCategory,
} from "../CircularityIndexBreakdownByMaterialType/CircularityIndexBreakdownByMaterialType"
import CircularityMetricTotalNumber from "../CircularityIndexTotalNumber"
import { chartMargin } from "lib/presentation-logic/circularity/chartHeightUtils"

/**
 * CircularityData component
 *
 * Displays circularity data for a project with metric selection functionality.
 * Renders various circularity visualizations including total numbers, breakdown by DIN categories,
 * and breakdown by material types based on the selected metric type.
 *
 * @param {Object} props - Component props
 * @param {ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]} props.circularityData - Array of elements with circularity data
 * @param {string} props.projectName - Name of the project
 * @param {string} props.catalogPath - Path to the catalog
 * @param {DimensionalFieldName} props.dimensionalFieldName - Name of the dimensional field to use for calculations
 * @param {ProcessCategory[]} props.processCategories - Array of process categories for material type breakdown
 * @returns {JSX.Element} - Rendered component
 */
const CircularityData: FC<{
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  projectName: string
  catalogPath: string
  dimensionalFieldName: DimensionalFieldName
  processCategories: ProcessCategory[]
}> = ({ circularityData, catalogPath, projectName, dimensionalFieldName, processCategories }) => {
  const [selectedMetricType, setSelectedMetricType] = useState<MetricType>("eolBuiltPoints")

  const totalMetricValues: ProjectMetricValues = calculateTotalMetricValuesForProject(
    circularityData,
    dimensionalFieldName
  )

  const handleMetricTypeChange = (metricType: MetricType) => {
    setSelectedMetricType(metricType)
  }

  const metricOptions = useMetricOptions()

  const selectedMetricOptionName = metricOptions.find((option) => option.value === selectedMetricType)?.label

  return (
    <>
      <div className="mt-4">
        <MetricSelector selectedMetricType={selectedMetricType} onMetricTypeChange={handleMetricTypeChange} />
      </div>

      <div className="flex items-center justify-between">
        <div className="w-1/4"></div> {/* Empty div for spacing */}
        <h2 className="my-14 w-2/4 text-center text-2xl">
          <b>
            <span>{selectedMetricOptionName}</span>
          </b>
        </h2>
        <div className="flex w-1/4 justify-end">
          {selectedMetricType === "eolBuiltPoints" && (
            <AggregatedInventoryCsvExportButton projectName={projectName} circularityData={circularityData} />
          )}
        </div>
      </div>

      <WhiteContainer>
        <CircularityMetricTotalNumber
          circularityMetricPoints={totalMetricValues[selectedMetricType]}
          metricType={selectedMetricType}
        />
      </WhiteContainer>

      <WhiteContainer>
        <CircularityIndexBreakdownByDin
          key={`din-breakdown-${selectedMetricType}`}
          dimensionalFieldName={dimensionalFieldName}
          circularityData={circularityData}
          projectName={projectName}
          catalogPath={catalogPath}
          metricType={selectedMetricType}
        />
      </WhiteContainer>

      <WhiteContainer>
        <CircularityIndexBreakdownByMaterialType
          key={`material-breakdown-${selectedMetricType}`}
          dimensionalFieldName={dimensionalFieldName}
          catalogPath={catalogPath}
          projectName={projectName}
          processCategories={processCategories}
          circularityData={circularityData}
          margin={chartMargin}
          metricType={selectedMetricType}
        />
      </WhiteContainer>
    </>
  )
}

export default CircularityData
