"use client"

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import NavBarProfileDropdown from "app/[locale]/(circularity)/(components)/NavBarProfileDropdown"
import { ElcaProjectInfo } from "app/[locale]/(circularity)/(utils)/types"

type NavBarProps = {
  projectInfo: ElcaProjectInfo
}

const NavBar: FC<NavBarProps> = ({ projectInfo }: NavBarProps) => {
  const nestedRootUrl = `/projects/${projectInfo.id}`

  const navigation = [
    { id: "overview", name: "Überblick", href: nestedRootUrl },
    { id: "catalog", name: "Katalog", href: `${nestedRootUrl}/catalog` },
  ]

  const [curNaviElIdx, setCurNaviElIdx] = useState<number>()

  // TODO: set currNaviElIdx based on path and:
  // 1. check whether there is more established/idomatic alternative solution than using useEffect as below
  // 2. also implement this then for the grp navbar for a passport
  useEffect(() => {
    // TODO: Implement
  }, [])

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-0">
            <div className="relative flex h-16 justify-between">
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

              {/* Navigation Links */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Navigation Links */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 lg:ml-0">
                  {navigation.map((item, idx) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={twMerge(
                        curNaviElIdx === idx
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                      )}
                      aria-current={curNaviElIdx === idx ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Side: Notifications and Profile */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  {/* Navigation Links */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8 lg:ml-0">
                    <span className="text-xs text-indigo-500">Project: {projectInfo.project_name}</span>
                  </div>
                </div>

                <NavBarProfileDropdown
                  additionalMenuItems={
                    <Link href={`/projects`} className={twMerge("block px-4 py-2 text-sm text-gray-700")}>
                      Switch project
                    </Link>
                  }
                ></NavBarProfileDropdown>
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-4 pt-2">
              {navigation.map((item, idx) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={twMerge(
                    curNaviElIdx === idx
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700",
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                  )}
                  aria-current={curNaviElIdx === idx ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}

export default NavBar
