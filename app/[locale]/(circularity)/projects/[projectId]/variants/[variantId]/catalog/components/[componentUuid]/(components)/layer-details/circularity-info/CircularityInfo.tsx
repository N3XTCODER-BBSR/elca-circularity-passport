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

import { useTranslations } from "next-intl"
import { Area, Heading3, Required, StyledDd, StyledDt, TwoColGrid } from "app/(components)/generic/layout-elements"
import type { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import CircularityDetails from "./circularity-details/CircularityDetails"
import TBaustoffProductNameOrSelectorButton from "./TBaustoffProductNameOrSelectorButton"

type CircularityInfoProps = {
  projectId: number
  variantId: number
  layerData: CalculateCircularityDataForLayerReturnType
  tBaustoffProducts: SelectOption[]
}

const CircularityInfo = (props: CircularityInfoProps) => {
  const { tBaustoffProducts } = props
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo")

  const circulartyEnrichedLayerData = props.layerData

  const showCircularityDetails = !!circulartyEnrichedLayerData.tBaustoffProductData

  return (
    <div className="p-4">
      <div className="flex flex-row">
        <Heading3>{t("title")}</Heading3>
      </div>
      <Area>
        <TwoColGrid>
          <StyledDt>
            {t("tBaustoffMaterial")}
            <Required />
          </StyledDt>
          <StyledDd justifyEnd>
            <TBaustoffProductNameOrSelectorButton layerData={circulartyEnrichedLayerData} options={tBaustoffProducts} />
          </StyledDd>
        </TwoColGrid>
      </Area>

      {showCircularityDetails && (
        <CircularityDetails
          layerData={circulartyEnrichedLayerData}
          variantId={props.variantId}
          projectId={props.projectId}
        />
      )}
    </div>
  )
}

export default CircularityInfo
