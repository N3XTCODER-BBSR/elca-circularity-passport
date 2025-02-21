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
