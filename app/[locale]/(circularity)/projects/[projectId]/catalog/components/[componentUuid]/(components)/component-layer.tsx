"use client"

import Image from "next/image"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/SideBySideDescriptionListsWithHeadline"
import { ElcaProjectComponentLayer } from "app/[locale]/(circularity)/(utils)/types"

type ComponentLayerProps = {
  layerData: ElcaProjectComponentLayer
  layerNumber: number
  unitName: string
}

const ComponentLayer = ({ layerData, layerNumber, unitName }: ComponentLayerProps) => {
  const volume = layerData.layer_length * layerData.layer_width * layerData.layer_size
  const mass = layerData.process_config_density * volume

  const layerKeyValues: KeyValueTuple[] = [
    {
      key: "Schichtposition",
      value: layerData.layer_position,
    },
    {
      key: "Volumen [m3]",
      value: volume.toFixed(2),
    },
    {
      key: "Oekobaudat UUID",
      value: layerData.process_config_uuid,
    },
    {
      key: "Rohdichte [kg/m3]",
      value: layerData.process_config_density,
    },
    {
      key: "Oekobaudat Baustoff",
      value: layerData.process_config_name,
    },
    {
      key: "Bezugsmenge ÖkoBau.dat",
      value: "DUMMY PLACEHOLDER",
    },
    {
      key: "Verbaute Menge",
      value: layerData.quantity,
    },
    {
      key: "Einheit Bezugsmenge",
      value: unitName,
    },
    {
      key: "Verbaute Menge Einheit",
      value: layerData.quantity,
    },
    {
      key: "Masse [kg]",
      value: mass.toFixed(2),
    },
    {
      key: "Schichtdicke [m]",
      value: layerData.layer_size,
    },
  ]

  return (
    <div className="mb-6 overflow-hidden border border-gray-200 bg-white p-6">
      <div className="flex items-start">
        <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
        <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
          {layerNumber} - {layerData.process_name}
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="">
          <SideBySideDescriptionListsWithHeadline data={layerKeyValues} />

          {/* <dl className="">
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Laufende Nummer</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">layerData.lnr</dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Masse [kg]</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">layerData.mass.toFixed(2)</dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Geometrie der Bauteilschichten/ Komponenten</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                layerData.materialGeometry.amount.toFixed(2) layerData.materialGeometry.unit
              </dd>
            </div>
          </dl> */}
        </div>
      </div>
      {/* <LayerDetailInfo layerData={layerData} /> */}
    </div>
  )
}
export default ComponentLayer
