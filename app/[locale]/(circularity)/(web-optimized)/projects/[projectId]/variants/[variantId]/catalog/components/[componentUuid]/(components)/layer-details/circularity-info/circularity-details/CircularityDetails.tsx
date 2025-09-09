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
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { Accordion } from "@szhsin/react-accordion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { AccordionItemFull } from "app/(components)/generic/AccordionItem"
import { Area, EditButton, ErrorText, Heading4, Required } from "app/(components)/generic/layout-elements"
import { StyledDd, StyledDt, TwoColGrid } from "app/(components)/generic/layout-elements"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { useDebounce } from "app/(utils)/useDebounce"
import { addOrUpdateDisturbingSubstanceSelection } from "app/[locale]/(circularity)/(server-actions)/addOrUpdateDisturbingSubstance"
import { removeDisturbingSubstanceSelection } from "app/[locale]/(circularity)/(server-actions)/removeDisturbingSubstances"
import { updateDismantlingPotentialClassId } from "app/[locale]/(circularity)/(server-actions)/updateDismantlingPotentialClassId"
import { updateDismantlingPotentialRemark } from "app/[locale]/(circularity)/(server-actions)/updateDismantlingPotentialRemark"
import { updateDisturbingEolScenarioForS4 } from "app/[locale]/(circularity)/(server-actions)/updateDisturbingEolScenarioForS4"
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/circularity/misc/domain-types"
import {
  CalculateCircularityDataForLayerReturnType,
  EolUnbuiltData,
  SpecificOrTotal,
} from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  dismantlingPotentialClassIdMapping,
  EOLScenarioMap,
} from "lib/domain-logic/circularity/utils/circularityMappings"
import { CallServerActionError } from "lib/errors"
import { useCircularityFormatter } from "lib/presentation-logic/circularity/useCircularityFormatter"
import { DismantlingPotentialClassId, TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import BuiltS4SpecificScenarioModal from "./disturbing-substances/BuiltS4SpecificScenarioModal"
import DisturbingSubstances from "./DisturbingSubstances"
import EOLScenarioEditButton from "./EOLScenarioEditButton"
import EolScenarioInfoBox from "./EolScenarioInfoBox"
import Modal from "../../../Modal"

type EolDataSectionProps = {
  layerDatacirculartyEnrichedLayerData: CalculateCircularityDataForLayerReturnType
}

type Translation = (text: string) => string

const formatEolUnbuiltData = (
  data: EolUnbuiltData | null,
  formatCircularityMetric: (value: number | null | undefined) => string,
  t: Translation
) => {
  if (!data) {
    return []
  }

  const { specificOrTotal, points: eolPoints, className: eolClassName } = data
  const keySuffix = specificOrTotal === SpecificOrTotal.Specific ? "(Spezifisch)" : "(Total)" // TODO: i18n

  return [
    {
      key: `${t("EolUnbuilt.Class.class")} ${keySuffix}`, // TODO: i18n
      value: eolClassName,
      testId: "eol-unbuilt-class",
    },
    {
      key: `${t("EolUnbuilt.Points.points")} ${keySuffix}`, // TODO: i18n
      value: formatCircularityMetric(eolPoints),
      testId: "eol-unbuilt-points",
    },
  ]
}

const EolDataSection = ({ layerDatacirculartyEnrichedLayerData }: EolDataSectionProps) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolDataSection")
  const { formatCircularityMetric } = useCircularityFormatter()

  if (layerDatacirculartyEnrichedLayerData.tBaustoffProductData == null) {
    return null
  }
  const eolUnbuiltData = formatEolUnbuiltData(
    layerDatacirculartyEnrichedLayerData.eolUnbuilt,
    formatCircularityMetric,
    t
  )
  const eolUnbuiltDataSecondary = [
    // POTENTIAL
    {
      key: t("EolUnbuilt.Class.potential"),
      value: layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData?.eolUnbuiltPotentialClassName,
    },
    {
      key: t("EolUnbuilt.Points.potential"),
      value:
        layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData?.eolUnbuiltPotentialPoints != null
          ? formatCircularityMetric(
              layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData.eolUnbuiltPotentialPoints
            )
          : "-",
    },
    // REAL
    {
      key: t("EolUnbuilt.Class.real"),
      value: layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData?.eolUnbuiltRealClassName,
    },
    {
      key: t("EolUnbuilt.Points.real"),
      value:
        layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData?.eolUnbuiltRealPoints != null
          ? formatCircularityMetric(
              layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData?.eolUnbuiltRealPoints
            )
          : "-",
    },
  ]

  const showDetailsAccordion = layerDatacirculartyEnrichedLayerData.eolUnbuiltSpecificScenario == null

  return (
    <Area>
      <div className="flex flex-row justify-between">
        <div className="w-1/3">
          <Heading4>
            {t("title")} <Required />
          </Heading4>
        </div>
        <div className="flex w-2/3 flex-row items-center justify-end">
          <div className="flex flex-row">
            <EolScenarioInfoBox layerData={layerDatacirculartyEnrichedLayerData} />
          </div>
          <EOLScenarioEditButton layerData={layerDatacirculartyEnrichedLayerData} />
        </div>
      </div>
      <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltData} className="md:border" />
      {showDetailsAccordion && (
        <Accordion transition transitionTimeout={200}>
          <AccordionItemFull header={<span className="text-xs">{t("details")}</span>}>
            <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltDataSecondary} className="md:border" />
          </AccordionItemFull>
        </Accordion>
      )}
    </Area>
  )
}

type CircularityDetailsProps = {
  projectId: number
  variantId: number
  layerData: CalculateCircularityDataForLayerReturnType
  componentUuid: string
}
const CircularityDetails = ({ projectId, variantId, layerData, componentUuid }: CircularityDetailsProps) => {
  const circularityInfoTranslations = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const t = useTranslations()
  const { formatCircularityMetric } = useCircularityFormatter()
  const queryClient = useQueryClient()
  const [isShowExamplesModalOpen, setIsShowExamplesModalOpen] = useState(false)
  const [isEolScenarioModalOpen, setIsEolScenarioModalOpen] = useState(false)
  const [remarkText, setRemarkText] = useState<string | null>(layerData.dismantlingPotentialClassRemark ?? null)

  // Debounce the remark text with a 1-second delay
  const debouncedRemarkText = useDebounce<string | null>(remarkText, 1000)

  useEffect(() => {
    // Only save if the value has actually changed from what's in layerData
    if (debouncedRemarkText !== layerData.dismantlingPotentialClassRemark) {
      updateDismantlingPotentialRemarkMutation.mutate(debouncedRemarkText)
    }
  }, [debouncedRemarkText])

  const updateDismantlingPotentialClassIdMutation = useMutation<void, Error, DismantlingPotentialClassId | null>({
    mutationFn: async (id: DismantlingPotentialClassId | null) => {
      const result = await updateDismantlingPotentialClassId(layerData.component_id, id)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circularityData", projectId, variantId] })
      return queryClient.invalidateQueries({ queryKey: ["componentData", projectId, variantId, componentUuid] })
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const updateDismantlingPotentialRemarkMutation = useMutation({
    mutationFn: async (remark: string | null) => {
      const result = await updateDismantlingPotentialRemark(layerData.component_id, remark)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentData", projectId, variantId, componentUuid] })
      queryClient.invalidateQueries({ queryKey: ["circularityData", projectId, variantId] })
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      } else {
        toast.error(t("Errors.Generic.serverError"))
      }
    },
  })

  // Effect to trigger save when debounced value changes
  useEffect(() => {
    // Only save if the value has actually changed from what's in layerData
    // and we're not in the initial mount
    if (debouncedRemarkText !== layerData.dismantlingPotentialClassRemark) {
      updateDismantlingPotentialRemarkMutation.mutate(debouncedRemarkText)
    }
  }, [debouncedRemarkText])

  const updateDisturbingEolScenarioForS4Mutation = useMutation<
    void,
    Error,
    {
      selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
    }
  >({
    mutationFn: async ({
      selectedEolScenario,
    }: {
      selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
    }) => {
      const result = await updateDisturbingEolScenarioForS4(layerData.component_id, selectedEolScenario)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentData", projectId, variantId, componentUuid] })
      queryClient.invalidateQueries({ queryKey: ["circularityData", projectId, variantId] })
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const addOrUpdateDisturbingSubstanceMutation = useMutation<
    undefined,
    Error,
    DisturbingSubstanceSelectionWithNullabelId
  >({
    mutationFn: async (disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId) => {
      const result = await addOrUpdateDisturbingSubstanceSelection(
        variantId,
        projectId,
        layerData.component_id,
        disturbingSubstanceSelection
      )
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentData", projectId, variantId, componentUuid] })
      queryClient.invalidateQueries({ queryKey: ["circularityData", projectId, variantId] })
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const removeDisturbingSubstanceMutation = useMutation<undefined, Error, number>({
    mutationFn: async (id: number) => {
      const result = await removeDisturbingSubstanceSelection(layerData.component_id, id)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentData", projectId, variantId, componentUuid] })
      queryClient.invalidateQueries({ queryKey: ["circularityData", projectId, variantId] })
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const [dismantlingPotentialClassId, setDismantlingPotentialClassId] = useState(layerData.dismantlingPotentialClassId)

  const handleUpdateDisturbingSubstance = async (
    disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => {
    addOrUpdateDisturbingSubstanceMutation.mutate(disturbingSubstanceSelection)
  }

  const handleRemoveDisturbingSubstanceRow = (
    disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => {
    if (disturbingSubstanceSelection.id !== null) {
      removeDisturbingSubstanceMutation.mutate(disturbingSubstanceSelection.id)
    }
  }

  const eolScenarioOptions = Object.values(TBs_ProductDefinitionEOLCategoryScenario).map((value) => ({
    id: value,
    value: EOLScenarioMap[value],
  }))

  const eolUnbuiltDataSecondary = [
    {
      key: circularityInfoTranslations("RebuildSection.rebuildClass"),
      value: layerData.dismantlingPotentialClassId ?? "-",
    },
    {
      key: circularityInfoTranslations("RebuildSection.rebuildPoints"),
      value: layerData.dismantlingPotentialClassId
        ? formatCircularityMetric(dismantlingPotentialClassIdMapping[layerData.dismantlingPotentialClassId].points)
        : "-",
    },
  ]

  const handleOpenEolScenarioModal = () => {
    setIsEolScenarioModalOpen(true)
  }

  const handleCloseEolScenarioModal = () => {
    setIsEolScenarioModalOpen(false)
  }

  const handleSaveEolScenario = async (
    selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
  ) => {
    updateDisturbingEolScenarioForS4Mutation.mutate({ selectedEolScenario })
    setIsEolScenarioModalOpen(false)
  }

  const eolBuiltData = [
    {
      key: circularityInfoTranslations("EolBuiltSection.class"),
      value: layerData.eolBuilt?.className ?? "-",
    },
    {
      key: circularityInfoTranslations("EolBuiltSection.points"),
      value: layerData.eolBuilt?.points ? formatCircularityMetric(layerData.eolBuilt?.points) : "-",
      testId: "eol-built-points",
    },
  ]

  return (
    <>
      <Area>
        <div className="flex flex-row justify-between">
          <Heading4>
            {circularityInfoTranslations("RebuildSection.title")} <Required />
          </Heading4>
          {layerData.dismantlingPotentialClassId === null && (
            <ErrorText className="mr-4">{circularityInfoTranslations("RebuildSection.error")}</ErrorText>
          )}
        </div>
        <div className="flex flex-row justify-start">
          <button
            type="button"
            className="font-normal text-bbsr-blue-700 hover:text-bbsr-blue-800"
            onClick={() => setIsShowExamplesModalOpen(true)}
            data-testid="show-examples"
          >
            {circularityInfoTranslations("RebuildSection.showExamples")}
          </button>
        </div>
        <div className="mt-4">
          <div className="isolate flex flex-wrap justify-center gap-4">
            {Object.entries(dismantlingPotentialClassIdMapping).map(([key, value]) => {
              const currentDismantlingPotentialClassId = updateDismantlingPotentialClassIdMutation.isPending
                ? dismantlingPotentialClassId
                : layerData.dismantlingPotentialClassId
              return (
                <button
                  key={key}
                  type="button"
                  data-testid={`circularity-details-rebuild-class-button__button__${value.points}`}
                  className={twMerge(
                    `relative flex min-w-[400px] items-center justify-center rounded-md px-4 py-4 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10`,
                    key === currentDismantlingPotentialClassId
                      ? "bg-bbsr-blue-700 text-white ring-bbsr-blue-500 hover:bg-bbsr-blue-500 "
                      : "bg-white hover:bg-gray-50",
                    "cursor-pointer"
                  )}
                  onClick={() => {
                    setDismantlingPotentialClassId(key as DismantlingPotentialClassId)
                    updateDismantlingPotentialClassIdMutation.mutate(key as DismantlingPotentialClassId)
                  }}
                >
                  {circularityInfoTranslations(
                    `sections.dismantlingPotential.dismantlingClassNames.${value.translationKey}`
                  )}
                </button>
              )
            })}
          </div>
          {layerData.dismantlingPotentialClassId && (
            <div className="mt-4">
              <TwoColGrid>
                <StyledDt>{circularityInfoTranslations("RebuildSection.remarkLabel")}</StyledDt>
                <StyledDd>
                  <textarea
                    id="dismantlingRemark"
                    name="dismantlingRemark"
                    rows={2}
                    className="block w-full rounded-md border-2 border-gray-200 p-2 text-sm shadow-sm focus:border-bbsr-blue-500 focus:ring-bbsr-blue-500"
                    placeholder={circularityInfoTranslations("RebuildSection.remarkPlaceholder")}
                    value={remarkText ?? ""}
                    onChange={(e) => {
                      const newValue = e.target.value.trim() === "" ? null : e.target.value
                      setRemarkText(newValue)
                    }}
                    onBlur={() => {
                      // Also save on blur for immediate feedback when user leaves the field
                      if (remarkText !== layerData.dismantlingPotentialClassRemark) {
                        updateDismantlingPotentialRemarkMutation.mutate(remarkText)
                      }
                    }}
                  />
                </StyledDd>
              </TwoColGrid>
            </div>
          )}
          <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltDataSecondary} className="md:border" />
        </div>
      </Area>
      {isShowExamplesModalOpen && (
        <Modal
          onClose={() => setIsShowExamplesModalOpen(false)}
          title={circularityInfoTranslations("RebuildSection.examplesModalTitle")}
          isOpen={isShowExamplesModalOpen}
          description={circularityInfoTranslations("RebuildSection.examplesModalIntro")}
        >
          <div className="flex flex-col gap-4">
            {circularityInfoTranslations.raw("RebuildSection.examplesModalCards").map((card: any, idx: number) => {
              const titleText = card.title
              return (
                <div key={idx} className="flex w-full flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 shadow">
                  <div className="mb-2 text-base font-semibold text-bbsr-blue-700">{titleText}</div>
                  <div className="mb-2 text-sm font-medium text-gray-800">{card.criteriaLabel}</div>
                  <div className="mb-2 text-sm font-medium text-gray-800">{card.criteria}</div>
                  {card.examplesLabel && (
                    <div className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {card.examplesLabel}
                    </div>
                  )}
                  <div className="mb-4 text-sm font-semibold text-bbsr-blue-800">{card.examples}</div>
                  <div className="mt-auto border-t border-gray-100 pt-2 text-xs font-medium text-gray-500">
                    {card.note}
                  </div>
                </div>
              )
            })}
          </div>
        </Modal>
      )}
      <EolDataSection layerDatacirculartyEnrichedLayerData={layerData} />
      <Area>
        <div className="flex flex-col justify-between">
          <Heading4>
            {circularityInfoTranslations("EolBuiltSection.title")} <Required />
          </Heading4>
          {layerData.disturbingSubstances.noDisturbingSubstancesOrOnlyNullClassesSelected && (
            <div className="flex items-center text-red" role="alert">
              <ExclamationTriangleIcon className="mr-2 size-5" aria-hidden="true" />
              <p className="text-sm">{circularityInfoTranslations("EolBuiltSection.emptyState")}</p>
            </div>
          )}
          <div className="flex w-full flex-row items-center justify-between">
            <DisturbingSubstances
              disturbingSubstanceRows={layerData.disturbingSubstanceSelections}
              layerId={layerData.component_id}
              handleRemoveDisturbingSubstanceRow={handleRemoveDisturbingSubstanceRow}
              handleUpdateDisturbingSubstance={handleUpdateDisturbingSubstance}
            />
          </div>
        </div>
        {layerData.disturbingSubstances.hasS4DisturbingSubstance && (
          <Area>
            <Heading4>
              {circularityInfoTranslations("EolBuiltSection.eolScenarioS4")}
              <Required />
            </Heading4>
            {layerData.disturbingEolScenarioForS4 == null ? (
              <>
                <div className="flex items-center text-red" role="alert">
                  <ExclamationTriangleIcon className="mr-2 size-5" aria-hidden="true" />
                  <p className="text-sm">{circularityInfoTranslations("EolBuiltSection.selectEolScenario")}</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="text-bbsr-blue-700 hover:text-bbsr-blue-800"
                    onClick={handleOpenEolScenarioModal}
                  >
                    {circularityInfoTranslations("EolBuiltSection.overrideEolScenarioButton")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-row justify-between">
                <div>{circularityInfoTranslations("EolBuiltSection.eolScenarioBuiltSpecific")}</div>
                <div className="flex flex-row justify-between">
                  <div className="mx-4">{EOLScenarioMap[layerData.disturbingEolScenarioForS4]}</div>
                  <div>
                    <EditButton onClick={handleOpenEolScenarioModal}>Bearbeiten</EditButton>
                  </div>
                </div>
              </div>
            )}
          </Area>
        )}
        <SideBySideDescriptionListsWithHeadline justifyEnd data={eolBuiltData} className="md:border" />
      </Area>

      {isEolScenarioModalOpen && (
        <Modal
          onClose={handleCloseEolScenarioModal}
          title={circularityInfoTranslations("sections.disturbingSubstances.specificScenarioForS4.modal.title")}
          isOpen={isEolScenarioModalOpen}
        >
          <BuiltS4SpecificScenarioModal
            layerData={layerData}
            handleCancel={handleCloseEolScenarioModal}
            handleSave={handleSaveEolScenario}
            options={eolScenarioOptions}
          />
        </Modal>
      )}
    </>
  )
}
export default CircularityDetails
