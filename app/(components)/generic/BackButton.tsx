import { ArrowLongLeftIcon } from "@heroicons/react/20/solid"
import { FC } from "react"

const BackButton: FC<{ handleOnClick: () => void; text: string }> = ({ handleOnClick, text }) => {
  return (
    <button
      className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-200 px-8 py-2 text-sm font-semibold text-blue-900"
      onClick={handleOnClick}
    >
      <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
      {text}
    </button>
  )
}

export default BackButton
