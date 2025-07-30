"use client"

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

import { useQuery } from "@tanstack/react-query"
import _ from "lodash"
import Image from "next/image"

import { useTranslations } from "next-intl"
import { Heading3, Heading4 } from "app/(components)/generic/layout-elements"

import { ElcaElementWithComponents } from "lib/domain-logic/circularity/misc/domain-types"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { SelectOption } from "lib/presentation-logic/helper-types"
import { ComponentDescription } from "./ComponentsDescription"
import HistoryBackButton from "./HistoryBackButton"
import { ProductsList } from "./ProductsList"

type ComponentPageClientComponentProps = {
  initialComponentData: ElcaElementWithComponents<EnrichedElcaElementComponent>
  availableTBaustoffProductIdAndNames: SelectOption[]
  projectId: number
  variantId: number
  componentUuid: string
}

export const ComponentPageClientComponent = ({
  initialComponentData,
  projectId,
  variantId,
  componentUuid,
  availableTBaustoffProductIdAndNames,
}: ComponentPageClientComponentProps) => {
  const t = useTranslations("Circularity.Components")

  const { data: componentData } = useQuery({
    queryKey: ["componentData", projectId, variantId, componentUuid],
    queryFn: () =>
      fetch(`/api/projects/${projectId}/variants/${variantId}/components/${componentUuid}`).then(
        (res) => res.json() as Promise<ElcaElementWithComponents<EnrichedElcaElementComponent>>
      ),
    initialData: initialComponentData,
  })

  const [layers, nonLayers] = _.partition(componentData.layers, (layer) => layer.is_layer)

  return (
    <div className="w-full">
      <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
        <section className="dark:bg-gray-900">
          <div className="py-8">
            <HistoryBackButton />
            <h1 className="mt-12 text-2xl font-semibold leading-6">{componentData.element_name}</h1>
            <div className="flex flex-col md:flex-row">
              <div className="w-full py-4 md:w-1/3">
                {" "}
                <Image src="/component_placeholder_lg.png" alt={componentData?.element_name} width={400} height={400} />
              </div>
              <div className="w-full md:w-2/3 md:p-4">
                <ComponentDescription componentData={componentData} />
              </div>
            </div>
            <div className="mb-12 flex flex-col gap-2">
              <Heading3>{t("buildingMaterialsHeading", { refUnit: componentData.unit })}</Heading3>
              {layers.length < 1 && nonLayers.length < 1 && (
                <span className="text-sm font-medium text-gray-900">{t("noBuildingMaterials")}</span>
              )}
              {layers.length > 0 && (
                <div className="mb-12 flex flex-col gap-2">
                  <Heading4>{t("layersHeading")}</Heading4>
                  <ProductsList
                    products={layers}
                    projectId={projectId}
                    variantId={variantId}
                    availableTBaustoffProductIdAndNames={availableTBaustoffProductIdAndNames}
                    componentUuid={componentUuid}
                  />
                </div>
              )}
              {nonLayers.length > 0 && (
                <div className="mb-12 flex flex-col gap-2">
                  <Heading4>{t("nonLayersHeading")}</Heading4>
                  <ProductsList
                    products={nonLayers}
                    projectId={projectId}
                    variantId={variantId}
                    availableTBaustoffProductIdAndNames={availableTBaustoffProductIdAndNames}
                    componentUuid={componentUuid}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
