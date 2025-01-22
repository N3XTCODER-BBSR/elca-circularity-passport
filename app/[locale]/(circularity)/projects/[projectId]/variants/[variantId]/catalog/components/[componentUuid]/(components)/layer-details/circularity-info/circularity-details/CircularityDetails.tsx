import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { Accordion } from "@szhsin/react-accordion"
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "next-intl"
import { useState } from "react"
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
import { addOrUpdateDisturbingSubstanceSelection } from "lib/domain-logic/circularity/server-actions/disturbingSubstances/addOrUpdateDisturbingSubstance"
import { removeDisturbingSubstanceSelection } from "lib/domain-logic/circularity/server-actions/disturbingSubstances/removeDisturbingSubstances"
import { updateDisturbingEolScenarioForS4 } from "lib/domain-logic/circularity/server-actions/disturbingSubstances/updateDisturbingEolScenarioForS4"
import { updateDismantlingPotentialClassId } from "lib/domain-logic/circularity/server-actions/updateDismantlingPotentialClassId"
import {
  CalculateCircularityDataForLayerReturnType,
  EolUnbuiltData,
  SpecificOrTotal,
} from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import dismantlingPotentialClassIdMapping from "lib/domain-logic/circularity/utils/dismantlingPotentialClassIdMapping"
import { EOLScenarioMap } from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import {
  DisturbingSubstanceSelectionWithNullabelId,
  EnrichedElcaElementComponent,
} from "lib/domain-logic/types/domain-types"
import { DismantlingPotentialClassId, TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import BuiltS4SpecificScenarioModal from "./disturbing-substances/BuiltS4SpecificScenarioModal"
import DisturbingSubstances from "./DisturbingSubstances"
import EOLScenarioEditButton from "./EOLScenarioEditButton"
import EolScenarioInfoBox from "./EolScenarioInfoBox"
import Modal from "../../../Modal"
import { useRouter } from "next/navigation"

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
    },
    {
      key: `${t("EolUnbuilt.Points.points")} ${keySuffix}`, // TODO: i18n
      value: format.number(eolPoints, { maximumFractionDigits: 2 }),
    },
  ]
}

const EolDataSection = ({ layerDatacirculartyEnrichedLayerData }: EolDataSectionProps) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolDataSection")
  const format = useFormatter()
  const isPending = useIsMutating() > 0

  if (layerDatacirculartyEnrichedLayerData.tBaustoffProductData == null) {
    return null
  }
  // TODO: update
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
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const format = useFormatter()
  const queryClient = useQueryClient()
  const router = useRouter()

  const updateDismantlingPotentialClassIdMutation = useMutation<void, Error, DismantlingPotentialClassId | null>({
    mutationFn: async (id: DismantlingPotentialClassId | null) => {
      updateDismantlingPotentialClassId(layerData.component_id, id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] }),
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
      await updateDisturbingEolScenarioForS4(layerData.component_id, selectedEolScenario)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] }),
  })

  const addOrUpdateDisturbingSubstanceMutation = useMutation<
    EnrichedElcaElementComponent,
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
      return result
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] }),
  })

  const removeDisturbingSubstanceMutation = useMutation<
    EnrichedElcaElementComponent, // TData
    Error,
    number
  >({
    mutationFn: async (id: number) => {
      const result = await removeDisturbingSubstanceSelection(variantId, projectId, layerData.component_id, id)
      return result
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] }),
  })

  const setDismantlingPotentialClassId = async (id: DismantlingPotentialClassId) => {
    const newIdOrNull = layerData.dismantlingPotentialClassId === id ? null : id
    await updateDismantlingPotentialClassIdMutation.mutate(newIdOrNull)
    router.refresh()
  }

  const handleUpdateDisturbingSubstance = async (
    disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => {
    await addOrUpdateDisturbingSubstanceMutation.mutate(disturbingSubstanceSelection)
    router.refresh()
  }

  const handleRemoveDisturbingSubstanceRow = async (
    disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => {
    if (disturbingSubstanceSelection.id != null) {
      await removeDisturbingSubstanceMutation.mutate(disturbingSubstanceSelection.id)
      router.refresh()
    }
  }

  const eolScenarioOptions = Object.values(TBs_ProductDefinitionEOLCategoryScenario).map((value) => ({
    id: value,
    value: EOLScenarioMap[value],
  }))

  const eolUnbuiltDataSecondary = [
    {
      key: t("RebuildSection.rebuildClass"),
      value: layerData.dismantlingPotentialClassId ?? "-",
    },
    {
      key: t("RebuildSection.rebuildPoints"),
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
      key: t("EolBuiltSection.class"), //t("..."),
      value: layerData.eolBuilt?.className ?? "-",
    },
    {
      key: t("EolBuiltSection.points"), //t("..."),
      value: layerData.eolBuilt?.points ? format.number(layerData.eolBuilt?.points, { maximumFractionDigits: 2 }) : "-",
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

              <p className="">{t("circularityIndex")}</p>
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
            {t("RebuildSection.title")} <Required />
          </Heading4>
          {layerData.dismantlingPotentialClassId === null && (
            <ErrorText className="mr-4">Please select the rebuild potential</ErrorText>
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
                  className={twMerge(
                    `relative flex min-w-[400px] items-center justify-center rounded-md px-4 py-4 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10`,
                    key === layerData.dismantlingPotentialClassId
                      ? "bg-indigo-500 text-white ring-indigo-500 hover:bg-indigo-600 "
                      : "bg-white hover:bg-gray-50",
                    isDisabled ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200" : "cursor-pointer"
                  )}
                  onClick={() => setDismantlingPotentialClassId(key as DismantlingPotentialClassId)}
                >
                  {value.translationKey}
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
            {t("EolBuiltSection.title")} <Required />
          </Heading4>
          {layerData.disturbingSubstances.noDisturbingSubstancesOrOnlyNullClassesSelected && (
            <div className="flex items-center text-red" role="alert">
              <ExclamationTriangleIcon className="mr-2 size-5" aria-hidden="true" />
              <p className="text-sm">{t("EolBuiltSection.emptyState")}</p>
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
              {t("EolBuiltSection.eolScenarioS4")}
              <Required />
            </Heading4>
            {layerData.disturbingEolScenarioForS4 == null ? (
              <>
                <div className="flex items-center text-red" role="alert">
                  <ExclamationTriangleIcon className="mr-2 size-5" aria-hidden="true" />
                  <p className="text-sm">{t("EolBuiltSection.selectEolScenario")}</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800"
                    onClick={handleOpenEolScenarioModal}
                  >
                    {t("EolBuiltSection.overrideEolScenarioButton")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-row justify-between">
                <div>{t("EolBuiltSection.eolScenarioBuiltSpecific")}</div>
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
          title={t("sections.disturbingSubstances.specificScenarioForS4.modal.title")}
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
