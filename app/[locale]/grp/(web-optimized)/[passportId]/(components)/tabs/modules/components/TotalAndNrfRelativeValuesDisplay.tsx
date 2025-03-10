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
import { useFormatter, useTranslations } from "next-intl"

const TotalAndNrfRelativeValuesDisplay = ({
  totalValue,
  nrfRelativeValue,
  unit,
}: {
  totalValue: number
  nrfRelativeValue: number
  unit: string
}) => {
  const t = useTranslations("GenericComponents.TotalAndNrfRelativeValuesDisplay")
  const format = useFormatter()
  return (
    <dl className="mx-auto flex w-full max-w-md justify-between px-4 pb-6 pt-3 sm:px-3">
      <div className="flex w-1/2 flex-col">
        <dt className="text-sm font-semibold leading-6 text-gray-400">{t("areaRelated")}</dt>
        <dd className="mt-1 text-sm">
          {format.number(nrfRelativeValue, { maximumFractionDigits: 2 })} {unit}/m2 NRF
        </dd>
      </div>
      <div className="flex w-1/2 flex-col">
        <dt className="text-sm font-semibold leading-6 text-gray-400">{t("total")}</dt>
        <dd className="mt-1 text-sm">
          {format.number(totalValue, { maximumFractionDigits: 2 })} {unit}
        </dd>
      </div>
    </dl>
  )
}

export default TotalAndNrfRelativeValuesDisplay
