"use client"

import { useState } from "react"
import VerticalNavigation from "app/(components)/(generic)/VerticalNavigation/VerticalNavigation"
import { DinEnrichedPassportData } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { aggregateMaterialsData } from "../../../../../../(modules)/(passport-overview)/materials/materials-data-aggregation"
import MaterialsBarChart from "../../../../../../(modules)/(passport-overview)/materials/MaterialsBarChart"

const navigationSections = [
  // {
  //   name: "Nach Baustoffgruppen",
  //   id: "1",
  // },
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

  const aggregatedData = aggregateMaterialsData(
    dinEnrichedPassportData.dinEnrichedBuildingComponents,
    dinEnrichedPassportData.buildingBaseData.nrf
  )

  // TODO: Change this so keys is not showing the costGroupCategoryID (cryptic) but the respective categoryName
  // const keys = [...buildingComponents.map((component) => component.categoryName)]

  const chartData = aggregatedData.aggretatedByCategoryWithPercentageSorted.map((data) => ({
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
      <div className="flex h-[300px] flex-col md:flex-row">
        <div className="md:w-1/4">
          <VerticalNavigation
            navigation={navigationSections}
            currentSectionId={currentNavSectionId}
            onSelect={setCurrentNavSectionId}
          />
        </div>
        <div className="md:w-2/4">
          <MaterialsBarChart data={chartData} />
        </div>
        <div className="text-xs md:w-1/4">
          <div className="mb-2 grid grid-cols-2 gap-x-0">
            <div>
              <span className="text-gray-500">Gesamtmasse:</span>
            </div>
            <div>
              <span className="text-gray-500">Flächenbezogene Masse:</span>
            </div>
            <div>{aggregatedData.totalMass.toFixed(2)} tonnes</div>
            <div>{aggregatedData.totalMassPercentage.toFixed(2)} tonnes/ m²</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Materials
