"use client"

import { useIsMutating, useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import toast from "react-hot-toast"
import { EditButton } from "app/(components)/generic/layout-elements"
import { updateTBaustoffProduct } from "app/[locale]/(circularity)/(server-actions)/updateTBaustoffProductOfLayer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { CallServerActionError } from "lib/errors"
import MaterialCategorySelector from "./MaterialCategorySelector"
import { SelectOption } from "./types"
import { useMaterialOptions } from "./useMaterialOptions"
import Modal from "../../../Modal"

interface SelectMaterialButtonProps {
  circulartyEnrichedLayerData: EnrichedElcaElementComponent
  options: SelectOption[]
}

const SelectMaterialButton: React.FC<SelectMaterialButtonProps> = ({ circulartyEnrichedLayerData, options }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIdStr, setSelectedIdStr] = useState<string>("")
  const isPending = useIsMutating() > 0
  const circularityTranslations = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const processCategoryTranslations = useTranslations("Common.processCategories")
  const t = useTranslations()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  const { categories, filteredOptions, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } =
    useMaterialOptions(options, processCategoryTranslations)

  const queryClient = useQueryClient()

  const updateTBaustoffProductMutation = useMutation<void, Error, number>({
    mutationFn: async (selectedId: number) => {
      const result = await updateTBaustoffProduct(circulartyEnrichedLayerData.component_id, selectedId)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layerData", circulartyEnrichedLayerData.component_id] })
      router.refresh()
      setIsModalOpen(false)
    },
    onError: (error: unknown) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const handleSave = async () => {
    const selectedId = parseInt(selectedIdStr)
    updateTBaustoffProductMutation.mutate(selectedId)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedIdStr("")
    setSearchTerm("")
    setSelectedCategory("")
  }

  return (
    <>
      <div>
        <EditButton onClick={() => setIsModalOpen(true)} disabled={isPending} testId="tbaustoff-selector">
          {circularityTranslations("tBaustoffSelector.select")}
        </EditButton>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={circularityTranslations("tBaustoffMaterial")}
        description={circularityTranslations("tBaustoffSelector.modalBody")}
      >
        <div className="mt-4 space-y-4">
          <MaterialCategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            isDropdownOpen={isDropdownOpen}
            setSelectedCategory={setSelectedCategory}
            setIsDropdownOpen={setIsDropdownOpen}
            isPending={isPending}
          />

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  data-testid-prefix="tbaustoff-category-filter"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                />
              </svg>
            </span>
            <input
              type="text"
              className="block w-full rounded-md border-2 border-gray-200 py-2 pl-10 pr-3 shadow-sm focus:border-bbsr-blue-500 focus:ring-bbsr-blue-500 sm:text-sm"
              placeholder={circularityTranslations("tBaustoffSelector.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div
            className="max-h-64 overflow-y-auto rounded-md border"
            role="listbox"
            tabIndex={0}
            onKeyDown={(e) => {
              if (filteredOptions.length === 0) return
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setFocusedIndex((prev) => (prev + 1) % filteredOptions.length)
              } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setFocusedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
              } else if (e.key === "Enter" && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
                setSelectedIdStr(filteredOptions[focusedIndex].id)
              }
            }}
          >
            {filteredOptions.map((option, index) => (
              <div
                key={option.id}
                role="option"
                tabIndex={0}
                aria-selected={selectedIdStr === option.id}
                onClick={() => setSelectedIdStr(option.id)}
                onFocus={() => setFocusedIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    setSelectedIdStr(option.id)
                  }
                }}
                className={`cursor-pointer px-4 py-2 text-sm outline-none hover:bg-gray-100 ${
                  selectedIdStr === option.id ? "bg-bbsr-blue-100 font-semibold" : ""
                } ${focusedIndex === index ? "ring-bbsr-blue-300 ring-2" : ""}`}
              >
                {option.value}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">
                {circularityTranslations("tBaustoffSelector.noMaterials")}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="rounded bg-gray-200 px-4 py-2"
            onClick={handleCancel}
            disabled={isPending}
            data-testid="select-material-cancel-button__button"
          >
            {circularityTranslations("tBaustoffSelector.cancel")}
          </button>
          <button
            type="button"
            className={`rounded bg-bbsr-blue-500 px-4 py-2 text-white ${
              !selectedIdStr || isPending ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={handleSave}
            disabled={!selectedIdStr || isPending}
            data-testid="select-material-save-button__button"
          >
            {circularityTranslations("tBaustoffSelector.save")}
          </button>
        </div>
      </Modal>
    </>
  )
}

export default SelectMaterialButton
