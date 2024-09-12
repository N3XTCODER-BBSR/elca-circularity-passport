import _ from "lodash"
import { classNames } from "app/[locale]/(utils)/classnames"
import Tooltip from "./Tooltip"

export type KeyValueTuple = {
  key: string
  value?: string | number
  tooltip?: {
    content: React.ReactNode | string
    id: string
  }
}

export type SideBySideDescriptionListsWithHeadlineProps = {
  headline?: string
  data: KeyValueTuple[]
}

const SingleKeyValueTuple = ({
  keyValueTuple,
  isLeft = false,
}: {
  keyValueTuple?: KeyValueTuple
  isLeft?: boolean
}) => {
  return (
    <div
      className={classNames(
        "w-full p-2 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3 md:w-1/2",
        isLeft ? "md:border-r-2" : ""
      )}
    >
      <dt className="flex items-center text-sm font-semibold leading-6 text-gray-700">
        {keyValueTuple?.tooltip && <Tooltip id={keyValueTuple?.tooltip.id}>{keyValueTuple?.tooltip.content}</Tooltip>}
        <span>{keyValueTuple?.key}</span>
      </dt>
      <dd className="mt-1 text-gray-600">{keyValueTuple?.value || (!!keyValueTuple?.key && "N/A")}</dd>
    </div>
  )
}

const SideBySideDescriptionListsWithHeadline = ({ headline, data }: SideBySideDescriptionListsWithHeadlineProps) => {
  const filledWithEmptyLastRow = data.length % 2 === 1 ? [...data, { key: "", value: "" }] : data

  const chunkedArray = _.chunk(filledWithEmptyLastRow, 2)

  return (
    <div className="mb-8">
      {headline != null && <h3 className="mb-8 text-lg font-semibold leading-6 text-gray-900">{headline}</h3>}

      <dl className="grid grid-cols-1 md:grid-cols-2 md:divide-y md:divide-gray-100">
        {chunkedArray.map((chunk, idx) => (
          <div
            key={idx}
            className={classNames(
              "flex flex-col px-4 md:col-span-2 md:flex-row",
              idx % 2 === 1 ? "md:bg-white" : "md:bg-gray-50"
            )}
          >
            <SingleKeyValueTuple keyValueTuple={chunk[0]} isLeft />
            <SingleKeyValueTuple keyValueTuple={chunk[1]} />
          </div>
        ))}
      </dl>
    </div>
  )
}

export default SideBySideDescriptionListsWithHeadline
