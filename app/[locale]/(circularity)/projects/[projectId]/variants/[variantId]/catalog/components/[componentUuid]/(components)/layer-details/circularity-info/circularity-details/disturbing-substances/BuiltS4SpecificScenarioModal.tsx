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
import { useTranslations } from "next-intl"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { TBs_ProductDefinitionEOLCategoryScenario } from "prisma/generated/client"

enum EolScenarioColorCodeTwClassString {
  yellow = "bg-yellow-100 text-yellow-800",
  green = "bg-green-200 text-green-700",
}

type S4SpecificModalExample = {
  tBaustoffProductName: string
  tBaustoffProductDescription: string
  eolScenarioName: string
  eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString
}

const S4SpecificModalExamples = () => {
  const exampleData: S4SpecificModalExample[] = [
    {
      tBaustoffProductName: "Balkenschichtholz Nadelholz",
      tBaustoffProductDescription: "Störst.kl. S4 (Neueinstuf.)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Betonfertigteil Decke 20cm",
      tBaustoffProductDescription: "exkl. Bewehrung, Störst.kl. S4 (Neueinstufung)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Betonfertigteil Treppe (1,1 m Breite, 9 Stufen a 16 cm)",
      tBaustoffProductDescription: "exkl. Bewehrung, Störst.kl. S4 (Neueinstufung)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Beton-Mauersteine",
      tBaustoffProductDescription: "Störst.kl. S4 (Neueinstuf.)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Konstruktionsvollholz",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Lehmputz mit Störstoff S4",
      tBaustoffProductDescription: "",
      eolScenarioName: "Dep+",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Lehmstein",
      tBaustoffProductDescription: "Störstoffkl. S4 (Neueinstuf.)",
      eolScenarioName: "CL+",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Schnittholz Buche",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Schnittholz Eiche",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Schnittholz Fichte",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Schnittholz Kiefer",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Schnittholz Lärche",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Schnittholz Zeder",
      tBaustoffProductDescription: "Störstkl. S4 (Neueinstufung)",
      eolScenarioName: "EV-",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.green,
    },
    {
      tBaustoffProductName: "Stampflehmwand",
      tBaustoffProductDescription: "Störstoffkl. S4 (Neueinstuf.)",
      eolScenarioName: "CL+",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Tragdeckschicht Beton",
      tBaustoffProductDescription: "Störstoffkl. S4 (Neueinstuf.)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Transportbeton C20/25",
      tBaustoffProductDescription: "exkl. Bewehrung, Störst.kl. S4 (Neueinstufung)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Transportbeton C25/30",
      tBaustoffProductDescription: "exkl. Bewehrung, Störst.kl. S4 (Neueinstufung)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Transportbeton C30/37",
      tBaustoffProductDescription: "exkl. Bewehrung, Störst.kl. S4 (Neueinstufung)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
    {
      tBaustoffProductName: "Transportbeton C50/60",
      tBaustoffProductDescription: "exkl. Bewehrung, Störst.kl. S4 (Neueinstufung)",
      eolScenarioName: "SV",
      eolScenarioColorCodeTwClassString: EolScenarioColorCodeTwClassString.yellow,
    },
  ]

  const t = useTranslations(
    "Circularity.Components.Layers.CircularityInfo.sections.disturbingSubstances.specificScenarioForS4.modal.referenceInstructionTable"
  )

  return (
    <div className="">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="h-96 overflow-y-auto">
              <label htmlFor="eolScenario" className="text-md mb-2 block text-left font-medium text-gray-700">
                {t("tableTitle")}
              </label>
              <table className="min-w-full divide-y rounded-3xl border-2 border-gray-200 ">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-900">
                      {t("columnHeaders.tBaustoffProduct")}
                    </th>
                    <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-900">
                      {t("columnHeaders.eolScenarioSpecific")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {exampleData.map((exampleRow) => (
                    <tr key={exampleRow.tBaustoffProductName}>
                      <td className="max-w-96 whitespace-normal break-words p-3 py-5 text-left text-sm text-gray-500">
                        <div className="text-gray-900">{exampleRow.tBaustoffProductName}</div>
                        <div className="mt-1 text-gray-500">{exampleRow.tBaustoffProductDescription}</div>
                      </td>
                      <td className="whitespace-nowrap p-3 py-5 text-sm text-gray-500">
                        <span
                          className={twMerge(
                            "inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium",
                            exampleRow.eolScenarioColorCodeTwClassString
                          )}
                        >
                          {exampleRow.eolScenarioName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type BuiltS4SpecificScenarioModalProps = {
  layerData: CalculateCircularityDataForLayerReturnType
  handleCancel: () => void
  handleSave: (selectedScenario: TBs_ProductDefinitionEOLCategoryScenario | null | undefined) => void
  options: { id: TBs_ProductDefinitionEOLCategoryScenario; value: string }[]
}
const BuiltS4SpecificScenarioModal = ({
  layerData,
  handleCancel,
  handleSave,
  options,
}: BuiltS4SpecificScenarioModalProps) => {
  const [selectedScenario, setSelectedScenario] = useState<TBs_ProductDefinitionEOLCategoryScenario | null | undefined>(
    layerData.disturbingEolScenarioForS4
  )

  const t = useTranslations(
    "Circularity.Components.Layers.CircularityInfo.sections.disturbingSubstances.specificScenarioForS4.modal"
  )

  return (
    <div className="mt-4">
      <div className="mb-6 rounded bg-yellow-50 p-4 text-yellow-700">
        <p className="text-sm">
          <ExclamationTriangleIcon className="mr-2 inline size-5" aria-hidden="true" />
          {t("warningBox")}
        </p>
      </div>
      <div className="mb-6 flex-col items-center">
        <label htmlFor="eol-scenario" className="mb-2 block text-sm">
          {t("ctaHint")}
        </label>
        <select
          id="eolScenario"
          name="eolScenario"
          className="mt-4 w-64 rounded-md border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={selectedScenario || ""}
          onChange={(e) => setSelectedScenario(e.target.value as TBs_ProductDefinitionEOLCategoryScenario)}
        >
          <option value="">[{t("selectEolScenario")}]</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
      </div>

      <S4SpecificModalExamples />

      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" className="rounded bg-gray-200 px-4 py-2" onClick={handleCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={`rounded bg-indigo-600 px-4 py-2 text-white ${
            !selectedScenario ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => handleSave(selectedScenario)}
          disabled={!selectedScenario}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default BuiltS4SpecificScenarioModal
