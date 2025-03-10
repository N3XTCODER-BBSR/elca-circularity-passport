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

export type KeyValueTuple = {
  key: string
  value?: string | number
  numberOfLines?: number
}

export type SideBySideDescriptionListsWithHeadlineProps = {
  data: KeyValueTuple[]
}

const SingleKeyValueTuple = ({
  keyValueTuple,
  isLeft = false,
}: {
  keyValueTuple?: KeyValueTuple
  isLeft?: boolean
}) => {
  // if(!keyValueTuple) return null

  const normalizedNumberOfLines = keyValueTuple?.numberOfLines || 1
  const lineClampClass = `line-clamp-${normalizedNumberOfLines}`
  // const height = `h-[${normalizedNumberOfLines * 40}mm]`
  // TODO (M): discuss with Daniel. table had one huge row. disable this line as quick
  // fix to continue development of module 2 and 3
  const height = `h-[${1 * 40}mm]`

  return (
    <div
      className={twMerge(
        height,
        "flex w-full justify-between px-2 leading-[5mm]",
        isLeft ? "border-r-2" : ""
        // lineClampClass
        // TODO (M): discuss with Daniel. this broke the pdf layout (causing unneeded line breaks)
      )}
    >
      <dt className="font-semibold text-gray-700">{keyValueTuple?.key}: &nbsp;</dt>
      <dd className={twMerge("text-right text-gray-600", lineClampClass)}>
        {keyValueTuple?.value != null ? keyValueTuple?.value : !!keyValueTuple?.key && "N/A"}
      </dd>
    </div>
  )
}

const SideBySideDescriptionListsWithHeadline = ({ data }: SideBySideDescriptionListsWithHeadlineProps) => {
  const filledWithEmptyLastRow = data.length % 2 === 1 ? [...data, { key: "", value: "" }] : data

  const chunkedArray = _.chunk(filledWithEmptyLastRow, 2)

  return (
    <div className="mb-4">
      <dl className="grid grid-cols-2">
        {chunkedArray.map((chunk, idx) => (
          <div key={idx} className={twMerge("col-span-2 flex flex-row", idx % 2 === 1 ? "bg-white" : "bg-gray-50")}>
            <SingleKeyValueTuple keyValueTuple={chunk[0]} isLeft />
            <SingleKeyValueTuple keyValueTuple={chunk[1]} />
          </div>
        ))}
      </dl>
    </div>
  )
}

export default SideBySideDescriptionListsWithHeadline
