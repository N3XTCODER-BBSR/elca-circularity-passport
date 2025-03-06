"use client"
import { FC, useState } from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  calculateTotalMetricValuesForProject,
  ProjectMetricValues,
} from "lib/domain-logic/circularity/utils/calculateTotalMetricValues"
import { DimensionalFieldName, MetricType } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import CircularityIndexBreakdownByMaterialType, {
  ProcessCategory,
} from "../CircularityIndexBreakdownByMaterialType/CircularityIndexBreakdownByMaterialType"
import CircularityIndexTotalNumber from "../CircularityIndexTotalNumber"
import CircularityIndexBreakdownByDin from "../CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"
import MetricSelector from "./MetricSelector"

const CircularityData: FC<{
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  projectName: string
  catalogPath: string
  dimensionalFieldName: DimensionalFieldName
  processCategories: ProcessCategory[]
}> = ({ circularityData, catalogPath, projectName, dimensionalFieldName, processCategories }) => {
  // Use state to manage the selected metric type
  const [selectedMetricType, setSelectedMetricType] = useState<MetricType>("eolBuiltPoints")

  const totalMetricValues: ProjectMetricValues = calculateTotalMetricValuesForProject(
    circularityData,
    dimensionalFieldName
  )

  // Handle metric type change from the selector
  const handleMetricTypeChange = (metricType: MetricType) => {
    setSelectedMetricType(metricType)
  }

  return (
    <>
      {/* Add the MetricSelector component */}
      <MetricSelector selectedMetricType={selectedMetricType} onMetricTypeChange={handleMetricTypeChange} />

      <div>
        <CircularityIndexTotalNumber circularityIndexPoints={totalMetricValues[selectedMetricType]} />
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
