/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
"use client"

import { useTranslations } from "next-intl"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import BuildingBaseInformation from "./modules/BuildingBaseInformation"
import Circularity from "./modules/Circularity/Circularity"
import Materials from "./modules/Materials/Materials"
// import Resources from "./modules/Resources/Resources"

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
          {translations("exportPdf")}
        </button>
      </div>

      <h2 className="max-w-[50%]">
        <span className="text-sm font-bold uppercase text-indigo-600">{translations("project")}</span>
        <br />
        <span className="text-2xl">{dinEnrichedPassportData.projectName}</span>
      </h2>
      <div className="mt-6 border-gray-100">
        <BuildingBaseInformation passportData={dinEnrichedPassportData} className="mt-16" />
        <Materials dinEnrichedPassportData={dinEnrichedPassportData} className="my-24 flex flex-col" />
        <div>
          <h2 className="text-l max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
            Module 2
          </h2>
          <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
            Resources
          </h3>
          <i>Under Construction: This module will be available in future releases</i>
        </div>
        {/* <Resources
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          nrf={dinEnrichedPassportData.buildingBaseData.nrf}
          className="mt-16"
        /> */}
        <Circularity
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          className="mt-16"
        />
      </div>
    </>
  )
}

export default Overview
