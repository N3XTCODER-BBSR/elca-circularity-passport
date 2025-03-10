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

import Image from "next/image"
import { useFormatter, useTranslations } from "next-intl"
import { Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import LayerDetailInfo from "./(components)/LayerDetailInfo"

type ComponentLayerProps = {
  layerData: Material
  layerNumber: number
}

const ComponentLayer = ({ layerData, layerNumber }: ComponentLayerProps) => {
  const t = useTranslations("Grp.Web.sections.detailPage.componentLayer")
  const unitsTranslations = useTranslations("Units")
  const format = useFormatter()

  return (
    <div className="mb-6 overflow-hidden border border-gray-200 bg-white p-6">
      <div className="flex items-start">
        <Image src="/component-layer.svg" alt="layer-icon" width={20} height={20} />
        <h2 className="ml-2 text-2xl font-semibold leading-6 text-gray-900">
          {layerNumber} - {layerData.name}
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="">
          <dl className="">
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">{t("sequenceNumber")}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{layerData.layerIndex}</dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">{t("mass")}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0" data-testid="mass-value__dd">
                {format.number(layerData.massInKg, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}{" "}
                {unitsTranslations("Kg.short")}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">{t("materialGeometry")}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {format.number(layerData.materialGeometry.amount, { maximumFractionDigits: 2 })}{" "}
                {layerData.materialGeometry.unit}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <LayerDetailInfo materialData={layerData} />
    </div>
  )
}
export default ComponentLayer
