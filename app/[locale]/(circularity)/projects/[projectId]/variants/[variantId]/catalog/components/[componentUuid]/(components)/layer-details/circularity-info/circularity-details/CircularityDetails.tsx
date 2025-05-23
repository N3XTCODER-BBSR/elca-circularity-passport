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
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { Accordion } from "@szhsin/react-accordion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useFormatter, useTranslations } from "next-intl"
import { useState } from "react"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { AccordionItemFull } from "app/(components)/generic/AccordionItem"
import {
  Area,
  EditButton,
  ErrorText,
  Heading4,
  Required,
  StyledDd,
  StyledDt,
} from "app/(components)/generic/layout-elements"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { addOrUpdateDisturbingSubstanceSelection } from "app/[locale]/(circularity)/(server-actions)/addOrUpdateDisturbingSubstance"
import { removeDisturbingSubstanceSelection } from "app/[locale]/(circularity)/(server-actions)/removeDisturbingSubstances"
import { updateDismantlingPotentialClassId } from "app/[locale]/(circularity)/(server-actions)/updateDismantlingPotentialClassId"
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
import { DismantlingPotentialClassId, TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import BuiltS4SpecificScenarioModal from "./disturbing-substances/BuiltS4SpecificScenarioModal"
import DisturbingSubstances from "./DisturbingSubstances"
import EOLScenarioEditButton from "./EOLScenarioEditButton"
import EolScenarioInfoBox from "./EolScenarioInfoBox"
import Modal from "../../../Modal"

type EolDataSectionProps = {
  layerDatacirculartyEnrichedLayerData: CalculateCircularityDataForLayerReturnType
}

// Hint: we defined this custom type here because of tsc complaining about not finding the actual type 'Formatter' from the next-intl library.
type Formatter = {
  number: (
    num: number,
    config: {
      maximumFractionDigits: number
    }
  ) => string
}

type Translation = (text: string) => string

const formatEolUnbuiltData = (data: EolUnbuiltData | null, format: Formatter, t: Translation) => {
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
      value: format.number(eolPoints, { maximumFractionDigits: 2 }),
      testId: "eol-unbuilt-points",
    },
  ]
}

const EolDataSection = ({ layerDatacirculartyEnrichedLayerData }: EolDataSectionProps) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolDataSection")
  const format = useFormatter()

  if (layerDatacirculartyEnrichedLayerData.tBaustoffProductData == null) {
    return null
  }
  const eolUnbuiltData = formatEolUnbuiltData(layerDatacirculartyEnrichedLayerData.eolUnbuilt, format, t)
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
          ? format.number(layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData.eolUnbuiltPotentialPoints, {
              maximumFractionDigits: 2,
            })
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
          ? format.number(layerDatacirculartyEnrichedLayerData.tBaustoffProductData.eolData?.eolUnbuiltRealPoints, {
              maximumFractionDigits: 2,
            })
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
}
const CircularityDetails = ({ projectId, variantId, layerData }: CircularityDetailsProps) => {
  const circularityInfoTranslations = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const t = useTranslations()
  const format = useFormatter()
  const queryClient = useQueryClient()
  const router = useRouter()

  const updateDismantlingPotentialClassIdMutation = useMutation<void, Error, DismantlingPotentialClassId | null>({
    mutationFn: async (id: DismantlingPotentialClassId | null) => {
      const result = await updateDismantlingPotentialClassId(layerData.component_id, id)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] })
      router.refresh()
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] }),
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
      queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] })
      router.refresh()
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
      queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] })
      router.refresh()
    },
    onError: (error: Error) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const setDismantlingPotentialClassId = async (id: DismantlingPotentialClassId) => {
    const newIdOrNull = layerData.dismantlingPotentialClassId === id ? null : id
    updateDismantlingPotentialClassIdMutation.mutate(newIdOrNull)
  }

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
        ? format.number(dismantlingPotentialClassIdMapping[layerData.dismantlingPotentialClassId].points, {
            maximumFractionDigits: 2,
          })
        : "-",
    },
  ]

  const [isEolScenarioModalOpen, setIsEolScenarioModalOpen] = useState(false)

  const handleOpenEolScenarioModal = () => {
    setIsEolScenarioModalOpen(true)
  }

  const handleCloseEolScenarioModal = () => {
    setIsEolScenarioModalOpen(false)
  }

  const handleSaveEolScenario = async (
    selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
  ) => {
    await updateDisturbingEolScenarioForS4Mutation.mutate({ selectedEolScenario })
    router.refresh()
    setIsEolScenarioModalOpen(false)
  }

  const eolBuiltData = [
    {
      key: circularityInfoTranslations("EolBuiltSection.class"),
      value: layerData.eolBuilt?.className ?? "-",
    },
    {
      key: circularityInfoTranslations("EolBuiltSection.points"),
      value: layerData.eolBuilt?.points ? format.number(layerData.eolBuilt?.points, { maximumFractionDigits: 2 }) : "-",
      testId: "eol-built-points",
    },
  ]

  return (
    <>
      <Area>
        <div className="flex flex-row justify-between">
          {" "}
          <StyledDt>
            <h4 className="flex items-center" role="alert">
              <div className="mr-2 flex size-8 items-center justify-center rounded-md bg-blue-500">
                <ArrowPathIcon className="size-5 text-white" aria-hidden="true" />
              </div>

              <p className="">{circularityInfoTranslations("circularityIndex")}</p>
            </h4>
          </StyledDt>
          <StyledDd justifyEnd>
            <b>
              {layerData.circularityIndex
                ? format.number(layerData.circularityIndex, { maximumFractionDigits: 2 })
                : "-"}
            </b>
          </StyledDd>
        </div>
      </Area>
      <Area>
        <div className="flex flex-row justify-between">
          <Heading4>
            {circularityInfoTranslations("RebuildSection.title")} <Required />
          </Heading4>
          {layerData.dismantlingPotentialClassId === null && (
            <ErrorText className="mr-4">{t("RebuildSection.error")}</ErrorText>
          )}
        </div>

        <div>
          <div className="isolate flex flex-wrap justify-center gap-4">
            {Object.entries(dismantlingPotentialClassIdMapping).map(([key, value]) => {
              const isDisabled =
                layerData.dismantlingPotentialClassId != null && layerData.dismantlingPotentialClassId !== key

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isDisabled}
                  data-testid={`circularity-details-rebuild-class-button__button__${value.points}`}
                  className={twMerge(
                    `relative flex min-w-[400px] items-center justify-center rounded-md px-4 py-4 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10`,
                    key === layerData.dismantlingPotentialClassId
                      ? "bg-indigo-500 text-white ring-indigo-500 hover:bg-indigo-600 "
                      : "bg-white hover:bg-gray-50",
                    isDisabled ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200" : "cursor-pointer"
                  )}
                  onClick={() => setDismantlingPotentialClassId(key as DismantlingPotentialClassId)}
                >
                  {circularityInfoTranslations(
                    `sections.dismantlingPotential.dismantlingClassNames.${value.translationKey}`
                  )}
                </button>
              )
            })}
          </div>

          <SideBySideDescriptionListsWithHeadline justifyEnd data={eolUnbuiltDataSecondary} className="md:border" />
        </div>
      </Area>
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
                    className="text-indigo-600 hover:text-indigo-800"
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
