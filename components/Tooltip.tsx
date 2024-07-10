import { InformationCircleIcon } from "@heroicons/react/20/solid"
import { Tooltip as ReactTooltip } from "react-tooltip"

interface TooltipProps {
  content: string
  id: string
}

const Tooltip = ({ content, id }: TooltipProps) => {
  const prefixedId = `info-anchor-${id}`
  return (
    <>
      <a data-tooltip-id={prefixedId} className="flex items-center" href="#">
        <InformationCircleIcon className="h-4 w-4 text-blue-800" aria-hidden="true" />
      </a>
      <ReactTooltip id={prefixedId}>
        <div className="max-w-md">{content}</div>
      </ReactTooltip>
    </>
  )
}

export default Tooltip
