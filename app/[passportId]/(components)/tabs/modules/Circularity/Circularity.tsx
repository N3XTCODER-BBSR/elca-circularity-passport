"use client"

import { Accordion } from "@szhsin/react-accordion"
import { AccordionItem } from "components/Accordion/AccordionItem"
import { BuildingComponent } from "utils/zod/passportSchema"
import BarChart from "./(components)/BarChart"

type CircularityProps = {
  buildingComponents: BuildingComponent[]
  className?: string
}

function getEolClassNameByPoints(points: number) {
  if (points >= 140) return "A"
  if (points >= 100) return "B"
  if (points >= 80) return "C"
  if (points >= 70) return "C/D"
  if (points >= 60) return "D"
  if (points >= 40) return "D/E"
  if (points >= 20) return "E"
  if (points >= 0) return "E/F"
  if (points >= -20) return "F"
  if (points >= -40) return "F/G"
  if (points >= -60) return "G"
  if (points >= -80) return "H"
  if (points >= -100) return "I"
  if (points >= -140) return "J"
  return "J"
}

const aggregate = (buildingComponents: BuildingComponent[]) => {
  // We want to aggregate the EOL points for all layers in all components by the Category / Category name
  // Initialize a map to store aggregated data
  const aggregationMap = new Map<
    number,
    {
      categoryNumberAndName: string
      aggregatedMass: number
      weightedEolPoints: number
      costGroupCategoryNumber: number
    }
  >()
  let totalMass = 0
  let totalWeightedEolPoints = 0

  // TODO: overall improve this logic - we could porbably just create the whole final chart data in just one looping

  buildingComponents.forEach((component) => {
    component.layers.forEach((layer) => {
      totalMass += layer.mass
      totalWeightedEolPoints += layer.circularity!.eol!.points! * layer.mass

      // TODO: improve that; either
      // a) make the circularity.eol.points mandatory in the schema
      // b) kick out the element from the collection by skipping this forEach iteration
      const eolPointsCoefficent = layer.circularity!.eol!.points!
      const massCoefficient = layer.mass
      const weightedEolPoints = eolPointsCoefficent * massCoefficient

      // Check if the costGroupCategory already exists in the map
      if (!aggregationMap.has(component.costGroupCategory)) {
        // Create a new entry
        aggregationMap.set(component.costGroupCategory, {
          // TODO: rename categoryName to costGroupCategoryName
          categoryNumberAndName: `${component.costGroupCategory} ${component.costGroupCategoryName}`,
          // TODO: rename costGroupCategory to costGroupCategoryNumber
          costGroupCategoryNumber: component.costGroupCategory,
          weightedEolPoints: 0,
          aggregatedMass: 0,
        })
      }

      // Update the existing entry
      aggregationMap.get(component.costGroupCategory)!.weightedEolPoints += weightedEolPoints
      aggregationMap.get(component.costGroupCategory)!.aggregatedMass += massCoefficient
    })
  })

  const aggregationMapWithAvgEolPointsAndClasses = new Map<
    number,
    { categoryNumberAndName: string; aggregatedMass: number; weightedAvgEolPoints: number; eolClass: string }
  >()
  aggregationMap.forEach((value, key) => {
    const weightedAvgEolPoints = value.weightedEolPoints / value.aggregatedMass

    aggregationMapWithAvgEolPointsAndClasses.set(key, {
      ...value,
      weightedAvgEolPoints,
      eolClass: getEolClassNameByPoints(weightedAvgEolPoints),
    })
  })

  const totalAvgEolPoints = Math.round(totalWeightedEolPoints / totalMass)

  return {
    totalAvgEolPoints,
    totalEolClass: getEolClassNameByPoints(totalAvgEolPoints),
    avgEolPointsPerComponentCostCategory: Array.from(aggregationMapWithAvgEolPointsAndClasses.values()),
  }
}

const Circularity: React.FC<CircularityProps> = ({ buildingComponents, className }) => {
  // TODO: consider to refactor even more - each chart type should be potentially a separate component
  // plus, the aggregation logic could also return the total and total per NRF values already

  const aggregatedData = aggregate(buildingComponents)
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
          <BarChart
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
          <BarChart
            data={chartDataForAvgEolPointsPerComponentCostCategory}
            indexBy={"categoryNumberAndName"}
            keys={["weightedAvgEolPoints"]}
            labelKey="label"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="mx-2 my-16 border-t">
          <Accordion transition transitionTimeout={200}>
            <AccordionItem header="Was ist der RMI renewable?" initialEntered>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </AccordionItem>

            <AccordionItem header="Warum ist der RMI renewable wichtig für die Nachhaltigkeit?">
              Quisque eget luctus mi, vehicula mollis lorem. Proin fringilla vel erat quis sodales. Nam ex enim,
              eleifend venenatis lectus vitae.
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default Circularity
