import Link from "next/link"
import { FC } from "react"

const ListItemLink: FC<{ linkTo: string; title: string; dateText: string }> = ({ linkTo, title, dateText }) => {
  return (
    <Link href={linkTo} className="block border-b border-gray-100 py-5 last:border-b-0">
      <div className="flex items-center">
        <div className="flex flex-1 flex-col justify-between gap-2">
          <h5 className="text-sm font-semibold text-gray-900">{title}</h5>
          <p className="text-xs text-gray-500">{dateText}</p>
        </div>
        <AngleRightIcon className="size-2 text-gray-800 dark:text-white" />
      </div>
    </Link>
  )
}

export default ListItemLink

const AngleRightIcon: FC<{ className: string }> = ({ className }) => {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
      />
    </svg>
  )
}
