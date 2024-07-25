import { InformationCircleIcon } from "@heroicons/react/20/solid"
import { Tooltip as ReactTooltip } from "react-tooltip"

interface TooltipProps {
  id: string
  children: React.ReactNode
}

const Tooltip = ({ id, children }: TooltipProps) => {
  const prefixedId = `info-anchor-${id}`
  return (
    <>
      <span data-tooltip-id={prefixedId} className="flex items-center">
        <InformationCircleIcon className="size-4 text-blue-800" aria-hidden="true" />
      </span>
      <ReactTooltip id={prefixedId}>
        <div className="max-w-md">{children}</div>
      </ReactTooltip>
    </>
  )
}

export default Tooltip
