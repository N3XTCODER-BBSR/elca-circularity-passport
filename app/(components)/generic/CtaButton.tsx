/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import Link from "next/link"
import { FC, ButtonHTMLAttributes } from "react"

interface CtaButtonProps {
  text: string
  href?: string
  onClick?: () => void
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  disabled?: boolean
}

export const CtaButton: FC<CtaButtonProps> = ({ href, text, onClick, type = "button", disabled = false }) => {
  const buttonClasses =
    "min-h-8 h-auto rounded-md bg-bbsr-blue-700 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-bbsr-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bbsr-blue-500"
  const disabledClasses = disabled ? "cursor-not-allowed opacity-70" : ""

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button type={type} className={`${buttonClasses} ${disabledClasses}`} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    )
  }

  // If href is provided, render as link
  if (href) {
    const isExternal = href.startsWith("http")

    if (isExternal) {
      return (
        <a href={href} className={`${buttonClasses} ${disabledClasses}`}>
          {text}
        </a>
      )
    }

    return (
      <Link href={href} className={`${buttonClasses} ${disabledClasses}`}>
        {text}
      </Link>
    )
  }

  // Fallback to button if neither href nor onClick is provided
  return (
    <button type={type} className={`${buttonClasses} ${disabledClasses}`}>
      {text}
    </button>
  )
}
