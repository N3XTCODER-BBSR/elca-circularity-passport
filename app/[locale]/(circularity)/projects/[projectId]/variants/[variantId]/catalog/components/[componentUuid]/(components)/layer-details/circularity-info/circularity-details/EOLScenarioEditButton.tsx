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

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import toast from "react-hot-toast"
import { EditButton } from "app/(components)/generic/layout-elements"
import { Required, Text } from "app/(components)/generic/layout-elements"
import { updateSpecificEolScenario } from "app/[locale]/(circularity)/(server-actions)/updateSpecificScenario"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { EOLScenarioMap } from "lib/domain-logic/circularity/utils/circularityMappings"
import { CallServerActionError } from "lib/errors"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"
import EolScenarioInfoBox from "./EolScenarioInfoBox"
import Modal from "../../../Modal"

type Option = {
  id: string
  value: string
}

interface EOLScenarioEditButtonProps {
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
  options: Option[]
  layerData: EnrichedElcaElementComponent
}

const ModalPage1 = ({ layerData, isUpdating, handleCancel, handleNextModalPage }: ModalPage1Props) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolDataSection.ModalPage1")
  return (
    <div className="mt-4">
      <Text>{t("title")}</Text>
      <div className="my-4 flex flex-row justify-center">
        <EolScenarioInfoBox layerData={layerData} />
      </div>

      <Text>{t("description")}</Text>
      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel} disabled={isUpdating}>
          {t("buttonNo")}
        </button>
        <button
          type="button"
          className={`rounded bg-indigo-600 px-4 py-2 text-white`}
          onClick={handleNextModalPage}
          disabled={false}
        >
          {t("buttonYes")}
        </button>
      </div>
    </div>
  )
}

const ModalPage2 = ({ layerData, handleCancel, handleSave, options }: ModalPage2Props) => {
  const [proof, setProof] = useState<string>(layerData.eolUnbuiltSpecificScenarioProofText || "")
  const [selectedScenario, setSelectedScenario] = useState<TBs_ProductDefinitionEOLCategoryScenario | null | undefined>(
    layerData.eolUnbuiltSpecificScenario
  )
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolDataSection.ModalPage2")

  return (
    <div className="mt-4">
      <label htmlFor="tbaustoff" className="block text-sm font-medium text-gray-700">
        {t("title")}
        <Required />
      </label>
      <select
        id="tbaustoff"
        name="tbaustoff"
        className="mt-1 block w-full rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={selectedScenario?.toString()}
        onChange={(e) => setSelectedScenario(e.target.value as TBs_ProductDefinitionEOLCategoryScenario)}
      >
        <option value="">{t("empty")}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>

      <label htmlFor="proof" className="mt-4 block text-sm font-medium text-gray-700">
        {t("proof")}
        <Required />
      </label>
      <textarea
        id="proof"
        name="proof"
        required
        className="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder={t("proofPlaceholder")}
        value={proof}
        onChange={(e) => setProof(e.target.value)}
      ></textarea>

      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel}>
          {t("buttonCancel")}
        </button>
        <button
          type="button"
          className={`rounded bg-indigo-600 px-4 py-2 text-white ${
            !selectedScenario || !proof ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => handleSave(selectedScenario, proof)}
          disabled={!selectedScenario || !proof}
        >
          {t("buttonSave")}
        </button>
      </div>
    </div>
  )
}

const EOLScenarioEditButton: React.FC<EOLScenarioEditButtonProps> = ({ layerData }) => {
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo.EolDataSection.ModalPage2")
  const queryClient = useQueryClient()

  const updateSpecificEolScenarioMutation = useMutation<
    void,
    Error,
    {
      selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
      proofText: string
    }
  >({
    mutationFn: async ({
      selectedEolScenario,
      proofText,
    }: {
      selectedEolScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined
      proofText: string
    }) => {
      const result = await updateSpecificEolScenario(layerData.component_id, selectedEolScenario, proofText)
      if (!result.success) {
        throw new CallServerActionError(result.errorI18nKey)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["layerData", layerData.component_id] }),
    onError: (error: unknown) => {
      if (error instanceof CallServerActionError) {
        toast.error(t(error.errorI18nKey))
      }
    },
  })

  const eolScenarioOptions = Object.values(TBs_ProductDefinitionEOLCategoryScenario).map((value) => ({
    id: value,
    value: EOLScenarioMap[value],
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPage, setModalPage] = useState(1)
  const router = useRouter()

  const handleNextModalPage = () => {
    setModalPage(2)
  }

  const handleSave = async (
    selectedScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined,
    proofText: string
  ) => {
    await updateSpecificEolScenarioMutation.mutate({ selectedEolScenario: selectedScenario, proofText })
    router.refresh()

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
        <EditButton onClick={() => setIsModalOpen(true)}>{t("buttonEdit")}</EditButton>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCancel} title={t("title")}>
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
          />
        )}
      </Modal>
    </>
  )
}

export default EOLScenarioEditButton
