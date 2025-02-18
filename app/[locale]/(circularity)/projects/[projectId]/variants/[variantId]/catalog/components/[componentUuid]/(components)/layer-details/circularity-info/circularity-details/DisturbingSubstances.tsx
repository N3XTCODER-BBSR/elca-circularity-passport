"use client"
import { TrashIcon } from "@heroicons/react/20/solid"
import { useIsMutating } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Area, Heading4, Required } from "app/(components)/generic/layout-elements"
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/types/domain-types"
import { DisturbingSubstanceClassId, DisturbingSubstanceSelection } from "prisma/generated/client"

type DisturbingSubstanceRowProps = {
  disturbingSubstanceClasses: DisturbingSubstanceClassId[]
  disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  isUpdating: boolean
  handleUpdateDisturbingSubstance: (
    updatedDisturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => void
  onRemoveRow: (disturbingSubstanceSelectionWithNullabelId: DisturbingSubstanceSelectionWithNullabelId) => void
  isFirstRow: boolean
  s0Selected: boolean
}

const DisturbingSubstanceRow = ({
  disturbingSubstanceClasses,
  disturbingSubstanceSelection,
  handleUpdateDisturbingSubstance,
  onRemoveRow,
  isFirstRow,
  s0Selected,
}: DisturbingSubstanceRowProps) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo")

  const [inputValue, setInputValue] = useState(disturbingSubstanceSelection.disturbingSubstanceName || "")
  const isUserInput = useRef(false)

  useEffect(() => {
    setInputValue(disturbingSubstanceSelection.disturbingSubstanceName || "")
    isUserInput.current = false
  }, [disturbingSubstanceSelection.disturbingSubstanceName])

  useEffect(() => {
    if (isUserInput.current) {
      const handler = setTimeout(() => {
        handleUpdateDisturbingSubstance({
          ...disturbingSubstanceSelection,
          disturbingSubstanceName: inputValue,
        })
        isUserInput.current = false
      }, 1000)
      return () => {
        clearTimeout(handler)
      }
    }
  }, [inputValue, handleUpdateDisturbingSubstance, disturbingSubstanceSelection])

  useEffect(() => {
    if (disturbingSubstanceSelection.disturbingSubstanceClassId === DisturbingSubstanceClassId.S0) {
      setInputValue("")
    }
  }, [disturbingSubstanceSelection.disturbingSubstanceClassId])

  return (
    <div className="my-2 flex items-center gap-4">
      <div className="isolate flex flex-wrap justify-center gap-2">
        {disturbingSubstanceClasses.map((disturbingSubstanceClassId) => {
          const isDisabled =
            disturbingSubstanceSelection.disturbingSubstanceClassId != null &&
            disturbingSubstanceClassId !== disturbingSubstanceSelection.disturbingSubstanceClassId
          return (
            <button
              key={disturbingSubstanceClassId}
              data-testid={`disturbing-substance-class__button__${disturbingSubstanceClassId}`}
              disabled={isDisabled}
              type="button"
              className={twMerge(
                `relative flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10`,
                disturbingSubstanceClassId === disturbingSubstanceSelection.disturbingSubstanceClassId
                  ? "bg-indigo-500 text-white ring-indigo-500 hover:bg-indigo-600 "
                  : "bg-white hover:bg-gray-50",
                isDisabled ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200" : "cursor-pointer"
              )}
              onClick={() => {
                const newClassIdOrNull =
                  disturbingSubstanceSelection.disturbingSubstanceClassId === disturbingSubstanceClassId
                    ? null
                    : disturbingSubstanceClassId
                const updatedSelection = {
                  ...disturbingSubstanceSelection,
                  disturbingSubstanceClassId: newClassIdOrNull,
                }
                if (newClassIdOrNull === DisturbingSubstanceClassId.S0) {
                  updatedSelection.disturbingSubstanceName = null
                }
                handleUpdateDisturbingSubstance(updatedSelection)
              }}
            >
              {t(`sections.disturbingSubstances.classNamesForSelectorButtons.${disturbingSubstanceClassId}`)}
            </button>
          )
        })}
        {/* Input field for disturbingSubstanceName */}
        <input
          type="text"
          className="w-64 p-2"
          value={inputValue}
          placeholder={t("sections.disturbingSubstances.substanceNameInputPlaceholder")}
          disabled={s0Selected}
          onChange={(e) => {
            setInputValue(e.target.value)
            isUserInput.current = true
          }}
        />
      </div>
      {!isFirstRow && (
        <button
          type="button"
          onClick={() => {
            onRemoveRow(disturbingSubstanceSelection)
          }}
          className="text-red-600 hover:text-red-800 size-4"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

type DisturbingSubstancesProps = {
  handleUpdateDisturbingSubstance: (disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId) => void
  handleRemoveDisturbingSubstanceRow: (disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId) => void
  layerId: number
  disturbingSubstanceRows: DisturbingSubstanceSelection[]
}

type DisturbingSubstanceSelectionWithNullabelIdAndLocalId = DisturbingSubstanceSelectionWithNullabelId & {
  localId: string
}

const DisturbingSubstances = ({
  disturbingSubstanceRows: initialDisturbingSubstanceRows,
  handleUpdateDisturbingSubstance,
  handleRemoveDisturbingSubstanceRow,
  layerId,
}: DisturbingSubstancesProps) => {
  const [disturbingSubstanceRows, setDisturbingSubstanceRows] = useState<DisturbingSubstanceSelectionWithNullabelId[]>(
    []
  )

  const isPending = useIsMutating() > 0

  const [showNewEmptyRow, setShowNewEmptyRow] = useState(false)

  const disturbingSubstanceClassesOtherThanS0 = Object.values(DisturbingSubstanceClassId).filter(
    (classId) => classId !== DisturbingSubstanceClassId.S0
  )

  const localIdCounter = useRef(0)
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolBuiltSection")

  useEffect(() => {
    let newDisturbingSubstanceRows: DisturbingSubstanceSelectionWithNullabelIdAndLocalId[] = []

    newDisturbingSubstanceRows = initialDisturbingSubstanceRows.map((row) => ({
      ...row,
      localId: `local-${localIdCounter.current++}`,
    }))

    if (newDisturbingSubstanceRows.length === 0) {
      newDisturbingSubstanceRows.push({
        id: null,
        localId: `local-${localIdCounter.current++}`,
        userEnrichedProductDataElcaElementComponentId: layerId,
        disturbingSubstanceClassId: null,
        disturbingSubstanceName: "",
      } as DisturbingSubstanceSelectionWithNullabelIdAndLocalId)
    }

    newDisturbingSubstanceRows.sort((a, b) => {
      if (a.id != null && b.id != null) {
        return a.id - b.id
      } else if (a.id != null) {
        return -1
      } else if (b.id != null) {
        return 1
      } else {
        return a.localId.localeCompare(b.localId)
      }
    })

    if (showNewEmptyRow) {
      newDisturbingSubstanceRows.push({
        id: null,
        localId: `local-${localIdCounter.current++}`,
        userEnrichedProductDataElcaElementComponentId: layerId,
        disturbingSubstanceClassId: null,
        disturbingSubstanceName: "",
      } as DisturbingSubstanceSelectionWithNullabelIdAndLocalId)
    }

    setDisturbingSubstanceRows(newDisturbingSubstanceRows)
  }, [initialDisturbingSubstanceRows, showNewEmptyRow, layerId])

  const s0Selected = disturbingSubstanceRows[0]?.disturbingSubstanceClassId === DisturbingSubstanceClassId.S0
  const moreThanOneRow = disturbingSubstanceRows.length > 1
  const hasFirstRowSelectedClassOtherThanS0 =
    disturbingSubstanceRows[0]?.disturbingSubstanceClassId != null && !s0Selected
  const firstRowShowsS0 = !moreThanOneRow && !hasFirstRowSelectedClassOtherThanS0
  const disturbingSubstanceClassesForFirstRow = firstRowShowsS0
    ? Object.values(DisturbingSubstanceClassId)
    : disturbingSubstanceClassesOtherThanS0

  const handleRemoveDisturbingSubstanceRowLocally = (
    disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => {
    if (disturbingSubstanceSelection.id == null) {
      setShowNewEmptyRow(false)
    } else {
      handleRemoveDisturbingSubstanceRow(disturbingSubstanceSelection)
    }
  }

  const handleUpdateDisturbingSubstanceLocally = (
    updatedDisturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId
  ) => {
    if (updatedDisturbingSubstanceSelection.id == null) {
      setShowNewEmptyRow(false)
    }
    handleUpdateDisturbingSubstance(updatedDisturbingSubstanceSelection)
  }

  const showAddAdditionalDisturbingSubstanceButton = !showNewEmptyRow && !s0Selected

  return (
    <Area>
      <Heading4>
        {t("disturbingSubstances")} <Required />
      </Heading4>
      {disturbingSubstanceRows.map((row, index) => (
        <DisturbingSubstanceRow
          key={index}
          s0Selected={s0Selected}
          disturbingSubstanceClasses={
            index === 0 ? disturbingSubstanceClassesForFirstRow : disturbingSubstanceClassesOtherThanS0
          }
          isUpdating={isPending}
          onRemoveRow={handleRemoveDisturbingSubstanceRowLocally}
          isFirstRow={index === 0}
          disturbingSubstanceSelection={row}
          handleUpdateDisturbingSubstance={handleUpdateDisturbingSubstanceLocally}
        />
      ))}
      {showAddAdditionalDisturbingSubstanceButton && (
        <button
          type="button"
          className="text-indigo-600 hover:text-indigo-800"
          onClick={() => setShowNewEmptyRow(true)}
        >
          + {t("newSubstance")}
        </button>
      )}
    </Area>
  )
}

export default DisturbingSubstances
