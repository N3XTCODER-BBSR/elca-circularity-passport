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
import _ from "lodash"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getFormatter, getTranslations } from "next-intl/server"
import { Heading3, Heading4 } from "app/(components)/generic/layout-elements"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToElementByUuid } from "lib/auth/ensureAuthorized"
import {
  getAvailableTBaustoffProducts,
  getElcaVariantComponentsByInstanceId,
  getElcaVariantElementBaseDataByUuid,
} from "lib/domain-logic/circularity/components/getComponentsData"
import { ElcaElementWithComponents, EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "lib/domain-logic/circularity/misc/getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { preloadCircularityData } from "lib/domain-logic/circularity/misc/preloadCircularityData"
import { getTotalMass } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalMass"
import {
  getTotalVolume,
  MissingVolumeError,
} from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalVolume"
import { getTotalWeightedCircularityPotential } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalWeightedCircularityPotential"
import { getTotalWeightedDismantlingPotential } from "lib/domain-logic/circularity/utils/getTotalsForEnrichedElcaElementComponent/getTotalWeightedDismantlingPotential"
import { getDinCodeGroupLevel } from "lib/presentation-logic/circularity/formatDinCode"
import { formatVolumeWithUnit } from "lib/presentation-logic/circularity/formatVolumeWithUnit"

import {
  CircularityPotentialBadge,
  DescriptionItem,
  DismantlingPotentialBadge,
  HorizontalDescriptionItem,
} from "./(components)/CircularityIndication"
import HistoryBackButton from "./(components)/HistoryBackButton"
import ComponentLayer from "./(components)/layer-details/ComponentLayer"

const Page = async ({
  params,
}: {
  params: { projectId: string; variantId: string; componentUuid: string; locale: string }
}) => {
  return withServerComponentErrorHandling(async () => {
    const { componentUuid } = params
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)

    // Ensure the user is authenticated
    const session = await ensureUserIsAuthenticated()

    // Ensure the user has access to the element
    await ensureUserAuthorizationToElementByUuid(Number(session.user.id), componentUuid)

    // Get element base data
    const elementBaseData = await getElcaVariantElementBaseDataByUuid(componentUuid, variantId, projectId)

    // Get component data
    const projectComponents = await getElcaVariantComponentsByInstanceId(elementBaseData.uuid, variantId, projectId)

    const preloadedData = await preloadCircularityData(projectComponents, projectId)

    const componentData: ElcaElementWithComponents<EnrichedElcaElementComponent> =
      await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
        elementBaseData,
        projectComponents,
        preloadedData.excludedProductIdsSet,
        preloadedData.userEnrichedMap,
        preloadedData.tBaustoffMappingEntriesMap,
        preloadedData.tBaustoffProductMap,
        preloadedData.productMassMap
      )

    const [layers, nonLayers] = _.partition(componentData.layers, (layer) => layer.is_layer)

    if (componentData == null) {
      notFound()
    }

    const availableTBaustoffProducts = await getAvailableTBaustoffProducts()
    const availableTBaustoffProductIdAndNames = availableTBaustoffProducts.map((el) => ({
      id: `${el.id}`,
      value: el.name,
    }))

    const t = await getTranslations("Circularity.Components")

    return (
      <div>
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
              />
            </div>
          )}
        </div>
      </div>
    )
  })
}

const ProductsList = ({
  products,
  projectId,
  variantId,
  availableTBaustoffProductIdAndNames,
}: {
  products: EnrichedElcaElementComponent[]
  projectId: number
  variantId: number
  availableTBaustoffProductIdAndNames: { id: string | number; value: string }[]
}) => {
  // Convert the id to string to match the SelectOption type
  const formattedProducts = availableTBaustoffProductIdAndNames.map((product) => ({
    id: String(product.id),
    value: product.value,
  }))

  return (
    <ul>
      {products.map((product) => (
        <li key={product.component_id}>
          <ComponentLayer
            projectId={projectId}
            variantId={variantId}
            layerData={product}
            layerNumber={product.layer_position}
            tBaustoffProducts={formattedProducts}
          />
        </li>
      ))}
    </ul>
  )
}

const ComponentDescription = async ({
  componentData,
}: {
  componentData: ElcaElementWithComponents<EnrichedElcaElementComponent>
}) => {
  const format = await getFormatter()
  const t = await getTranslations("Circularity.Components")
  const headersTranslations = await getTranslations("Circularity.Components.headers")
  const unitsTranslations = await getTranslations("Units")

  const dinGroupLevelNumber = getDinCodeGroupLevel(componentData.din_code)

  const totalWeightedCircularityPotential = getTotalWeightedCircularityPotential(componentData.layers)
  const totalWeightedDismantlingPotential = getTotalWeightedDismantlingPotential(componentData.layers)

  const totalMass = getTotalMass(componentData.layers)

  let totalVolumeString = ""
  try {
    const totalVolume = getTotalVolume(componentData.layers)
    totalVolumeString = formatVolumeWithUnit(totalVolume, format)
  } catch (error) {
    if (error instanceof MissingVolumeError) {
      totalVolumeString = "N/A"
    }
  }

  return (
    <div className="overflow-hidden border border-gray-200">
      <dl className="mb-3 py-2">
        <DescriptionItem label={t("name")} value={componentData.element_name} testId="name" />
        <DescriptionItem label={t("uuid")} value={componentData.element_uuid} testId="uuid" />
        <DescriptionItem label={t("costGroup")} value={dinGroupLevelNumber} testId="cost-group" />
        <DescriptionItem
          label={t("numberInstalled")}
          value={format.number(componentData.quantity, { maximumFractionDigits: 2 })}
          testId="number-installed"
        />
        <DescriptionItem label={t("referenceUnit")} value={componentData.unit} testId="ref-unit" />
      </dl>
      <div className="border-gray-20 grid grid-cols-3 border-t">
        <HorizontalDescriptionItem
          title={headersTranslations("materialDensity")}
          hasBorderRight
          labelValuePairs={[
            {
              label: headersTranslations("metrics.mass"),
              value: totalMass
                ? `${format.number(totalMass, { maximumFractionDigits: 2 })} ${unitsTranslations("Kg.short")}`
                : "-",
            },
            {
              label: headersTranslations("metrics.volume"),
              valueItem:
                totalVolumeString === "N/A" ? (
                  <span className="text-base font-semibold text-red">{totalVolumeString}</span>
                ) : undefined,
              value: totalVolumeString !== "N/A" ? totalVolumeString : undefined,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title={`${headersTranslations("dismantlingPotential")}:`}
          hasBorderRight
          labelValuePairs={[
            {
              label: headersTranslations("metrics.points"),
              value:
                totalWeightedDismantlingPotential !== null
                  ? format.number(totalWeightedDismantlingPotential, { maximumFractionDigits: 2 })
                  : "-",
            },
            {
              label: headersTranslations("metrics.class"),
              valueItem: <DismantlingPotentialBadge value={totalWeightedDismantlingPotential} />,
            },
          ]}
        />
        <HorizontalDescriptionItem
          title={`${headersTranslations("circularityPotential")}:`}
          labelValuePairs={[
            {
              label: headersTranslations("metrics.points"),
              value:
                totalWeightedCircularityPotential !== null
                  ? format.number(totalWeightedCircularityPotential, { maximumFractionDigits: 2 })
                  : "-",
            },
            {
              label: headersTranslations("metrics.class"),
              valueItem: <CircularityPotentialBadge value={totalWeightedCircularityPotential} />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default Page
