"use client"

import { Disclosure } from "@headlessui/react"
import { useTranslations } from "next-intl"
import { twMerge } from "tailwind-merge"
type TabBarProps = {
  currentTabIdx: number
  setCurrentTabIdx: (idx: number) => void
}

export default function Tabs({ currentTabIdx, setCurrentTabIdx }: TabBarProps) {
  const t = useTranslations("Grp.Web.sections.detailPage.tabBar")
  const tabs = [
    { name: t("material"), testId: "material" },
    { name: t("resources"), testId: "resources" },
    { name: t("circularity"), testId: "circularity" },
  ]

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="isolate inline-flex -space-x-px">
          <Disclosure as="nav" className="bg-white">
            {() => (
              <>
                <div className="mx-4 max-w-7xl">
                  <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                      <div className="sm:flex sm:space-x-8">
                        {tabs.map((tab, i) => {
                          return (
                            <button
                              onClick={() => setCurrentTabIdx(i)}
                              data-testid={`tabs__tab-button__${tab.testId}`}
                              key={tab.name}
                              className={twMerge(
                                currentTabIdx === i
                                  ? "bg-gray-200 text-blue-900"
                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                "rounded-md p-2 text-sm font-semibold text-gray-600"
                              )}
                            >
                              {tab.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
        </span>
      </div>
    </div>
  )
}
