"use client"

import { Accordion } from "@szhsin/react-accordion"
import { useState } from "react"
import { AccordionItem } from "app/(components)/(generic)/Accordion/AccordionItem"
import VerticalNavigation from "app/(components)/(generic)/VerticalNavigation/VerticalNavigation"
import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  aggregateGwpOrPenrt,
  aggregateRmiData,
} from "../../../../../../(modules)/(passport-overview)/resources/resources-data-aggregation"
import ResourcesPieChart from "../../../../../../(modules)/(passport-overview)/resources/ResourcesPieChart"

const navigationSections = [
  {
    name: "Rohstoff-einsatz (RMI) - erneuerbar",
    id: "0",
  },
  {
    name: "Rohstoff-einsatz (RMI) - nicht-erneuerbar",
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
  buildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const Resources: React.FC<ResourcesProps> = ({ buildingComponents, nrf, className }) => {
  const [currentNavSectionId, setCurrentNavSectionId] = useState<string>("0")

  // TODO: consider to refactor here - each chart type should be potentially a separate component

  const aggregatedDataRmiRenewable = aggregateRmiData(
    buildingComponents,
    [
      { propertyName: "rmiForestry", labelName: "Forst" },
      { propertyName: "rmiAqua", labelName: "Wasser" },
      { propertyName: "rmiAgrar", labelName: "Agrar" },
    ],
    nrf
  )

  const aggregatedDataRmiNonRenewable = aggregateRmiData(
    buildingComponents,
    [
      { propertyName: "rmiMineral", labelName: "Mineralisch" },
      { propertyName: "rmiMetallic", labelName: "Metallisch" },
      { propertyName: "rmiFossil", labelName: "Fossil" },
    ],
    nrf
  )

  const aggregatedGwp = aggregateGwpOrPenrt(buildingComponents, "gwpAB6C")
  const aggregatedGwpTotal = Math.round(aggregatedGwp.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0))
  const aggregatedGwpTotalPerNrf = (aggregatedGwpTotal / nrf).toFixed(2)

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
                {aggregatedDataRmiRenewable.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
                <ResourcesPieChart
                  data={aggregatedDataRmiRenewable.aggretatedByByResourceTypeWithPercentage}
                  indexBy={"resourceTypeName"}
                  keys={keys}
                />
                Gesamt: <b>{aggregatedDataRmiRenewable.aggregatedDataTotal} Tonnen</b>
              </div>
            </div>
          )}
          {currentNavSectionId === "1" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["1"]!.name}
              </h4>
              <div className="h-96 w-full text-center">
                {aggregatedDataRmiNonRenewable.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
                <ResourcesPieChart
                  data={aggregatedDataRmiNonRenewable.aggretatedByByResourceTypeWithPercentage}
                  indexBy={"resourceTypeName"}
                  keys={keys}
                />
                Gesamt: <b>{aggregatedDataRmiNonRenewable.aggregatedDataTotal} Tonnen</b>
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
                <ResourcesPieChart data={aggregatedGwp} indexBy={"costGroupCategoryNumberAndName"} keys={keys} />
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
                {aggregatedPenrtTotalPerNrf.toFixed(2)} KwH/m2 NRF
                <ResourcesPieChart data={aggregatedPenrt} indexBy={"costGroupCategoryNumberAndName"} keys={keys} />
                Gesamt: <b>{aggregatedPenrtTotal.toFixed(2)} Tonnen CO2-eq</b>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="mx-2 my-16 border-t">
          <Accordion transition transitionTimeout={200}>
            <AccordionItem header="Was ist der RMI renewable?">
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
