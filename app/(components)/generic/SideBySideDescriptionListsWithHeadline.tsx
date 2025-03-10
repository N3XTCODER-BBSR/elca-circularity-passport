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
import _ from "lodash"
import { twMerge } from "tailwind-merge"
import { Required } from "./layout-elements"
import Tooltip from "./Tooltip"

export type KeyValueTuple = {
  key: string
  value?: string | number | null
  tooltip?: {
    content: React.ReactNode | string
    id: string
  }
  isRequired?: boolean
  testId?: string
}

export type SideBySideDescriptionListsWithHeadlineProps = {
  headline?: string
  data: KeyValueTuple[]
  className?: string
  justifyEnd?: boolean
}

const SingleKeyValueTuple = ({
  keyValueTuple,
  isLeft = false,
  justifyEnd = false,
}: {
  keyValueTuple?: KeyValueTuple
  isLeft?: boolean
  justifyEnd?: boolean
}) => {
  // TODO: improve N/A check here (e.g. at least put the "N/A" in a global const or even use semantically more specific values like null etc)
  const requiredValueIsMissing = keyValueTuple?.isRequired && keyValueTuple.value === "N/A"
  const dataTestIdValue = keyValueTuple?.testId ? `${keyValueTuple?.testId}-value__dd` : null

  return (
    <div
      className={twMerge(
        "w-full p-2 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3 md:w-1/2",
        isLeft ? "md:border-r-2" : ""
      )}
    >
      <dt className="flex items-center text-sm font-semibold leading-6 text-gray-700">
        {keyValueTuple?.tooltip && <Tooltip id={keyValueTuple?.tooltip.id}>{keyValueTuple?.tooltip.content}</Tooltip>}
        <span>{keyValueTuple?.key}</span>
        {keyValueTuple?.isRequired && <Required />}
      </dt>
      <dd
        className={twMerge("mt-1", justifyEnd && "text-right", requiredValueIsMissing ? "text-red" : "text-gray-600")}
        data-testid={dataTestIdValue}
      >
        {keyValueTuple?.value != null ? keyValueTuple?.value : !!keyValueTuple?.key && "N/A"}
      </dd>
    </div>
  )
}

const SideBySideDescriptionListsWithHeadline = ({
  headline,
  data,
  justifyEnd,
  className,
}: SideBySideDescriptionListsWithHeadlineProps) => {
  const filledWithEmptyLastRow = data.length % 2 === 1 ? [...data, { key: "", value: "" }] : data

  const chunkedArray = _.chunk(filledWithEmptyLastRow, 2)

  return (
    <div className={twMerge("m-4 bg-white", className)}>
      {headline != null && <h3 className="mb-8 text-lg font-semibold leading-6 text-gray-900">{headline}</h3>}

      <dl className="grid grid-cols-1 md:grid-cols-2 md:divide-y md:divide-gray-100">
        {chunkedArray.map((chunk, idx) => (
          <div
            key={idx}
            className={twMerge(
              "flex flex-col px-4 md:col-span-2 md:flex-row",
              idx % 2 === 1 ? "md:bg-white" : "md:bg-gray-50"
            )}
          >
            <SingleKeyValueTuple keyValueTuple={chunk[0]} justifyEnd={justifyEnd} isLeft />
            <SingleKeyValueTuple keyValueTuple={chunk[1]} justifyEnd={justifyEnd} />
          </div>
        ))}
      </dl>
    </div>
  )
}

export default SideBySideDescriptionListsWithHeadline
