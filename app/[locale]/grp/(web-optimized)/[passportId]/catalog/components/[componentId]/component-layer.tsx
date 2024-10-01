"use client"

import Image from "next/image"
import { Layer } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import LayerDetailInfo from "./(components)/LayerDetailInfo"

type ComponentLayerProps = {
  layerData: Layer
  layerNumber: number
}

const ComponentLayer = ({ layerData, layerNumber }: ComponentLayerProps) => {
  return (
    <div className="mb-6 overflow-hidden border border-gray-200 bg-white p-6">
      <div className="flex items-start">
        <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
        <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
          {layerNumber} - {layerData.name}
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="">
          <dl className="">
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Laufende Nummer</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{layerData.lnr}</dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Masse [kg]</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {layerData.mass.toFixed(2)}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Geometrie der Bauteilschichten/ Komponenten</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {layerData.materialGeometry.amount.toFixed(2)} {layerData.materialGeometry.unit}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <LayerDetailInfo layerData={layerData} />
    </div>
  )
}
export default ComponentLayer
