import {
  Box,
  ModuleContainer,
  ModuleMain,
  ModuleSectionContainer,
  ModuleSectionMain,
  ModuleSectionTitle,
  ModuleTitle,
} from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import aggregateCircularityData from "domain-logic/grp/modules/passport-overview/circularity/circularity-data-aggregation"
import CircularityBarChart from "./CircularityBarChart"

type CircularityProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  className?: string
}

const Circularity: React.FC<CircularityProps> = ({ dinEnrichedBuildingComponents }) => {
  const aggregatedData = aggregateCircularityData(dinEnrichedBuildingComponents)

  // TODO: consider to move this into domain-logic layer
  const chartDataForAvgEolPointsPerComponentCostCategory = aggregatedData.avgEolPointsPerComponentCostCategory.map(
    (data) => ({
      ...data,
      label: `${data.categoryNumberAndName}: ${data.eolClass} (${Math.round(data.weightedAvgEolPoints)})`,
    })
  )

  // TODO: consider to move this into domain-logic layer
  const chartDataForAvgEolPoints = [
    {
      weightedAvgEolPoints: aggregatedData.totalAvgEolPoints,
      categoryNumberAndName: "",
      label: `${aggregatedData.totalEolClass} (${aggregatedData.totalAvgEolPoints})`,
      eolClass: aggregatedData.totalEolClass,
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
                indexBy={"categoryNumberAndName"}
                keys={["weightedAvgEolPoints"]}
                labelKey="label"
                isTotalBuilding={true}
              />
            </Box>
          </ModuleSectionMain>
        </ModuleSectionContainer>

        <ModuleSectionContainer>
          <ModuleSectionTitle title="EOL Klasse nach Bauteilkategorien" />
          <ModuleSectionMain height={40}>
            <CircularityBarChart
              data={chartDataForAvgEolPointsPerComponentCostCategory}
              indexBy={"categoryNumberAndName"}
              keys={["weightedAvgEolPoints"]}
              labelKey="label"
            />
          </ModuleSectionMain>
        </ModuleSectionContainer>
      </ModuleMain>
    </ModuleContainer>
  )
}
export default Circularity
