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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

const languages = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
]

const LanguageDropdown = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentLocale, setCurrentLocale] = useState<string>("en") // Default to "en"

  // Determine current locale from the path or query params
  useEffect(() => {
    const localeFromPath = pathname.split("/")[1]
    const matchedLocale = languages.find((lang) => lang.code === localeFromPath)
    if (matchedLocale) {
      setCurrentLocale(matchedLocale.code)
    }
  }, [pathname])

  // Function to update the locale and navigate
  const updateLocale = (locale: string) => {
    const queryParams = searchParams.toString()
    const newPath = `/${locale}${pathname.replace(/^\/[a-z]{2}/, "")}`
    router.push(`${newPath}${queryParams ? `?${queryParams}` : ""}`)
  }

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative">
        <MenuButton className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {languages.find((lang) => lang.code === currentLocale)?.name || "Select Language"}
        </MenuButton>

        <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="py-1">
            {languages.map((language) => (
              <MenuItem key={language.code}>
                {({ active }) => (
                  <button
                    onClick={() => updateLocale(language.code)}
                    className={twMerge(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                  >
                    {language.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default LanguageDropdown
