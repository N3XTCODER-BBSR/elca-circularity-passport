"use client"

import { useState } from "react"
import VerticalNavigation from "app/(components)/(generic)/VerticalNavigation/VerticalNavigation"
import { DinEnrichedPassportData } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import {
  aggregateMaterialsDataByBuildingComponentCategory,
  aggregateMaterialsDataByMaterialClass,
} from "../../../../../../(modules)/(passport-overview)/materials/materials-data-aggregation"
import MaterialsBarChart from "../../../../../../(modules)/(passport-overview)/materials/MaterialsBarChart"
import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"
import DummyAccordion from "../../../DummyAccordion"

const navigationSections = [
  {
    name: "Nach Baustoffgruppen",
    id: "1",
  },
  {
    name: "Nach Bauteilkategorien",
    id: "2",
  },
]

type MaterialsProps = {
  dinEnrichedPassportData: DinEnrichedPassportData
  className?: string // Add className as an optional prop
}

const Materials: React.FC<MaterialsProps> = ({ dinEnrichedPassportData, className }) => {
  const [currentNavSectionId, setCurrentNavSectionId] = useState<string>("1")

  const aggregatedDataByBuildingComponentCategory = aggregateMaterialsDataByBuildingComponentCategory(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  const aggregatedDataByByMaterialClass = aggregateMaterialsDataByMaterialClass(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  // TODO: Change this so keys is not showing the costGroupCategoryID (cryptic) but the respective categoryName
  // const keys = [...buildingComponents.map((component) => component.categoryName)]

  const chartDataGroupedByBuildingMaterialClass =
    aggregatedDataByByMaterialClass.aggregatedByClassIdWithPercentageSorted.map((data) => ({
      categoryName: data.materialClassDescription,
      mass: data.aggregatedMass,
      aggregatedMassPercentage: data.aggregatedMassPercentage,
      // label is of format xx% (abc t)
      label: data.label,
    }))

  const chartDataGroupedByBuildingComponentCategory =
    aggregatedDataByBuildingComponentCategory.aggretatedByCategoryWithPercentageSorted.map((data) => ({
      categoryName: data.categoryName,
      mass: data.aggregatedMass,
      aggregatedMassPercentage: data.aggregatedMassPercentage,
      // label is of format xx% (abc t)
      label: data.label,
    }))

  return (
    <div className={className}>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Modul 1
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Materialien
      </h3>
      <div className="flex h-[300px] flex-col text-center">
        <h4 className="text-l mb-4 font-extrabold lg:text-2xl xl:text-xl">Masse</h4>
        <div className="flex flex-row items-center ">
          <TotalAndNrfRelativeValuesDisplay
            totalValue={aggregatedDataByBuildingComponentCategory.totalMass}
            nrfRelativeValue={aggregatedDataByBuildingComponentCategory.totalMassRelativeToNrf}
            unit="tonnes"
          />
          <select
            className="min-w-32 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentNavSectionId}
            onChange={(e) => setCurrentNavSectionId(e.target.value)}
          >
            {navigationSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        <div className="h-[500px]">
          {currentNavSectionId === "1" && <MaterialsBarChart data={chartDataGroupedByBuildingMaterialClass} />}
          {currentNavSectionId === "2" && <MaterialsBarChart data={chartDataGroupedByBuildingComponentCategory} />}
        </div>
      </div>
      <div className="mb-16 mt-16 w-full">
        <DummyAccordion />
      </div>
    </div>
  )
}

export default Materials
