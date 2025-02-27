import Link from "next/link"
import { FC } from "react"

export const CtaButton: FC<{ href: string; text: string }> = ({ href, text }) => {
  const isExternal = href.startsWith("http")

  if (isExternal) {
    return (
      <a href={href} className="inline-block rounded-md bg-blue-600 px-2 py-1 text-white">
        {text}
      </a>
    )
  }

  return (
    <Link href={href} className="inline-block rounded-md bg-blue-600 px-2 py-1 text-white">
      {text}
    </Link>
  )
}
