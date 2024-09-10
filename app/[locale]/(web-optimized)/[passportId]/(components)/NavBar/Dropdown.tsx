"use client"
import { Menu } from "@headlessui/react"
import { clsx } from "clsx"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const languages = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
]

const Dropdown = () => {
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
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {languages.find((lang) => lang.code === currentLocale)?.name || "Select Language"}
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    onClick={() => updateLocale(language.code)}
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                  >
                    {language.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  )
}

export default Dropdown
