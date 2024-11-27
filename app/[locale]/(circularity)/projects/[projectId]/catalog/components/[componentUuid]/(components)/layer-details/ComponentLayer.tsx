"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import getElcaComponentDataByLayerId from "lib/domain-logic/circularity/server-actions/getElcaComponentDataByLayerId"
import calculateVolumeAndMass from "lib/domain-logic/circularity/utils/calculateVolumeAndMass"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import CircularityInfo from "./circularity-info/CircularityInfo"

type ComponentLayerProps = {
  layerData: EnrichedElcaElementComponent
  layerNumber: number
  unitName: string
  tBaustoffProducts: SelectOption[]
}

const ComponentLayer = ({ layerData, layerNumber, unitName, tBaustoffProducts }: ComponentLayerProps) => {
  const { data: currentLayerData } = useQuery<EnrichedElcaElementComponent, Error>({
    queryKey: ["layerData", layerData.component_id],
    queryFn: () => {
      return getElcaComponentDataByLayerId(layerData.component_id)
    },
    initialData: layerData,
    staleTime: Infinity,
  })

  const { volume, mass } = calculateVolumeAndMass(currentLayerData)

  const layerKeyValues: KeyValueTuple[] = [
    {
      key: "Schichtposition",
      value: currentLayerData.layer_position,
    },
    {
      key: "Volumen [m3]",
      value: volume.toFixed(2),
    },
    {
      key: "Oekobaudat UUID",
      value: currentLayerData.oekobaudat_process_uuid,
    },
    {
      key: "Rohdichte [kg/m3]",
      value: currentLayerData.process_config_density,
    },
    {
      key: "Oekobaudat Baustoff",
      value: currentLayerData.process_config_name,
    },
    {
      key: "Bezugsmenge ÖkoBau.dat",
      value: "DUMMY PLACEHOLDER",
    },
    {
      key: "Verbaute Menge",
      value: currentLayerData.quantity,
    },
    {
      key: "Einheit Bezugsmenge",
      value: unitName,
    },
    {
      key: "Verbaute Menge Einheit",
      value: currentLayerData.quantity,
    },
    {
      key: "Masse [kg]",
      value: mass.toFixed(2),
    },
    {
      key: "Schichtdicke [m]",
      value: currentLayerData.layer_size,
    },
  ]

  return (
    <div className="mb-6 overflow-hidden border border-gray-200 bg-white p-6">
      <div className="flex items-start">
        <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
        <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
          {layerNumber} - {currentLayerData.process_name}
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="">
          <SideBySideDescriptionListsWithHeadline data={layerKeyValues} />
          <CircularityInfo layerData={currentLayerData} tBaustoffProducts={tBaustoffProducts} />
        </div>
      </div>
    </div>
  )
}
export default ComponentLayer
