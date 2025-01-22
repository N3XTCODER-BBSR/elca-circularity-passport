"use client"

import { useIsMutating, useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { EditButton, ErrorText } from "app/(components)/generic/layout-elements"
import { updateTBaustoffProduct } from "lib/domain-logic/circularity/server-actions/updateTBaustoffProductOfLayer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import Modal from "../../Modal"

type Option = {
  id: string
  value: string
}

interface TBaustoffProductNameOrSelectorButtonProps {
  layerData: EnrichedElcaElementComponent
  options: Option[]
}

interface SelectMaterialButtonProps {
  options: Option[]
  circulartyEnrichedLayerData: EnrichedElcaElementComponent
}

const SelectMaterialButton: React.FC<SelectMaterialButtonProps> = ({ circulartyEnrichedLayerData, options }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIdStr, setSelectedIdStr] = useState<string>("")
  const isPending = useIsMutating() > 0
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo")

  const queryClient = useQueryClient()

  const updateTBaustoffProductMutation = useMutation<void, Error, number>({
    mutationFn: async (selectedId: number) =>
      await updateTBaustoffProduct(circulartyEnrichedLayerData.component_id, selectedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["layerData", circulartyEnrichedLayerData.component_id] })
    },
  })

  const handleSave = () => {
    const selectedId = parseInt(selectedIdStr)
    updateTBaustoffProductMutation.mutate(selectedId)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedIdStr("")
  }
  return (
    <>
      <div>
        <EditButton onClick={() => setIsModalOpen(true)} disabled={isPending}>
          {t("tBaustoffSelector.select")}
        </EditButton>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={t("tBaustoffMaterial")}
        description={t("tBaustoffSelector.modalBody")}
      >
        <div className="mt-4">
          <select
            id="tbaustoff"
            name="tbaustoff"
            className="mt-1 block w-full rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedIdStr}
            onChange={(e) => setSelectedIdStr(e.target.value)}
            disabled={isPending}
          >
            <option value="" disabled>
              -
            </option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel} disabled={isPending}>
            {t("tBaustoffSelector.cancel")}
          </button>
          <button
            type="button"
            className={`rounded bg-indigo-600 px-4 py-2 text-white ${
              !selectedIdStr || isPending ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={handleSave}
            disabled={!selectedIdStr || isPending}
          >
            {t("tBaustoffSelector.save")}
          </button>
        </div>
      </Modal>
    </>
  )
}

const TBaustoffProductNameOrSelectorButton: React.FC<TBaustoffProductNameOrSelectorButtonProps> = ({
  layerData,
  options,
}) => {
  if (layerData.tBaustoffProductData == null) {
    return (
      <>
        <ErrorText className="mr-4">Kein Treffer gefunden</ErrorText>
        <SelectMaterialButton options={options} circulartyEnrichedLayerData={layerData} />
      </>
    )
  }

  return (
    <>
      <span className="mr-4 mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {layerData.tBaustoffProductData.name}
      </span>
      <SelectMaterialButton options={options} circulartyEnrichedLayerData={layerData} />
    </>
  )
}

export default TBaustoffProductNameOrSelectorButton
