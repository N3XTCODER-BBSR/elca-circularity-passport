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

import { Disclosure } from "@headlessui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { twMerge } from "tailwind-merge"
import LanguageDropdown from "app/(components)/LanguageDropdown"

interface NavbarProps {
  passportId: string
}

export default function Navbar({ passportId }: NavbarProps) {
  const t = useTranslations("Grp.Web.NavBar")
  const tabs = [
    { name: t("overview"), href: "" },
    { name: t("catalog"), href: "catalog" },
    // { name: "Vergleich", href: "benchmark" },
  ]

  const pathname = usePathname()

  return (
    <Disclosure as="nav" className="bg-white">
      {() => (
        <>
          <div className="mx-0 max-w-7xl">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="sm:flex sm:space-x-8">
                  {tabs.map((tab) => {
                    // Check if the relative path starts with the tab's href
                    // const pathWithoutTrailingSlash = pathname.replace(/\/$/, "")

                    const isRootPath = pathname === `/${passportId}`

                    const isPathCurrentTab =
                      (tab.href === "" && isRootPath) ||
                      (tab.href !== "" && pathname.startsWith(`/${passportId}/${tab.href}`))

                    return (
                      <Link
                        key={tab.href}
                        href={`/grp/${passportId}/${tab.href}`}
                        className={twMerge(
                          // pathname === pathWithoutTrailingSlash
                          isPathCurrentTab
                            ? "border-indigo-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )}
                      >
                        {tab.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
              <LanguageDropdown />
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
