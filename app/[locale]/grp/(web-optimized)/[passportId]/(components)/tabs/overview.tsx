"use client"

import { DinEnrichedPassportData } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { useTranslations } from "next-intl"
import BuildingBaseInformation from "./modules/BuildingBaseInformation"
import Circularity from "./modules/Circularity/Circularity"
import Materials from "./modules/Materials/Materials"
import Resources from "./modules/Resources/Resources"

const Overview = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const translations = useTranslations("Grp.Web")

  const onPdfExportClick = async () => {
    try {
      const response = await fetch(`/api/grp/pdf-export/${dinEnrichedPassportData.uuid}`, {})
      if (!response.ok) {
        throw new Error("Failed to fetch PDF export")
      }
      const pdfExportApiResponse: any = await response.json()

      if (pdfExportApiResponse.documentUrl) {
        window.open(pdfExportApiResponse.documentUrl, "_blank") // Open the PDF URL in a new tab
      } else {
        console.error("No documentUrl found in the API response")
      }
    } catch (error) {
      console.error("Error during PDF export:", error)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-l max-w-xl font-bold leading-none tracking-tight dark:text-white lg:text-3xl">
          {translations("title")}
        </h1>
        <button
          type="button"
          className="h-8 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={onPdfExportClick}
        >
          PDF exportieren
        </button>
      </div>

      <h2 className="max-w-[50%]">
        <span className="text-sm font-bold uppercase text-indigo-600">Projekt:</span>
        <br />
        <span className="text-2xl">{dinEnrichedPassportData.projectName}</span>
      </h2>
      <div className="mt-6 border-gray-100">
        <BuildingBaseInformation passportData={dinEnrichedPassportData} className="mt-16" />
        <Materials dinEnrichedPassportData={dinEnrichedPassportData} className="my-24" />
        <Resources
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          nrf={dinEnrichedPassportData.buildingBaseData.nrf}
          className="mt-16"
        />
        <Circularity
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          className="mt-16"
        />
      </div>
    </>
  )
}

export default Overview
