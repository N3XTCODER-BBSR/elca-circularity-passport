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

import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useFormatter, useTranslations } from "next-intl"
import { FC } from "react"
import toast from "react-hot-toast"
import Toggle from "app/(components)/generic/Toggle"
import { toggleExcludedProduct } from "app/[locale]/(circularity)/(server-actions)/toggleExcludedProduct"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  calculateMaterialCompatibility,
  getDisturbingSubstancesString,
} from "lib/domain-logic/circularity/utils/getDisturbingSubstancesString"
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
  const productTranslations = useTranslations("Circularity.Components.Layers.headers")
  const metricsTranslations = useTranslations("Circularity.Components.Layers.headers.metrics")
  const format = useFormatter()

  const router = useRouter()

  const updateExcludedProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const result = await toggleExcludedProduct(productId)
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

  const circulartyEnrichedLayerData = calculateCircularityDataForLayer(layerData)

  const materialCompatibility = calculateMaterialCompatibility(circulartyEnrichedLayerData)

  const disturbingSubstancesClassStr = getDisturbingSubstancesString(layerData)

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
            label={layerTranslations("excludedFromCalculation")}
          />
        </div>
      </div>
      <div className="border-gray-20 my-6 grid grid-cols-4 border">
        <HorizontalDescriptionItem
          title={productTranslations("eolUnbuilt")}
          hasBorderRight
          labelValuePairs={[
            {
              label: metricsTranslations("points"),
              value:
                circulartyEnrichedLayerData.eolUnbuilt?.points != null
                  ? format.number(circulartyEnrichedLayerData.eolUnbuilt?.points, { maximumFractionDigits: 2 })
                  : "-",
            },
            {
              label: metricsTranslations("class"),
              valueItem: <CircularityPotentialBadge value={circulartyEnrichedLayerData.eolUnbuilt?.points} />,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title={productTranslations("dismantlingPotential")}
          hasBorderRight
          labelValuePairs={[
            {
              label: metricsTranslations("points"),
              value:
                circulartyEnrichedLayerData.dismantlingPoints != null
                  ? format.number(circulartyEnrichedLayerData.dismantlingPoints, { maximumFractionDigits: 2 })
                  : "-",
            },
            {
              label: metricsTranslations("class"),
              valueItem: <DismantlingPotentialBadge value={circulartyEnrichedLayerData.dismantlingPoints || null} />,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title={productTranslations("materialCompatibility")}
          hasBorderRight
          labelValuePairs={[
            {
              label: metricsTranslations("points"),
              value:
                materialCompatibility !== null
                  ? format.number(materialCompatibility, { maximumFractionDigits: 2 })
                  : "-",
            },
            { label: metricsTranslations("class"), value: disturbingSubstancesClassStr },
          ]}
        />
        <HorizontalDescriptionItem
          title={productTranslations("circularityPotential")}
          labelValuePairs={[
            {
              label: metricsTranslations("points"),
              value:
                circulartyEnrichedLayerData.eolBuilt?.points != null
                  ? format.number(circulartyEnrichedLayerData.eolBuilt?.points, { maximumFractionDigits: 2 })
                  : "-",
            },
            {
              label: metricsTranslations("class"),
              valueItem: <CircularityPotentialBadge value={circulartyEnrichedLayerData.eolBuilt?.points} />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default ProductHeader
