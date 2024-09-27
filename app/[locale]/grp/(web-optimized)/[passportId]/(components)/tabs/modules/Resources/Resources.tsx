"use client"

import { useState } from "react"

import ResourcesDonutChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesDonutChart"
import ResourcesPieChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesPieChart"
import VerticalNavigation from "app/[locale]/grp/(components)/generic/VerticalNavigation/VerticalNavigation"

import PieChartLegendTable from "app/[locale]/grp/pdf-optimized/[passportId]/ResourcesModule/PieChartLegendTable"
import { PALETTE_LIFECYCLE_PHASES, rmiColorsMapper } from "constants/styleConstants"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  aggregateGwpOrPenrt,
  aggregateRmiData,
  gwpAggregationConfig,
  penrtAggregationConfig,
} from "domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import DummyAccordion from "../../../DummyAccordion"
import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"
import { useTranslations } from "next-intl"

const navigationSections = [
  {
    name: "Rohstoffeinsatz (RMI)",
    id: "0",
  },
  {
    name: "Global Warming Potential (GWP)",
    id: "1",
  },
  {
    name: "Primärenergie nicht-erneuerbar (PENRT)",
    id: "2",
  },
]

type ResourcesProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string
}

const Resources: React.FC<ResourcesProps> = ({ dinEnrichedBuildingComponents, nrf, className }) => {
  const rmiTranslations = useTranslations("Grp.Web.sections.overview.module2Resources.rmi")
  const [currentNavSectionId, setCurrentNavSectionId] = useState<string>("0")

  // TODO: consider to refactor here - each chart type should be potentially a separate component

  // TODO: URGENT - CHECK: Why is in this file renewable present, but not nonRenewable?
  const aggregatedDataRmiRenewable = aggregateRmiData(dinEnrichedBuildingComponents, "renewable", nrf)

  const aggregatedDataRmi = aggregateRmiData(dinEnrichedBuildingComponents, "all", nrf)

  const rmiLegendTableData = [
    ...aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage.map((data) => ({
      color: rmiColorsMapper(data.resourceTypeName),
      name: rmiTranslations(`names.${data.resourceTypeName}`),
      value: data.aggregatedValue,
      percentage: data.percentageValue,
    })),
  ]

  const aggregatedGwp = aggregateGwpOrPenrt(dinEnrichedBuildingComponents, gwpAggregationConfig)

  const aggregatedGwpTotal = Math.round(aggregatedGwp.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0))
  const aggregatedGwpTotalPerNrf = aggregatedGwpTotal / nrf

  const aggregatedPenrt = aggregateGwpOrPenrt(dinEnrichedBuildingComponents, penrtAggregationConfig)
  const aggregatedPenrtTotal = Math.round(
    aggregatedPenrt.reduce((sum, { aggregatedValue }) => sum + aggregatedValue, 0)
  )
  const aggregatedPenrtTotalPerNrf = Math.round(aggregatedPenrtTotal / nrf)

  // Add color palette
  const gwpAndPenrtColorPalette: string[] = PALETTE_LIFECYCLE_PHASES
  const aggregatedGwpWithColors = aggregatedGwp.map((data, idx) => ({
    ...data,
    color: gwpAndPenrtColorPalette[idx % gwpAndPenrtColorPalette.length]!,
  }))
  const aggregatedPenrtWithColors = aggregatedPenrt.map((data, idx) => ({
    ...data,
    color: gwpAndPenrtColorPalette[idx % gwpAndPenrtColorPalette.length]!,
  }))
  const colorMapper = (datum: any) => {
    return datum.data.color
  }

  const keys = ["aggregatedValue"]

  const grayEmissionsTotal = aggregatedGwpWithColors
    .filter((data) => data.pattern === "dots")
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const grayEnergyTotal = aggregatedPenrtWithColors
    .filter((data) => data.pattern === "dots")
    .map((el) => el.aggregatedValue)
    .reduce((acc, val) => acc + val, 0)

  const gwpLegendTableData = [
    ...aggregatedGwpWithColors.map((data) => ({
      color: data.color,
      name: data.lifecycleSubphaseName,
      value: data.aggregatedValue,
      percentage: data.aggregatedValuePercentage,
    })),
    {
      color: "white",
      name: "Graue Emissionen, gesamt",
      value: grayEmissionsTotal,
      pattern: "dots",
    },
  ]

  const penrtLegendTableData = [
    ...aggregatedPenrtWithColors.map((data) => ({
      color: data.color,
      name: data.lifecycleSubphaseName,
      value: data.aggregatedValue,
      percentage: data.aggregatedValuePercentage,
    })),
    {
      color: "white",
      name: "Graue Energie, gesamt",
      value: grayEnergyTotal,
      pattern: "dots",
    },
  ]

  // TODO: Refactor: extract each case of currentNavSectionId into separate component
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
              <div className="w-full text-center">
                <TotalAndNrfRelativeValuesDisplay
                  totalValue={aggregatedDataRmiRenewable.aggregatedDataTotal}
                  nrfRelativeValue={aggregatedDataRmiRenewable.aggregatedDataTotalPerNrf2m}
                  unit="t"
                />
                <div className="h-96">
                  <ResourcesPieChart
                    data={aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage}
                    colors={rmiColorsMapper}
                  />
                </div>
                <PieChartLegendTable data={rmiLegendTableData} unit="t" />
              </div>
            </div>
          )}
          {currentNavSectionId === "1" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["1"]!.name}
              </h4>
              <div className="w-full text-center">
                <TotalAndNrfRelativeValuesDisplay
                  totalValue={aggregatedGwpTotal}
                  nrfRelativeValue={aggregatedGwpTotalPerNrf}
                  unit="kg co2eq"
                />
                <div className="h-96">
                  <ResourcesDonutChart
                    labelPropertyName="lifecycleSubphaseName"
                    patternPropertyName="pattern"
                    colors={colorMapper}
                    data={aggregatedGwpWithColors}
                    indexBy={"lifecycleSubphaseId"}
                    keys={keys}
                  />
                </div>
                <PieChartLegendTable data={gwpLegendTableData} unit="kg CO2-eq" />
              </div>
            </div>
          )}
          {currentNavSectionId === "2" && (
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
                {navigationSections["2"]!.name}
              </h4>
              <div className="w-full text-center">
                <TotalAndNrfRelativeValuesDisplay
                  totalValue={aggregatedPenrtTotal}
                  nrfRelativeValue={aggregatedPenrtTotalPerNrf}
                  unit="KwH"
                />
                {/* <ResourcesDonutChart
                  colors={colorMapper}
                  data={aggregatedPenrtWithColors}
                  indexBy={"costGroupCategoryNumberAndName"}
                  keys={keys}
                /> */}
                <div className="h-96">
                  <ResourcesDonutChart
                    labelPropertyName="lifecycleSubphaseName"
                    patternPropertyName="pattern"
                    colors={colorMapper}
                    data={aggregatedPenrtWithColors}
                    indexBy={"lifecycleSubphaseId"}
                    keys={keys}
                  />
                </div>
                <PieChartLegendTable data={penrtLegendTableData} unit="KwH" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mb-16 mt-32 w-full">
        <DummyAccordion />
      </div>
    </div>
  )
}

export default Resources
