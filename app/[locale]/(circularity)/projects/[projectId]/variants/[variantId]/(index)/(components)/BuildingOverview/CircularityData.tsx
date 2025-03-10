"use client"
import { FC, useState } from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  calculateTotalMetricValuesForProject,
  ProjectMetricValues,
} from "lib/domain-logic/circularity/utils/calculateTotalMetricValues"
import { DimensionalFieldName, MetricType } from "lib/domain-logic/shared/basic-types"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import MetricSelector from "./MetricSelector"
import CircularityIndexBreakdownByDin from "../CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"
import CircularityIndexBreakdownByMaterialType, {
  ProcessCategory,
} from "../CircularityIndexBreakdownByMaterialType/CircularityIndexBreakdownByMaterialType"
import CircularityIndexTotalNumber from "../CircularityIndexTotalNumber"

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

  return (
    <>
      <div className="mt-4">
        <MetricSelector selectedMetricType={selectedMetricType} onMetricTypeChange={handleMetricTypeChange} />
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
