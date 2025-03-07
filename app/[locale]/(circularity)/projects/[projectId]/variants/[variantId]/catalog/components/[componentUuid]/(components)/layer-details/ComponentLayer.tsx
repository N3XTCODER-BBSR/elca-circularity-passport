"use client"

import { Accordion } from "@szhsin/react-accordion"
import { useMutation, useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useFormatter, useTranslations } from "next-intl"
import toast from "react-hot-toast"
import { AccordionItemFullSimple } from "app/(components)/generic/AccordionItem"
import { Badge } from "app/(components)/generic/layout-elements"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import Toggle from "app/(components)/generic/Toggle"
import getElcaComponentDataByProductId from "lib/domain-logic/circularity/server-actions/getElcaComponentDataByProductId"
import updateExludedProduct from "lib/domain-logic/circularity/server-actions/toggleExcludedProject"
import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import { CallServerActionError } from "lib/errors"
import CircularityInfo from "./circularity-info/CircularityInfo"

type ComponentLayerProps = {
  projectId: number
  variantId: number
  layerData: EnrichedElcaElementComponent
  layerNumber: number
  tBaustoffProducts: SelectOption[]
}

const ComponentLayer = ({ projectId, variantId, layerData, layerNumber, tBaustoffProducts }: ComponentLayerProps) => {
  const layerDataQuery = useQuery({
    queryKey: ["layerData", layerData.component_id],
    queryFn: async () => {
      const result = await getElcaComponentDataByProductId(variantId, projectId, layerData.component_id)

      if (result.success) {
        return result.data!
      }

      throw new CallServerActionError(result.errorI18nKey)
    },
    initialData: layerData,
    staleTime: Infinity,
  })

  const unitsTranslations = useTranslations("Units")
  const layerTranslations = useTranslations("Circularity.Components.Layers")
  const t = useTranslations()
  const router = useRouter()
  const format = useFormatter()

  const { data: currentLayerData, refetch: refetchLayerData } = layerDataQuery

  const updateExcludedProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const result = await updateExludedProduct(productId)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: async () => {
      await refetchLayerData()
      router.refresh()
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const setProductIsExcluded = () => {
    updateExcludedProductMutation.mutate(currentLayerData.component_id)
  }

  const optimisticProductIsExcluded = updateExcludedProductMutation.isPending
    ? !currentLayerData.isExcluded
    : currentLayerData.isExcluded

  // TODO: consider to do this calucation on the server side
  // (or at least be consistent with the other calculation in the conext of the overview page / project circularity index)
  const circulartyEnrichedLayerData = calculateCircularityDataForLayer(currentLayerData)

  const layerKeyValues: KeyValueTuple[] = [
    // {
    //   key: "Oekobaudat UUID",
    //   value: currentLayerData.oekobaudat_process_uuid,
    // },
    // {
    //   key: "Verbaute Menge",
    //   value: currentLayerData.quantity,
    // },
    // {
    //   key: "Verbaute Menge Einheit",
    //   value: currentLayerData.quantity,
    // },
    {
      key: layerTranslations("mass"),
      value: currentLayerData.mass
        ? `${format.number(currentLayerData.mass, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })} ${unitsTranslations("Kg.short")}`
        : "N/A",
      isRequired: true,
      testId: "mass",
    },
    // {
    //   key: "Schichtdicke [m]",
    //   value: currentLayerData.layer_size || "N/A",
    // },
    {
      key: layerTranslations("volume"),
      value:
        currentLayerData.volume != null
          ? `${format.number(currentLayerData.volume, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })} m3`
          : "N/A",
      isRequired: true,
    },
  ]

  const circularityInfo = currentLayerData.isExcluded ? null : (
    <CircularityInfo
      layerData={circulartyEnrichedLayerData}
      tBaustoffProducts={tBaustoffProducts}
      projectId={projectId}
      variantId={variantId}
    />
  )

  return (
    <div
      className="mb-6 overflow-hidden border border-gray-200 bg-white p-6"
      data-testid={`component-layer__div__${layerData.component_id}`}
    >
      <div className="flex justify-between gap-4">
        <div className="flex items-start">
          <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
          <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
            {layerNumber != null && layerNumber > 0 ? `${layerNumber} - ` : ""} {currentLayerData.process_name}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium leading-5 sm:gap-2">
          <div>{layerTranslations("excludedFromCalculation")}</div>
          <Toggle
            disabled={updateExcludedProductMutation.isPending}
            testId={layerData.component_id.toString()}
            isEnabled={optimisticProductIsExcluded}
            setEnabled={setProductIsExcluded}
            label="Exclude from calculation"
          />
        </div>
      </div>
      <Accordion transition transitionTimeout={200}>
        <AccordionItemFullSimple
          testId={layerData.component_id.toString()}
          header={
            !currentLayerData.isExcluded &&
            (!circulartyEnrichedLayerData.circularityIndex || !currentLayerData.volume) && (
              <div className="flex">
                <Badge>{layerTranslations("incomplete")}</Badge>
              </div>
            )
          }
        >
          <div className="mt-8 overflow-hidden">
            <div className="">
              <SideBySideDescriptionListsWithHeadline data={layerKeyValues} />
              {circularityInfo}
            </div>
          </div>
        </AccordionItemFullSimple>
      </Accordion>
    </div>
  )
}
export default ComponentLayer
