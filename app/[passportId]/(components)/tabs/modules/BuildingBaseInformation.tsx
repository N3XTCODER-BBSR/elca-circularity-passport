"use client"; 

import { InformationCircleIcon } from "@heroicons/react/20/solid"
import { Passport } from "utils/zod/passportSchema"
import InfoIcon from "./components/InfoIcon"
import { Tooltip } from "react-tooltip"

const BuildingBaseInformation = ({ passportData }: { passportData: Passport }) => {
  const sealedPropertyAreaProportionAsPercentageStr = `${(
    passportData.buildingBaseData.sealedPropertyAreaProportion * 100
  ).toFixed(2)}%`

  return (
    <>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Gebaude-Informationen
      </h2>
      <dl className="divide-y divide-gray-100">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 lg:border-r-2">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Gebäude/Bauwerk-ID:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.buildingStructureId}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Adresse:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.address}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Baujahr:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.buildingYear}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Gebäudetyp:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.buildingType}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Geschossanzahl des Gebäudes:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.numberOfFloors}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="flex text-sm font-bold leading-6 text-gray-900">
                <a id="nrf-info-anchor" className="flex items-center"><InformationCircleIcon className="h-4 w-4 text-blue-800" aria-hidden="true" /></a>
                <Tooltip anchorSelect="#nrf-info-anchor" content="Netto-Mietfläche eines Gebäudes, exklusive gemeinschaftlicher Bereiche wie Lobbys, Flure, Treppenhäuser und technische Räume." />
                NRF:
              </dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.nrf} m²
              </dd>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">BGF:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.bgf} m²
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">BRI:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.bri} m³
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Grundstücksfläche:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.plotArea} m²
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Anteil versiegelte Grundstücksfläche:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {sealedPropertyAreaProportionAsPercentageStr}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Gesamtmasse des Gebäudes:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.totalBuildingMass}t
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Datenqualität:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.dataQuality}
              </dd>
            </div>
          </div>
        </div>
      </dl>
    </>
  )
}

export default BuildingBaseInformation
