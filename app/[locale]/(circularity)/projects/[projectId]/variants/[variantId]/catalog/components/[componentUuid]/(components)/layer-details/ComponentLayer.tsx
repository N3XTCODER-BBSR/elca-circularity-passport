"use client"

import { useMutation, useQueries } from "@tanstack/react-query"
import Image from "next/image"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import Toggle from "app/(components)/generic/Toggle"
import getElcaComponentDataByLayerId from "lib/domain-logic/circularity/server-actions/getElcaComponentDataByLayerId"
import updateExludedProduct from "lib/domain-logic/circularity/server-actions/toggleExcludedProject"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import CircularityInfo from "./circularity-info/CircularityInfo"

type ComponentLayerProps = {
  projectId: number
  variantId: number
  layerData: EnrichedElcaElementComponent
  layerNumber: number
  unitName: string
  tBaustoffProducts: SelectOption[]
}

const ComponentLayer = ({
  projectId,
  variantId,
  layerData,
  layerNumber,
  unitName,
  tBaustoffProducts,
}: ComponentLayerProps) => {
  const [layerDataQuery] = useQueries({
    queries: [
      {
        queryKey: ["layerData", layerData.component_id],
        queryFn: () => {
          return getElcaComponentDataByLayerId(variantId, projectId, layerData.component_id)
        },
        initialData: layerData,
        staleTime: Infinity,
      },
    ],
  })

  const { data: currentLayerData, refetch: refetchLayerData } = layerDataQuery

  const updateExcludedProductMutation = useMutation({
    mutationFn: updateExludedProduct,
    onSettled: async () => {
      await refetchLayerData()
    },
  })

  const setProductIsExcluded = () => {
    updateExcludedProductMutation.mutate(currentLayerData.component_id)
  }

  const optimisticProductIsExcluded = updateExcludedProductMutation.isPending
    ? !currentLayerData.isExcluded
    : currentLayerData.isExcluded

  const layerKeyValues: KeyValueTuple[] = [
    {
      key: "Schichtposition",
      value: currentLayerData.layer_position,
    },
    {
      key: "Volumen [m3]",
      value: currentLayerData.volume?.toFixed(2) || "N/A",
    },
    {
      key: "Oekobaudat UUID",
      value: currentLayerData.oekobaudat_process_uuid,
    },
    {
      key: "Rohdichte [kg/m3]",
      value: currentLayerData.process_config_density || "N/A",
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
      value: currentLayerData.mass?.toFixed(2) || "N/A",
    },
    {
      key: "Schichtdicke [m]",
      value: currentLayerData.layer_size || "N/A",
    },
  ]

  const circularityInfo = currentLayerData.isExcluded ? null : (
    <CircularityInfo
      layerData={currentLayerData}
      tBaustoffProducts={tBaustoffProducts}
      projectId={projectId}
      variantId={variantId}
    />
  )

  return (
    <div className="mb-6 overflow-hidden border border-gray-200 bg-white p-6">
      <div className="flex justify-between gap-4">
        <div className="flex items-start">
          <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
          <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
            {layerNumber} - {currentLayerData.process_name}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium leading-5 sm:gap-2">
          <div>Excluded from calculation</div>
          <Toggle
            isEnabled={optimisticProductIsExcluded}
            setEnabled={setProductIsExcluded}
            label="Exclude from calculation"
          />
        </div>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="">
          <SideBySideDescriptionListsWithHeadline data={layerKeyValues} />
          {circularityInfo}
        </div>
      </div>
    </div>
  )
}
export default ComponentLayer
