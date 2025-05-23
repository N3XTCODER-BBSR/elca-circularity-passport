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

import { Accordion } from "@szhsin/react-accordion"
import { useQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "next-intl"
import { AccordionItemFullSimple } from "app/(components)/generic/AccordionItem"
import { Badge } from "app/(components)/generic/layout-elements"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import getElcaComponentDataByProductId from "app/[locale]/(circularity)/(server-actions)/getElcaComponentDataByProductId"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { CallServerActionError } from "lib/errors"
import { SelectOption } from "lib/presentation-logic/helper-types"
import CircularityInfo from "./circularity-info/CircularityInfo"
import ProductHeader from "../ProductHeader"

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
  const format = useFormatter()

  const { data: currentLayerData, refetch: refetchLayerData } = layerDataQuery

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
      testId: "volume",
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
      {!currentLayerData.isExcluded && (!circulartyEnrichedLayerData.circularityIndex || !currentLayerData.volume) && (
        <div className="mb-6 flex">
          <Badge testId={layerData.component_id.toString()}>{layerTranslations("incomplete")}</Badge>
        </div>
      )}
      <ProductHeader layerData={currentLayerData} layerNumber={layerNumber} refetchLayerData={refetchLayerData} />
      <Accordion transition transitionTimeout={200}>
        <AccordionItemFullSimple testId={layerData.component_id.toString()} header={<></>}>
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
