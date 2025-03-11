import { FC, ReactNode } from "react"
import {
  dismantlingPotentialClassIdMapping,
  eolClassMapping,
  getEolClassNameByPoints,
} from "lib/domain-logic/circularity/utils/circularityMappings"
import { DismantlingPotentialClassId } from "prisma/generated/client"

export const CircularityPotentialBadge: FC<{ value: number | null }> = ({ value }) => {
  if (value === null) {
    return <div className="text-base font-semibold">-</div>
  }

  const eolClass = getEolClassNameByPoints(value)

  const bgColor = `#${eolClassMapping[eolClass].badgeBgHexColorCode}`
  const textColor = `#${eolClassMapping[eolClass].badgeTextHexColorCode}`

  return (
    <div
      className="rounded-sm px-1 py-0.5 text-center text-sm font-semibold"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {eolClass}
    </div>
  )
}

export const DismantlingPotentialBadge: FC<{ value: number | null }> = ({ value }) => {
  if (value === null) {
    return <div className="text-base font-semibold">-</div>
  }

  const dismantlingPotentialClass = Object.entries(dismantlingPotentialClassIdMapping)
    .reverse()
    .reduce<DismantlingPotentialClassId>((acc, [dismantlingPotentialClass, { points }]) => {
      return value >= points ? (dismantlingPotentialClass as DismantlingPotentialClassId) : acc
    }, DismantlingPotentialClassId.IV)

  return (
    <div
      className="rounded-sm px-1 py-0.5 text-center text-sm font-semibold"
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

export const CircularityLabelValuePair: FC<LabelValuePair> = ({ label, value, valueItem }) => {
  const valueElement = valueItem ? (
    valueItem
  ) : (
    <span className="text-base font-semibold text-bbsr-blue-700">{value}</span>
  )

  return (
    <dl className="flex flex-col gap-0.5">
      <dt className="text-sm font-normal">{label}</dt>
      <dd>{valueElement}</dd>
    </dl>
  )
}

export const SubDescriptionItem: FC<{
  title: string
  labelValuePairs: LabelValuePair[]
}> = ({ labelValuePairs, title }) => {
  return (
    <article className="border-gray-20 border-r px-6 py-2">
      <h3 className="mb-3 text-base font-medium text-gray-900">{title}</h3>
      <div className="flex justify-between gap-2">
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
