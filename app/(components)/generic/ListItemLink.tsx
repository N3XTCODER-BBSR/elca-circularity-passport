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
    <li className="block list-none">
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
    </li>
  )
}

export default ListItemLink
