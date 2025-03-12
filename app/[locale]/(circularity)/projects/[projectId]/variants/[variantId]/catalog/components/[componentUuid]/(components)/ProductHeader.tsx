"use client"

import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useFormatter, useTranslations } from "next-intl"
import { FC } from "react"
import toast from "react-hot-toast"
import Toggle from "app/(components)/generic/Toggle"
import updateExludedProduct from "lib/domain-logic/circularity/server-actions/toggleExcludedProject"
import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { dismantlingPotentialClassIdMapping } from "lib/domain-logic/circularity/utils/circularityMappings"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { CallServerActionError } from "lib/errors"
import {
  CircularityPotentialBadge,
  DismantlingPotentialBadge,
  HorizontalDescriptionItem,
} from "./CircularityIndication"

const ProductHeader: FC<{
  layerData: EnrichedElcaElementComponent
  layerNumber: number
  refetchLayerData: (options?: RefetchOptions) => Promise<QueryObserverResult<EnrichedElcaElementComponent, Error>>
}> = ({ layerData, layerNumber, refetchLayerData }) => {
  const t = useTranslations()
  const layerTranslations = useTranslations("Circularity.Components.Layers")
  const componentsTranslations = useTranslations("Circularity.Components")
  const format = useFormatter()

  const router = useRouter()

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
    updateExcludedProductMutation.mutate(layerData.component_id)
  }

  const optimisticProductIsExcluded = updateExcludedProductMutation.isPending
    ? !layerData.isExcluded
    : layerData.isExcluded

  const dismantlingPotential =
    layerData.dismantlingPotentialClassId === null || layerData.dismantlingPotentialClassId === undefined
      ? null
      : dismantlingPotentialClassIdMapping[layerData.dismantlingPotentialClassId].points

  const circulartyEnrichedLayerData = calculateCircularityDataForLayer(layerData)

  const circularityPotential = circulartyEnrichedLayerData.eolBuilt?.points ?? null

  const notBuildEol = circulartyEnrichedLayerData.eolUnbuilt?.points ?? null

  const disturbingSubstances = layerData.disturbingSubstanceSelections.length
    ? layerData.disturbingSubstanceSelections
        .filter((selection) => !!selection.disturbingSubstanceClassId)
        .map((selection) => selection.disturbingSubstanceClassId)
        .join(", ")
    : "-"

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="flex items-start">
          <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
          <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
            {layerNumber != null && layerNumber > 0 ? `${layerNumber} - ` : ""} {layerData.process_name}
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
      <div className="border-gray-20 my-6 grid grid-cols-4 border">
        <HorizontalDescriptionItem
          title={`${componentsTranslations("dismantlingPotential")}:`}
          hasBorderRight
          labelValuePairs={[
            {
              label: "Punkte",
              value:
                dismantlingPotential !== null ? format.number(dismantlingPotential, { maximumFractionDigits: 2 }) : "-",
            },
            {
              label: "Klasse",
              valueItem: <DismantlingPotentialBadge value={dismantlingPotential} />,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title="EOL (unverbaut)"
          hasBorderRight
          labelValuePairs={[
            {
              label: "Punkte",
              value: notBuildEol !== null ? format.number(notBuildEol, { maximumFractionDigits: 2 }) : "-",
            },
            {
              label: "Klasse",
              valueItem: <CircularityPotentialBadge value={notBuildEol} />,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title="Material per m²:"
          hasBorderRight
          labelValuePairs={[
            { label: "Punkte", value: "71.11" },
            { label: "Klasse", value: disturbingSubstances },
          ]}
        />
        <HorizontalDescriptionItem
          title={`${componentsTranslations("circularityPotential")}:`}
          labelValuePairs={[
            {
              label: "Punkte",
              value:
                circularityPotential !== null ? format.number(circularityPotential, { maximumFractionDigits: 2 }) : "-",
            },
            {
              label: "Klasse",
              valueItem: <CircularityPotentialBadge value={circularityPotential} />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default ProductHeader
