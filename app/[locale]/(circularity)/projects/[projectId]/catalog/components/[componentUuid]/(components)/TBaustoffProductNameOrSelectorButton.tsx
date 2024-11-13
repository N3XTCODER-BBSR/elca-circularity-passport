"use client"

import { useState } from "react"
import { EditButton, ErrorText } from "app/(components)/generic/layout-elements"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import Modal from "./TBaustoffSelectorModal"
type Option = {
  id: string
  value: string
}

interface TBaustoffProductNameOrSelectorButtonProps {
  layerData: EnrichedElcaElementComponent
  options: Option[]
  onSave: (selectedId: string) => void
  isUpdating: boolean
}

interface SelectMaterialButtonProps {
  onSave: (selectedId: string) => void
  options: Option[]
  isUpdating: boolean
}

const SelectMaterialButton: React.FC<SelectMaterialButtonProps> = ({ onSave, isUpdating, options }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string>("")

  const handleSave = () => {
    onSave(selectedId)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedId("")
  }
  return (
    <>
      <div>
        <EditButton onClick={() => setIsModalOpen(true)} disabled={isUpdating}>
          Select
        </EditButton>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="TBaustoff Baustoff"
        description="Kein Treffer für dieses Ökobaudat-Produkt gefunden. Bitte wählen Sie einen tBaustoff Baustoff aus der Liste aus."
      >
        <div className="mt-4">
          <select
            id="tbaustoff"
            name="tbaustoff"
            className="mt-1 block w-full rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={isUpdating}
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
          <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel} disabled={isUpdating}>
            Cancel
          </button>
          <button
            type="button"
            className={`rounded bg-indigo-600 px-4 py-2 text-white ${
              !selectedId || isUpdating ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={handleSave}
            disabled={!selectedId || isUpdating}
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  )
}

const TBaustoffProductNameOrSelectorButton: React.FC<TBaustoffProductNameOrSelectorButtonProps> = ({
  layerData,
  onSave,
  options,
  isUpdating,
}) => {
  if (layerData.tBaustoffProductData == null) {
    return (
      <>
        <ErrorText className="mr-4">Kein Treffer gefunden</ErrorText>
        <SelectMaterialButton onSave={onSave} isUpdating={isUpdating} options={options} />
      </>
    )
  }

  return (
    <>
      <span className="mr-4 mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {layerData.tBaustoffProductData.name}
      </span>
      <SelectMaterialButton onSave={onSave} isUpdating={isUpdating} options={options} />
    </>
  )
}

export default TBaustoffProductNameOrSelectorButton
