import { ChevronRightIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import { FC } from "react"

const ListItemLink: FC<{ linkTo: string; title: string; description: string; badgeText?: string }> = ({
  linkTo,
  title,
  description,
  badgeText,
}) => {
  const badge = badgeText ? (
    <div className="mx-3 rounded-md border border-bbsr-blue-200 bg-bbsr-blue-50 px-1.5 py-0.5 text-xs font-medium text-bbsr-blue-700">
      {badgeText}
    </div>
  ) : null

  return (
    <Link href={linkTo} className="block border-b border-gray-100 px-1 py-5 last:border-b-0 hover:bg-gray-50">
      <div className="flex items-center">
        <div className="flex flex-1 flex-col justify-between gap-2">
          <h5 className="text-sm font-semibold text-gray-900">{title}</h5>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {badge}
        <ChevronRightIcon className="size-5 text-gray-400" />
      </div>
    </Link>
  )
}

export default ListItemLink
