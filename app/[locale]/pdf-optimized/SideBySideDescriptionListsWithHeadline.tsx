import _ from "lodash"
import { classNames } from "app/[locale]/(utils)/classnames"

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
  // TODO: discuss with Daniel. table had one huge row. disable this line as quick
  // fix to continue development of module 2 and 3
  const height = `h-[${1 * 40}mm]`

  return (
    // <div className={classNames("w-full p-2 px-0 ml-[2mm] py-[1mm] grid grid-cols-2", isLeft ? "border-r-2" : "")}>
    <div
      className={classNames(
        height,
        "flex w-full justify-between px-2 leading-[5mm]",
        isLeft ? "border-r-2" : "",
        lineClampClass
      )}
    >
      <dt className="font-semibold text-gray-700">{keyValueTuple?.key}: &nbsp;</dt>
      <dd className={classNames("text-right text-gray-600", lineClampClass)}>
        {keyValueTuple?.value || (!!keyValueTuple?.key && "N/A")}
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
          <div key={idx} className={classNames("col-span-2 flex flex-row", idx % 2 === 1 ? "bg-white" : "bg-gray-50")}>
            <SingleKeyValueTuple keyValueTuple={chunk[0]} isLeft />
            <SingleKeyValueTuple keyValueTuple={chunk[1]} />
          </div>
        ))}
      </dl>
    </div>
  )
}

export default SideBySideDescriptionListsWithHeadline
