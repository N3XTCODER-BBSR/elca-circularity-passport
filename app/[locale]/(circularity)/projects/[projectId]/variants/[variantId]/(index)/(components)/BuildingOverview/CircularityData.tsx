"use client"
import { FC } from "react"
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

const CircularityData: FC<{
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  projectName: string
  catalogPath: string
  dimensionalFieldName: DimensionalFieldName
  processCategories: ProcessCategory[]
}> = async ({ circularityData, catalogPath, projectName, dimensionalFieldName, processCategories }) => {
  const totalMetricValues: ProjectMetricValues = calculateTotalMetricValuesForProject(
    circularityData,
    dimensionalFieldName
  )

  // This would typically come from user selection or URL params
  const selectedMetricType: MetricType = "eolBuiltPoints"

  return (
    <>
      <div>
        <CircularityIndexTotalNumber circularityIndexPoints={totalMetricValues[selectedMetricType]} />
      </div>
      <CircularityIndexBreakdownByDin
        dimensionalFieldName={dimensionalFieldName}
        circularityData={circularityData}
        projectName={projectName}
        catalogPath={catalogPath}
        metricType={selectedMetricType}
      />
      <CircularityIndexBreakdownByMaterialType
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
