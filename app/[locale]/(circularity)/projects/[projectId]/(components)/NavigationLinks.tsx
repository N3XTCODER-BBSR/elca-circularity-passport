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
import { twMerge } from "tailwind-merge"
import { Link } from "i18n/routing"
import { usePathname } from "i18n/routing"

type NavigationLinksProps = {
  navigation: { id: string; name: string; href: string }[]
}

const NavigationLinks = ({ navigation }: NavigationLinksProps) => {
  const pathName = usePathname()

  return (
    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
      <ul className="hidden sm:flex sm:space-x-8">
        {navigation.map((item) => {
          const isActive = pathName === item.href

          return (
            <li
              key={item.name}
              className={twMerge(
                isActive
                  ? "border-bbsr-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "border-b-2 px-1 pt-1 text-sm font-medium"
              )}
            >
              <Link
                href={item.href}
                className="inline-flex size-full items-center"
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavigationLinks
