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
import { FC, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import {
  dismantlingPotentialClassIdMapping,
  eolClassMapping,
  getEolClassNameByPoints,
} from "lib/domain-logic/circularity/utils/circularityMappings"
import { DismantlingPotentialClassId } from "prisma/generated/client"

export const CircularityPotentialBadge: FC<{ value: number | null | undefined }> = ({ value }) => {
  if (value === null) {
    return <div className="text-base font-semibold">-</div>
  }

  const eolClass = getEolClassNameByPoints(value)

  const bgColor = `#${eolClassMapping[eolClass].badgeBgHexColorCode}`
  const textColor = `#${eolClassMapping[eolClass].badgeTextHexColorCode}`

  return (
    <div
      className="w-12 rounded-sm px-1 py-0.5 text-center text-sm font-semibold"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {eolClass}
    </div>
  )
}

const getClosestDismantlingPotentialClass = (value: number) => {
  return Object.entries(dismantlingPotentialClassIdMapping).reduce<DismantlingPotentialClassId>(
    (acc, [dismantlingPotentialClass, { points }]) => {
      return Math.abs(value - points) < Math.abs(value - dismantlingPotentialClassIdMapping[acc].points)
        ? (dismantlingPotentialClass as DismantlingPotentialClassId)
        : (acc as DismantlingPotentialClassId)
    },
    DismantlingPotentialClassId.IV
  )
}

export const DismantlingPotentialBadge: FC<{ value: number | null }> = ({ value }) => {
  if (value === null) {
    return <div className="text-base font-semibold">-</div>
  }

  const dismantlingPotentialClass = getClosestDismantlingPotentialClass(value)

  return (
    <div
      className="inline-block w-12 rounded-sm py-0.5 text-center text-sm font-semibold"
      style={{
        backgroundColor: `#${dismantlingPotentialClassIdMapping[dismantlingPotentialClass].badgeBgHexColorCode}`,
        color: `#${dismantlingPotentialClassIdMapping[dismantlingPotentialClass].badgeTextHexColorCode}`,
      }}
    >
      {dismantlingPotentialClass}
    </div>
  )
}

type LabelValuePair = { label: string; value?: string; valueItem?: ReactNode }

const CircularityLabelValuePair: FC<LabelValuePair> = ({ label, value, valueItem }) => {
  const valueElement = valueItem ? (
    valueItem
  ) : (
    <span className="text-base font-semibold text-bbsr-blue-700">{value}</span>
  )

  return (
    <dl className="flex flex-col gap-0.5">
      <dt className="text-sm font-normal">{label}</dt>
      <dd className="inline-block">{valueElement}</dd>
    </dl>
  )
}

export const HorizontalDescriptionItem: FC<{
  title: string
  labelValuePairs: LabelValuePair[]
  hasBorderRight?: boolean
}> = ({ labelValuePairs, title, hasBorderRight }) => {
  return (
    <article
      className={twMerge("border-gray-20 flex flex-col justify-between px-6 py-2", hasBorderRight && "border-r")}
    >
      <h3 className="mb-3 text-base font-medium text-gray-900">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {labelValuePairs.map((pair, index) => (
          <CircularityLabelValuePair key={index} label={pair.label} value={pair.value} valueItem={pair.valueItem} />
        ))}
      </div>
    </article>
  )
}

export const DescriptionItem: FC<{ label: string; value: string | number; testId: string }> = ({
  label,
  value,
  testId,
}) => {
  return (
    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-base font-medium text-gray-900">{label}</dt>
      <dd
        className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
        data-testid={`description-item__dd__${testId}`}
      >
        {value}
      </dd>
    </div>
  )
}
