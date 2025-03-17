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
import { useTranslations } from "next-intl"
import { useState } from "react"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { AccordionItemFull } from "app/(components)/generic/AccordionItem"
import {
  Area,
  Badge,
  ErrorText,
  Heading3,
  Heading4,
  Required,
  StyledDd,
  StyledDt,
  TwoColGrid,
} from "app/(components)/generic/layout-elements"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { updateDismantlingPotentialClassId } from "lib/domain-logic/circularity/server-actions/updateDismantlingPotentialClassId"
import { updateSpecificEolScenario } from "lib/domain-logic/circularity/server-actions/updateSpecificScenario"
import {
  dismantlingPotentialClassIdMapping,
  getEolClassNameByPoints,
  getEolPointsByScenario,
} from "lib/domain-logic/circularity/utils/circularityMappings"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import { DismantlingPotentialClassId, TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import EOLScenarioEditButton from "./layer-details/circularity-info/circularity-details/EOLScenarioEditButton"
import EolScenarioInfoBox from "./layer-details/circularity-info/circularity-details/EolScenarioInfoBox"
import TBaustoffProductNameOrSelectorButton from "./layer-details/circularity-info/TBaustoffProductNameOrSelectorButton"

type EolDataSectionProps = {
  layerData: EnrichedElcaElementComponent
  isUpdating: boolean
  onSaveSpecificEolScenario: (
    selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
    proofText: string
  ) => void
}

const getEolUnbuiltKeyValues = (layerData: EnrichedElcaElementComponent) => {
  if (layerData.eolUnbuiltSpecificScenario) {
    const eolPoints = getEolPointsByScenario(layerData.eolUnbuiltSpecificScenario)
    return [
      {
        key: "EOL Klasse (Spezifisch)", // TODO: i18n
        value: eolPoints,
      },
      {
        key: "EOL Punkte (Spezifisch)", // TODO: i18n
        value: getEolClassNameByPoints(eolPoints),
      },
    ]
  } else if (layerData.tBaustoffProductData?.eolData) {
    return [
      {
        key: "EOL Klasse - (Total)", // TODO: i18n
        value: layerData.tBaustoffProductData.eolData?.eolUnbuiltTotalClassName,
      },
      {
        key: "EOL Punkte (Total)", // TODO: i18n
        value: layerData.tBaustoffProductData.eolData?.eolUnbuiltTotalPoints,
      },
    ]
  } else {
    return []
  }
}

const EolDataSection = ({ layerData, isUpdating, onSaveSpecificEolScenario }: EolDataSectionProps) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo")
  if (layerData.tBaustoffProductData == null) {
    return null
  }
  const eolUnbuiltData = getEolUnbuiltKeyValues(layerData)
  const eolUnbuiltDataSecondary = [
    // POTENTIAL
    {
      key: "EOL Klasse (Potenzial)", // TODO: i18n
      value: layerData.tBaustoffProductData.eolData?.eolUnbuiltPotentialClassName,
    },
    {
      key: "EOL Punkte (Potenzial)", // TODO: i18n
      value: layerData.tBaustoffProductData.eolData?.eolUnbuiltPotentialPoints,
    },
    // REAL
    {
      key: "EOL Klasse (Real)", // TODO: i18n
      value: layerData.tBaustoffProductData.eolData?.eolUnbuiltRealClassName,
    },
    {
      key: "EOL Punkte (Real)", // TODO: i18n
      value: layerData.tBaustoffProductData.eolData?.eolUnbuiltRealPoints,
    },
  ]

  const showDetailsAccordion = layerData.eolUnbuiltSpecificScenario == null

  return (
    <Area>
      <div className="flex flex-row justify-between">
        <div className="w-1/3">
          <Heading4>
            {t("CircularityPotential.title")} - Unverbaut <Required />
          </Heading4>
        </div>
        <div className="flex w-2/3 flex-row items-center justify-end">
          <div className="flex flex-row">
            <EolScenarioInfoBox layerData={layerData} />
          </div>
          {/* TODO: consider to remove the isUpdating prop - instead use isPending from react-query inside of the component */}
          <EOLScenarioEditButton layerData={layerData} />
        </div>
      </div>
      <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltData} className="md:border" />
      {showDetailsAccordion && (
        <Accordion transition transitionTimeout={200}>
          <AccordionItemFull header={<span className="text-xs">Details</span>}>
            <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltDataSecondary} className="md:border" />
          </AccordionItemFull>
        </Accordion>
      )}
    </Area>
  )
}

type CircularityInfoProps = { layerData: EnrichedElcaElementComponent; tBaustoffProducts: SelectOption[] }
const CircularityInfo = (props: CircularityInfoProps) => {
  const { tBaustoffProducts } = props
  const t = useTranslations()
  const circularityInfoTranslations = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const tDismantlingPotentialClassNames = useTranslations(
    "Grp.Web.Sections.detailPage.componentLayer.circularity.dismantlingClassNames"
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setDismantlingPotentialClassId = async (id: DismantlingPotentialClassId) => {
    setIsUpdating(true)
    setError(null)
    try {
      const newIdOrNull = props.layerData.dismantlingPotentialClassId === id ? null : id
      const result = await updateDismantlingPotentialClassId(props.layerData.component_id, newIdOrNull)
      if (!result.success) {
        toast.error(t(result.errorI18nKey))
        setError(result.errorI18nKey || null)
      }
    } catch (err: any) {
      console.error("Error saving selection:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const onSaveSpecificEolScenario = async (
    selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
    proofText: string
  ) => {
    setIsUpdating(true)
    setError(null)
    try {
      const result = await updateSpecificEolScenario(props.layerData.component_id, selectedEolScenario, proofText)
      if (!result.success) {
        toast.error(t(result.errorI18nKey))
        setError(result.errorI18nKey || null)
      }
    } catch (err: any) {
      console.error("Error saving selection:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const showCircularityDetails = props.layerData.tBaustoffProductData

  const eolUnbuiltDataSecondary = [
    // POTENTIAL
    {
      key: "Klasse Rückbau", //t("..."), // TODO: i18n
      value: props.layerData.dismantlingPotentialClassId ?? "-",
    },
    {
      key: "Punkte Rückbau", //t("..."), // TODO: i18n
      value: props.layerData.dismantlingPotentialClassId
        ? dismantlingPotentialClassIdMapping[props.layerData.dismantlingPotentialClassId].points
        : "-",
    },
  ]

  return (
    <div className="p-4">
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">An Error Occurred</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-row">
        <Heading3>{circularityInfoTranslations("title")}</Heading3>
        <div className="ml-4">
          <Badge>Unvollständig</Badge>
        </div>
      </div>
      <Area>
        <TwoColGrid>
          <StyledDt>
            tBaustoff Baustoff <Required />
          </StyledDt>
          <StyledDd justifyEnd>
            <TBaustoffProductNameOrSelectorButton layerData={props.layerData} options={tBaustoffProducts} />
          </StyledDd>
        </TwoColGrid>
      </Area>
      {/* TODO: consider to put the following into a sub-component */}
      {showCircularityDetails && (
        <Area>
          <div className="flex flex-row justify-between">
            <Heading4>
              Rückbaupotential <Required />
            </Heading4>
            {props.layerData.dismantlingPotentialClassId === null && (
              <ErrorText className="mr-4">Please select the rebuild potential</ErrorText>
            )}
          </div>

          <div>
            <div className="isolate flex flex-wrap justify-center gap-4">
              {Object.entries(dismantlingPotentialClassIdMapping).map(([key, value]) => {
                const isDisabled =
                  isUpdating ||
                  (props.layerData.dismantlingPotentialClassId != null &&
                    props.layerData.dismantlingPotentialClassId !== key)

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isDisabled}
                    className={twMerge(
                      `relative flex min-w-[400px] items-center justify-center rounded-md px-4 py-4 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10`,
                      key === props.layerData.dismantlingPotentialClassId
                        ? "bg-indigo-500 text-white ring-indigo-500 hover:bg-indigo-600 "
                        : "bg-white hover:bg-gray-50",
                      isDisabled ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200" : "cursor-pointer"
                    )}
                    onClick={() => setDismantlingPotentialClassId(key as DismantlingPotentialClassId)}
                  >
                    {tDismantlingPotentialClassNames(value.translationKey)}
                  </button>
                )
              })}
            </div>

            <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltDataSecondary} className="md:border" />
          </div>
        </Area>
      )}

      <EolDataSection
        isUpdating={isUpdating}
        layerData={props.layerData}
        onSaveSpecificEolScenario={onSaveSpecificEolScenario}
      />
    </div>
  )
}
export default CircularityInfo
