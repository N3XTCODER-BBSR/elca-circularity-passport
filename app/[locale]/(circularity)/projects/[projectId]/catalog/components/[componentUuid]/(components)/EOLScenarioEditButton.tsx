"use client"

import { TBs_ProductDefinitionEOLCategoryScenario } from "@prisma/client"
import { useState } from "react"
import { EditButton } from "app/(components)/generic/layout-elements"
import { Required, Text } from "app/(components)/generic/layout-elements"
import { EOLScenarioMap } from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import EolScenarioInfoBox from "./EolScenarioInfoBox"
import Modal from "./TBaustoffSelectorModal"

type Option = {
  id: string
  value: string
}

interface EOLScenarioEditButtonProps {
  onSave: (selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined, proofText: string) => void
  isUpdating: boolean
  layerData: EnrichedElcaElementComponent
}

type ModalPage1Props = {
  handleCancel: () => void
  handleNextModalPage: () => void
  isUpdating: boolean
  layerData: EnrichedElcaElementComponent
}

type ModalPage2Props = {
  handleCancel: () => void
  handleSave: (scenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined, proofText: string) => void
  isUpdating: boolean
  options: Option[]
  layerData: EnrichedElcaElementComponent
}

const ModalPage1 = ({ layerData, isUpdating, handleCancel, handleNextModalPage }: ModalPage1Props) => {
  return (
    <div className="mt-4">
      <Text>The currently selected EOL Scenario is:</Text>
      <div className="my-4 flex flex-row justify-center">
        <EolScenarioInfoBox layerData={layerData} />
      </div>

      <Text>Do you want to override these values?</Text>
      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel} disabled={isUpdating}>
          No, keep the values
        </button>
        <button
          type="button"
          className={`rounded bg-indigo-600 px-4 py-2 text-white`}
          onClick={handleNextModalPage}
          disabled={false}
        >
          Yes, override
        </button>
      </div>
    </div>
  )
}

const ModalPage2 = ({ layerData, isUpdating, handleCancel, handleSave, options }: ModalPage2Props) => {
  const [proof, setProof] = useState<string>(layerData.eolUnbuiltSpecificScenarioProofText || "")
  const [selectedScenario, setSelectedScenario] = useState<TBs_ProductDefinitionEOLCategoryScenario | null | undefined>(
    layerData.eolUnbuiltSpecificScenario
  )

  return (
    <div className="mt-4">
      <label htmlFor="tbaustoff" className="block text-sm font-medium text-gray-700">
        EOL Scenario (Specific)
        <Required />
      </label>
      <select
        id="tbaustoff"
        name="tbaustoff"
        className="mt-1 block w-full rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={selectedScenario?.toString()}
        onChange={(e) => setSelectedScenario(e.target.value as TBs_ProductDefinitionEOLCategoryScenario)}
        disabled={isUpdating}
      >
        <option value="">[EMPTY]</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>

      <label htmlFor="proof" className="mt-4 block text-sm font-medium text-gray-700">
        Proof for Overriding Default EOL Scenario
        <Required />
      </label>
      <textarea
        id="proof"
        name="proof"
        required
        className="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Provide your proof here..."
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        disabled={isUpdating}
      ></textarea>

      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel} disabled={isUpdating}>
          Cancel
        </button>
        <button
          type="button"
          className={`rounded bg-indigo-600 px-4 py-2 text-white ${
            !selectedScenario || !proof || isUpdating ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => handleSave(selectedScenario, proof)}
          disabled={!selectedScenario || !proof || isUpdating}
        >
          Save
        </button>
      </div>
    </div>
  )
}

const EOLScenarioEditButton: React.FC<EOLScenarioEditButtonProps> = ({ onSave, isUpdating, layerData }) => {
  const eolScenarioOptions = Object.values(TBs_ProductDefinitionEOLCategoryScenario).map((value) => ({
    id: value,
    value: EOLScenarioMap[value],
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPage, setModalPage] = useState(1)

  const handleNextModalPage = () => {
    setModalPage(2)
  }

  const handleSave = (
    selectedScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
    proofText: string
  ) => {
    onSave(selectedScenario, proofText)
    setIsModalOpen(false)
    setModalPage(1)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setModalPage(1)
  }

  return (
    <>
      <div>
        <EditButton onClick={() => setIsModalOpen(true)} disabled={isUpdating}>
          Edit
        </EditButton>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCancel} title="EOL Scenario - Unbuilt">
        {modalPage === 1 ? (
          <ModalPage1
            handleCancel={handleCancel}
            handleNextModalPage={handleNextModalPage}
            layerData={layerData}
            isUpdating={false}
          />
        ) : (
          <ModalPage2
            layerData={layerData}
            options={eolScenarioOptions}
            handleCancel={handleCancel}
            handleSave={handleSave}
            isUpdating={isUpdating}
          />
        )}
      </Modal>
    </>
  )
}

export default EOLScenarioEditButton
