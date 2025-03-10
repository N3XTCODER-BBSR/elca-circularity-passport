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
"use client"

import { Disclosure, DisclosureButton } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import LanguageDropdown from "app/(components)/LanguageDropdown"
import NavBarProfileDropdown from "app/[locale]/(circularity)/(components)/NavBarProfileDropdown"

const NavBar: FC = () => {
  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl">
            <div className="relative flex h-16 justify-end">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton
                  className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 
                             hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="absolute -inset-0.5" aria-hidden="true" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className={twMerge("block h-6 w-6", open ? "hidden" : "block")} />
                  <XMarkIcon aria-hidden="true" className={twMerge("hidden h-6 w-6", open ? "block" : "hidden")} />
                </DisclosureButton>
              </div>

              {/* Right Side: Notifications and Profile */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <LanguageDropdown />
                {/* Profile Dropdown */}
                <NavBarProfileDropdown />
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}

export default NavBar
