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
      // TODO: use i18n here
      identifier: "Average class rating",
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
                  top: 30,
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
