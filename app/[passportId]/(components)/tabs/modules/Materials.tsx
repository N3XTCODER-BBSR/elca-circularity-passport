"use client"

import { BuildingComponent } from "utils/zod/passportSchema"
import BarChart from "../../BarChart"

interface AggregatedData {
  costGroupCategory: number
  categoryName: string
  aggregatedMass: number
  aggregatedMassPercentage: number
  label: string
}

const Materials = ({ buildingComponents }: { buildingComponents: BuildingComponent[] }) => {
  console.log("buildingComponents", buildingComponents)

  function aggregateData(buildingComponents: BuildingComponent[]): AggregatedData[] {
    // Initialize a map to store aggregated data
    const aggregationMap = new Map<number, { categoryName: string; aggregatedMass: number }>()

    buildingComponents.forEach((component) => {
      const { costGroupCategory, categoryName, layers } = component

      // Calculate the total mass for this component
      const totalMass = layers.reduce((sum, layer) => sum + layer.mass, 0)

      // Check if the costGroupCategory already exists in the map
      if (aggregationMap.has(costGroupCategory)) {
        // Update the existing entry
        aggregationMap.get(costGroupCategory)!.aggregatedMass += totalMass
      } else {
        // Create a new entry
        aggregationMap.set(costGroupCategory, {
          categoryName,
          aggregatedMass: totalMass,
        })
      }
    })

    // Convert the map to an array of AggregatedData
    const aggretatedDataArr = Array.from(aggregationMap, ([costGroupCategory, { categoryName, aggregatedMass }]) => ({
      costGroupCategory,
      categoryName,
      aggregatedMass,
    }))

    const totalMass = aggretatedDataArr.reduce((sum, { aggregatedMass }) => sum + aggregatedMass, 0)

    const aggregatedDataArrWithPercentageAndLabel = aggretatedDataArr.map((data) => {
      const aggregatedMassPercentage = (data.aggregatedMass / totalMass) * 100
      return {
        ...data,
        aggregatedMassPercentage,
        label: `${aggregatedMassPercentage.toFixed(2)}% (${data.aggregatedMass.toFixed(2)} t)`,
      }
    })

    const aggretatedDataWithPercentageSorted = aggregatedDataArrWithPercentageAndLabel.sort(
      (a, b) => a.aggregatedMass - b.aggregatedMass
    )

    console.log("aggretatedDataWithPercentageSorted", aggretatedDataWithPercentageSorted)

    return aggretatedDataWithPercentageSorted
  }

  const aggregatedData = aggregateData(buildingComponents)
  console.log(aggregatedData)

  // TODO: Change this so keys is not showing the costGroupCategoryID (cryptic) but the respective categoryName
  // const keys = [...buildingComponents.map((component) => component.categoryName)]
  const keys = ["aggregatedMassPercentage"]

  const chartData = aggregatedData.map((data) => ({
    categoryName: data.categoryName,
    mass: data.aggregatedMass,
    aggregatedMassPercentage: data.aggregatedMassPercentage,
    // label is of format xx% (abc t)
    label: data.label,
  }))

  return (
    <div>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Modul 1
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Materialien
      </h3>
      <div className="h-[300px]">
        <BarChart data={chartData} indexBy={"categoryName"} keys={keys} labelKey="label" />
      </div>
    </div>
  )
}

export default Materials
