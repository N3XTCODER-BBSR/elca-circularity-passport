"use client"

import { Disclosure } from "@headlessui/react"

interface Tab {
  name: string
  href: string
}

interface NavbarProps {
  tabs: Tab[]
  currentTabIdx: number
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Navbar({ tabs, currentTabIdx }: NavbarProps) {
  const handleTabClick = (_tabIdx: number) => {
  }

  return (
    <Disclosure as="nav" className="bg-white">
      {() => (
        <>
          <div className="mx-0 max-w-7xl">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="sm:flex sm:space-x-8">
                  {tabs.map((tab) => (
                    <a
                      key={tab.href}
                      href={tab.href}
                      className={classNames(
                        tab.href === tabs[currentTabIdx]?.href
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                      )}
                      onClick={() => handleTabClick(tabs.findIndex((t) => t.href === tab.href))}
                    >
                      {tab.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
