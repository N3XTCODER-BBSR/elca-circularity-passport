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
import React from "react"
import { twMerge } from "tailwind-merge"

type NavigationItem = {
  name: string
  id: string
}

interface SidebarProps {
  navigation: NavigationItem[]
  currentSectionId: string
  onSelect: (name: string) => void
}

const VerticalNavigation: React.FC<SidebarProps> = ({ navigation, currentSectionId, onSelect }) => {
  return (
    <nav aria-label="Sidebar" className="flex flex-1 flex-col">
      <ul className="-mx-2 space-y-1">
        {navigation.map((item) => (
          <li key={item.id}>
            <a
              href={item.id}
              onClick={(e) => {
                e.preventDefault()
                onSelect(item.id)
                e.stopPropagation()
              }}
              className={twMerge(
                item.id === currentSectionId
                  ? "bg-gray-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                "group flex cursor-pointer gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
              )}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default VerticalNavigation
