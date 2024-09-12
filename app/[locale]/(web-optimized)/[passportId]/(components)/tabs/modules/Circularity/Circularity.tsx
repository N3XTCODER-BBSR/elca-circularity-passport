"use client"

import { Accordion } from "@szhsin/react-accordion"
import { AccordionItem } from "app/[locale]/(components)/(generic)/Accordion/AccordionItem"
import aggregateCircularityData from "app/[locale]/(components)/domain-specific/modules/passport-overview/circularity/circularity-data-aggregation"
import CircularityBarChart from "app/[locale]/(components)/domain-specific/modules/passport-overview/circularity/CircularityBarChart"
import { DinEnrichedBuildingComponent } from "app/[locale]/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import DummyAccordion from "../../../DummyAccordion"

type CircularityProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  className?: string
}

const Circularity: React.FC<CircularityProps> = ({ dinEnrichedBuildingComponents, className }) => {
  // TODO: consider to refactor even more - each chart type should be potentially a separate component
  // plus, the aggregation logic could also return the total and total per NRF values already

  const aggregatedData = aggregateCircularityData(dinEnrichedBuildingComponents)

  const chartDataForAvgEolPointsPerComponentCostCategory = aggregatedData.avgEolPointsPerComponentCostCategory.map(
    (data) => ({
      ...data,
      label: `${data.categoryNumberAndName}: ${data.eolClass} (${Math.round(data.weightedAvgEolPoints)})`,
    })
  )

  const chartDataForAvgEolPoints = [
    {
      weightedAvgEolPoints: aggregatedData.totalAvgEolPoints,
      categoryNumberAndName: "Average class rating",
      label: `${aggregatedData.totalEolClass} (${aggregatedData.totalAvgEolPoints})`,
      eolClass: aggregatedData.totalEolClass,
    },
  ]

  return (
    <div className={className}>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Modul 3
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Zirkularität
      </h3>
      <div className="center flex flex-col items-center text-center">
        <b className="text-md mb-4 max-w-xl text-center leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
          EOL Class: {aggregatedData.totalEolClass}
        </b>
        <div className="h-[100px] md:w-2/4">
          <CircularityBarChart
            data={chartDataForAvgEolPoints}
            indexBy={"categoryNumberAndName"}
            keys={["weightedAvgEolPoints"]}
            labelKey="label"
          />
        </div>
      </div>
      <div className="center mt-10 flex flex-col items-center">
        <h4 className="text-md mb-4 max-w-xl text-center leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
          EOL Class By Component Category
        </h4>
        <div className="h-[300px] md:w-2/4">
          <CircularityBarChart
            data={chartDataForAvgEolPointsPerComponentCostCategory}
            indexBy={"categoryNumberAndName"}
            keys={["weightedAvgEolPoints"]}
            labelKey="label"
          />
        </div>
      </div>
      <div className="mb-16 mt-24 w-full">
        <DummyAccordion />
      </div>
    </div>
  )
}

export default Circularity
