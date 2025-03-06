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
import { MenuItem as HeadlessUiMenuItem, Menu, MenuItems } from "@headlessui/react"
import Link from "next/link"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

export type MenuItem = {
  testId?: string
  text: string
  handleOnClick?: () => void
  href?: string
}

const NavBarDropdownMenu: FC<{ menuButton: React.ReactNode; items: MenuItem[]; className?: string }> = ({
  menuButton,
  items,
  className,
}) => {
  return (
    <Menu as="div" className={twMerge("relative ml-3", className)}>
      <div>{menuButton}</div>
      <MenuItems
        className="absolute right-0 z-10 mt-2 w-44 origin-top-right scale-95 
                     rounded-md bg-white py-1 opacity-0 shadow-lg ring-1 
                     ring-black ring-opacity-5 transition focus:outline-none data-[open]:scale-100 
                     data-[open]:opacity-100"
      >
        {items.map((item) => {
          const itemContent = item.href ? (
            <Link href={item.href} className="block px-4 py-2 text-sm text-gray-700" data-testid={item.testId}>
              {item.text}
            </Link>
          ) : (
            <button
              onClick={item.handleOnClick}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700"
              data-testid={item.testId}
            >
              {item.text}
            </button>
          )

          return <HeadlessUiMenuItem key={item.text}>{itemContent}</HeadlessUiMenuItem>
        })}
      </MenuItems>
    </Menu>
  )
}

export default NavBarDropdownMenu
