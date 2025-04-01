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

import { useIsMutating, useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import toast from "react-hot-toast"
import { EditButton, ErrorText } from "app/(components)/generic/layout-elements"
import { updateTBaustoffProduct } from "app/[locale]/(circularity)/(server-actions)/updateTBaustoffProductOfLayer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import { CallServerActionError } from "lib/errors"
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
  const circularityTranslations = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const t = useTranslations()
  const router = useRouter()

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
        <div className="mt-4">
          <select
            data-testid="select-material-button__select"
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
            className={`rounded bg-indigo-600 px-4 py-2 text-white ${
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
      <span
        className="mr-4 mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
        data-testid="tbaustoff-product-name__span"
      >
        {layerData.tBaustoffProductData.name}
      </span>
      <SelectMaterialButton options={options} circulartyEnrichedLayerData={layerData} />
    </>
  )
}

export default TBaustoffProductNameOrSelectorButton
