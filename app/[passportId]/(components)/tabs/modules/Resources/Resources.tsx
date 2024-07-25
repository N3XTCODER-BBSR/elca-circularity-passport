"use client"

import { Accordion } from "@szhsin/react-accordion"
import { useState } from "react"
import { AccordionItem } from "components/Accordion/AccordionItem"
import VerticalNavigation from "components/VerticalNavigation/VerticalNavigation"
import { BuildingComponent, Ressources } from "utils/zod/passportSchema"
import PieChart from "./(components)/PieChart"

type ResourceConfig = {
  propertyName: keyof Ressources
  labelName: string
}

type AggregatedRmiData = {
  resourceTypeName: string
  aggregatedValue: number
  percentageValue: number
  label: string
}

type AggregatedGwpOrPenrtData = {
  costGroupCategory: number
  categoryName: string
  aggregatedValue: number
  aggregatedValuePercentage: number
  label: string
}

function aggregateGwpOrPenrt(
  buildingComponents: BuildingComponent[],
  propertyToAggregate: "gwpAB6C" | "penrtAB6C"
): AggregatedGwpOrPenrtData[] {
  const aggregationMap = new Map<number, { categoryName: string; aggregatedValue: number }>()

  buildingComponents.forEach((component) => {
    const { costGroupCategory, costGroupCategoryName: categoryName, layers } = component

    const aggregatedValue = layers.reduce((sum, layer) => sum + layer.ressources![propertyToAggregate], 0)

    // Check if the costGroupCategory already exists in the map
    if (aggregationMap.has(costGroupCategory)) {
      // Update the existing entry
      aggregationMap.get(costGroupCategory)!.aggregatedValue += aggregatedValue
    } else {
      // Create a new entry
      aggregationMap.set(costGroupCategory, {
        categoryName,
        aggregatedValue,
      })
    }
  })

  // Convert the map to an array of AggregatedData
  const aggretatedDataArr = Array.from(aggregationMap, ([costGroupCategory, { categoryName, aggregatedValue }]) => ({
    costGroupCategory,
    categoryName,
    aggregatedValue,
  }))

  const totalValue = aggretatedDataArr.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)

  const aggregatedDataArrWithPercentageAndLabel = aggretatedDataArr.map((data) => {
    const aggregatedValuePercentage = (data.aggregatedValue / totalValue) * 100
    return {
      ...data,
      costGroupCategoryNumberAndName: `${data.costGroupCategory} ${data.categoryName}`,
      aggregatedValuePercentage,
      label: `${aggregatedValuePercentage.toFixed(2)}% (${data.aggregatedValue.toFixed(2)} t)`,
    }
  })

  const aggretatedDataWithPercentageSorted = aggregatedDataArrWithPercentageAndLabel.sort(
    (a, b) => a.aggregatedValue - b.aggregatedValue
  )

  return aggretatedDataWithPercentageSorted
}

function aggregateRmiData(
  buildingComponents: BuildingComponent[],
  resourceConfigs: ResourceConfig[]
): AggregatedRmiData[] {
  const initialResourceMap: Record<string, number> = {}

  const aggregatedResourceMap = buildingComponents.reduce((acc, component) => {
    const { layers } = component

    resourceConfigs.forEach(({ propertyName, labelName }) => {
      const totalForResource = layers.reduce((sum, layer) => {
        return sum + (layer.ressources?.[propertyName] || 0)
      }, 0)

      if (acc[labelName] == null) {
        acc[labelName] = 0
      }
      acc[labelName] += totalForResource
    })

    return acc
  }, initialResourceMap)

  const totalResources = Object.values(aggregatedResourceMap).reduce((sum, value) => sum + value, 0)

  const aggregatedDataWithPercentages: AggregatedRmiData[] = Object.entries(aggregatedResourceMap).map(
    ([resourceTypeName, aggregatedValue]) => {
      const percentageValue = (aggregatedValue / totalResources) * 100

      const label = `${aggregatedValue
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Tonnen - ${percentageValue.toFixed(2)}%`

      return {
        resourceTypeName,
        aggregatedValue,
        percentageValue,
        label,
      }
    }
  )

  return aggregatedDataWithPercentages
}

const navigationSections = [
  {
    name: "Rohstoff-einsatz (RMI) - nicht-erneuerbar",
    id: "0",
  },
  {
    name: "Rohstoff-einsatz (RMI) - erneuerbar",
    id: "1",
  },
  {
    name: "Global Warming Potential (GWP)",
    id: "2",
  },
  {
    name: "Primärenergie nicht-erneuerbar (PENRT)",
    id: "3",
  },
]

type ResourcesProps = {
  buildingComponents: BuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const Resources: React.FC<ResourcesProps> = ({ buildingComponents, nrf, className }) => {
  const [currentNavSectionId, setCurrentNavSectionId] = useState<string>("0")

  // TODO: consider to refactor here - each chart type should be potentially a separate component
  // plus, the aggregation logic should also return the total and total per NRF values already

  const aggregatedDataRmiRenewable = aggregateRmiData(buildingComponents, [
    { propertyName: "rmiForestry", labelName: "Forst" },
    { propertyName: "rmiAqua", labelName: "Wasser" },
    { propertyName: "rmiAgrar", labelName: "Agrar" },
  ])
  const aggregatedDataRmiRenewableTotal = Math.round(
    aggregatedDataRmiRenewable.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )

  const aggregatedDataRmiRenewableTotalPerNrf2m = Math.round(aggregatedDataRmiRenewableTotal / nrf)

  const aggregatedDataRmiNonRenewable = aggregateRmiData(buildingComponents, [
    { propertyName: "rmiMineral", labelName: "Mineralisch" },
    { propertyName: "rmiMetallic", labelName: "Metallisch" },
    { propertyName: "rmiFossil", labelName: "Fossil" },
  ])
  const aggregatedDataRmiNonRenewableTotal = Math.round(
    aggregatedDataRmiNonRenewable.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )
  const aggregatedDataRmiNonRenewableTotalPerNrf2m = Math.round(aggregatedDataRmiNonRenewableTotal / nrf)

  const aggregatedGwp = aggregateGwpOrPenrt(buildingComponents, "gwpAB6C")
  const aggregatedGwpTotal = Math.round(aggregatedGwp.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0))
  const aggregatedGwpTotalPerNrf = Math.round(aggregatedGwpTotal / nrf)

  const aggregatedPenrt = aggregateGwpOrPenrt(buildingComponents, "penrtAB6C")
  const aggregatedPenrtTotal = Math.round(
    aggregatedPenrt.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )
  const aggregatedPenrtTotalPerNrf = Math.round(aggregatedPenrtTotal / nrf)

  const keys = ["aggregatedValue"]

  return (
    <div className={className}>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Modul 2
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Resourcen
      </h3>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4">
          <VerticalNavigation
            navigation={navigationSections}
            currentSectionId={currentNavSectionId}
            onSelect={setCurrentNavSectionId}
          />
        </div>
        <div className="md:w-3/4">
          {currentNavSectionId === "0" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["0"]!.name}
              </h4>
              <div className="h-96 w-full text-center">
                {aggregatedDataRmiRenewableTotalPerNrf2m} t / m2 NRF
                <PieChart data={aggregatedDataRmiRenewable} indexBy={"resourceTypeName"} keys={keys} />
                Gesamt: <b>{aggregatedDataRmiRenewableTotal} Tonnen</b>
              </div>
            </div>
          )}
          {currentNavSectionId === "1" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["1"]!.name}
              </h4>
              <div className="h-96 w-full text-center">
                {aggregatedDataRmiNonRenewableTotalPerNrf2m} t / m2 NRF
                <PieChart data={aggregatedDataRmiNonRenewable} indexBy={"resourceTypeName"} keys={keys} />
                Gesamt: <b>{aggregatedDataRmiNonRenewableTotal} Tonnen</b>
              </div>
            </div>
          )}
          {currentNavSectionId === "2" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["2"]!.name}
              </h4>
              <div className="h-96 w-full text-center">
                {aggregatedGwpTotalPerNrf} kg CO2-eq/m2 NRF
                <PieChart data={aggregatedGwp} indexBy={"costGroupCategoryNumberAndName"} keys={keys} />
                Gesamt: <b>{aggregatedGwpTotal} Tonnen CO2-eq</b>
              </div>
            </div>
          )}
          {currentNavSectionId === "3" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["3"]!.name}
              </h4>
              <div className="h-96 w-full text-center">
                {aggregatedPenrtTotalPerNrf} KwH/m2 NRF
                <PieChart data={aggregatedPenrt} indexBy={"costGroupCategoryNumberAndName"} keys={keys} />
                Gesamt: <b>{aggregatedPenrtTotal} Tonnen CO2-eq</b>
              </div>
            </div>
          )}
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

export default Resources
