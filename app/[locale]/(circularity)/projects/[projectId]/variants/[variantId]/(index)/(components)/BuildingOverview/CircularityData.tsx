"use client"
import { FC, useState } from "react"
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
import CircularityIndexTotalNumber from "../CircularityIndexTotalNumber"

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
  const [selectedMetricType, setSelectedMetricType] = useState<MetricType>("circularityIndex")

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
          <span>{selectedMetricOptionName}</span>
        </h2>
        <div className="flex w-1/4 justify-end">
          {selectedMetricType === "eolBuiltPoints" && (
            <AggregatedInventoryCsvExportButton projectName={projectName} circularityData={circularityData} />
          )}
        </div>
      </div>

      <div>
        <CircularityIndexTotalNumber
          circularityIndexPoints={totalMetricValues[selectedMetricType]}
          metricType={selectedMetricType}
        />
      </div>

      <CircularityIndexBreakdownByDin
        key={`din-breakdown-${selectedMetricType}`}
        dimensionalFieldName={dimensionalFieldName}
        circularityData={circularityData}
        projectName={projectName}
        catalogPath={catalogPath}
        metricType={selectedMetricType}
      />

      <CircularityIndexBreakdownByMaterialType
        key={`material-breakdown-${selectedMetricType}`}
        dimensionalFieldName={dimensionalFieldName}
        catalogPath={catalogPath}
        projectName={projectName}
        processCategories={processCategories}
        circularityData={circularityData}
        margin={{ top: 0, right: 50, bottom: 50, left: 180 }}
        metricType={selectedMetricType}
      />
    </>
  )
}

export default CircularityData
