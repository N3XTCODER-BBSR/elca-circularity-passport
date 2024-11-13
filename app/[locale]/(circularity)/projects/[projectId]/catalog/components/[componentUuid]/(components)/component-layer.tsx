"use client"

import Image from "next/image"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import CircularityInfo from "./circularity-info"

type ComponentLayerProps = {
  layerData: EnrichedElcaElementComponent
  layerNumber: number
  unitName: string
  tBaustoffProducts: SelectOption[]
}

const ComponentLayer = ({ layerData, layerNumber, unitName, tBaustoffProducts }: ComponentLayerProps) => {
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
      value: layerData.oekobaudat_process_uuid,
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
          <CircularityInfo layerData={layerData} tBaustoffProducts={tBaustoffProducts} />
        </div>
      </div>
    </div>
  )
}
export default ComponentLayer
