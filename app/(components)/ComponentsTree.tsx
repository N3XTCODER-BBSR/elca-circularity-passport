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

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Box } from "app/[locale]/grp/(components)/generic/layout-elements"
import mergeDin276HierarchyWithBuildingComponents from "lib/domain-logic/grp/data-schema/versions/v1/mergeDin276HierarchyWithBuildingComponents"
import { ComponentWithBasicFields } from "lib/domain-logic/shared/basic-types"
import { Badge } from "./generic/layout-elements"

const NumberOfChildComponents = ({
  numberOfComponents,
  hasAnyCircularityMissingData,
}: {
  numberOfComponents: number
  hasAnyCircularityMissingData: boolean
}) => {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        "ml-auto w-9 min-w-max whitespace-nowrap rounded-full px-2.5 py-0.5 text-center text-xs font-medium leading-5 ring-1 ring-inset",
        hasAnyCircularityMissingData
          ? "bg-rose-200 text-rose-800 ring-rose-800"
          : "bg-white text-gray-600 ring-gray-200"
      )}
    >
      {numberOfComponents}
    </span>
  )
}

type ComponentsTreeProps<T extends ComponentWithBasicFields> = {
  components: T[]
  costGroupCategoryNumbersToInclude?: number[]
  generateLinkUrlForComponent: (component: string) => string
  componentUuiddsWithMissingCircularityIndexForAnyProduct?: string[]
  showIncompleteCompleteLabels: boolean
}

const ComponentsTree = <T extends ComponentWithBasicFields>({
  components,
  costGroupCategoryNumbersToInclude: categoryNumbersToInclude,
  generateLinkUrlForComponent,
  componentUuiddsWithMissingCircularityIndexForAnyProduct,
  showIncompleteCompleteLabels = true,
}: ComponentsTreeProps<T>) => {
  const tCostGroups = useTranslations("Common.costGroups")
  const t = useTranslations("CircularityTool.sections.catalog")
  const router = useRouter()

  const din276WithComponents = mergeDin276HierarchyWithBuildingComponents(components, categoryNumbersToInclude)

  const [selectedCategoryNumber, setSelectedCategoryNumber] = useState<number | null>(null)
  const groupNumberOfSelectedCategory = Math.floor((selectedCategoryNumber || 0) / 100) * 100
  const groupOfSelectedCategoryNumber = din276WithComponents.find(
    (el) => el.groupNumber === groupNumberOfSelectedCategory
  )
  const selectedCategory = selectedCategoryNumber
    ? groupOfSelectedCategoryNumber?.categories.find((el) => el.categoryNumber === selectedCategoryNumber)
    : undefined

  const [selectedComponentsTypeNumber, setSelectedComponentsTypeNumber] = useState<number | null>(null)
  const compontensForSelectedComponentNumber = selectedComponentsTypeNumber
    ? selectedCategory?.componentTypes.find((el) => el.componentTypeNumber === selectedComponentsTypeNumber)
    : null

  // Helper function to update the URL fragment
  const updateUrlFragment = (value: number | null) => {
    if (value !== null) {
      router.replace(`#${value}`, undefined)
    } else {
      router.replace(`#`, undefined)
    }
  }

  // Sync state with the URL fragment on mount or URL change
  useEffect(() => {
    const handleHashChange = () => {
      const fragment = window.location.hash.substring(1)
      if (/^\d{3}$/.test(fragment)) {
        const numberFromFragment = parseInt(fragment, 10)
        if (numberFromFragment % 10 === 0) {
          setSelectedCategoryNumber(numberFromFragment)
          setSelectedComponentsTypeNumber(null)
        } else {
          setSelectedCategoryNumber(Math.floor(numberFromFragment / 10) * 10)
          setSelectedComponentsTypeNumber(numberFromFragment)
        }
      }
    }

    // Handle URL change when component mounts
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const onUpdateComponentTypeClick = (componentTypeNumber: number) => {
    updateUrlFragment(componentTypeNumber)
    setSelectedComponentsTypeNumber(componentTypeNumber)
  }

  const onUpdateCateogryClick = (categoryNumber: number) => {
    updateUrlFragment(categoryNumber)
    setSelectedComponentsTypeNumber(null)
    setSelectedCategoryNumber(categoryNumber)
  }

  return (
    <div className="flex">
      <div className="w-1/3 pr-6">
        <ul className="mx-2 space-y-1">
          {din276WithComponents.map((group) => {
            return (
              <li className="mb-8" key={group.groupNumber}>
                <h2 className="mb-4 text-sm uppercase">{tCostGroups(group.groupNumber.toString())}</h2>
                <nav aria-label="Sidebar" className="flex flex-1 flex-col">
                  <ul className="-mx-2 space-y-1">
                    {group.categories.map((componentsByCategory) => {
                      const hasAnyCircularityMissingData1 =
                        !!showIncompleteCompleteLabels &&
                        componentsByCategory.componentTypes.some((componentType) =>
                          componentType.components.some((component) => {
                            return componentUuiddsWithMissingCircularityIndexForAnyProduct?.includes(component.uuid)
                          })
                        )
                      return (
                        <li key={componentsByCategory.categoryNumber}>
                          <button
                            onClick={() => onUpdateCateogryClick(componentsByCategory.categoryNumber)}
                            type="button"
                            className={twMerge(
                              selectedCategoryNumber === componentsByCategory.categoryNumber
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex w-full gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
                            )}
                          >
                            <div className="flex w-full items-center gap-x-3">
                              <div className="text-left">
                                {componentsByCategory.categoryNumber}{" "}
                                {tCostGroups(componentsByCategory.categoryNumber.toString())}
                              </div>

                              {componentsByCategory.numberOfComponents !== 0 && (
                                <NumberOfChildComponents
                                  numberOfComponents={componentsByCategory.numberOfComponents}
                                  hasAnyCircularityMissingData={hasAnyCircularityMissingData1}
                                />
                              )}
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </li>
            )
          })}
        </ul>
      </div>
      <div></div>
      <div className="w-1/3 pl-6">
        <ul className="-mx-2 space-y-1">
          {selectedCategory?.componentTypes.map((componentsByComponentNumber) => {
            const hasAnyCircularityMissingData2 =
              !!showIncompleteCompleteLabels &&
              componentsByComponentNumber.components.some(
                (component) => componentUuiddsWithMissingCircularityIndexForAnyProduct?.includes(component.uuid)
              )
            return (
              <li key={componentsByComponentNumber.componentTypeNumber}>
                <button
                  type="button"
                  className={twMerge(
                    componentsByComponentNumber.componentTypeNumber === selectedComponentsTypeNumber
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex w-full gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
                  )}
                  onClick={() => onUpdateComponentTypeClick(componentsByComponentNumber.componentTypeNumber)}
                >
                  <div className="flex w-full items-center gap-x-3">
                    <div className="text-left">
                      {componentsByComponentNumber.componentTypeNumber}{" "}
                      {tCostGroups(componentsByComponentNumber.componentTypeNumber.toString())}
                    </div>
                    {componentsByComponentNumber.numberOfComponents !== 0 && (
                      <NumberOfChildComponents
                        numberOfComponents={componentsByComponentNumber.numberOfComponents}
                        hasAnyCircularityMissingData={hasAnyCircularityMissingData2}
                      />
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="w-1/3 pl-8">
        <ul className="space-y-1">
          {compontensForSelectedComponentNumber?.components.map((component) => {
            const hasAnyCircularityMissingData3 =
              !!showIncompleteCompleteLabels &&
              componentUuiddsWithMissingCircularityIndexForAnyProduct?.includes(component.uuid)
            return (
              <li key={component.uuid} className="">
                <Link href={generateLinkUrlForComponent(component.uuid)}>
                  <Box className="p-4">
                    <div className="w-1/3">
                      <Image src="/component_placeholder_lg.png" alt={component.name} width={200} height={200} />
                    </div>
                    <div className="w-2/3">
                      <h3 className="pl-4 text-[16px] font-semibold">{component.name}</h3>
                      {showIncompleteCompleteLabels &&
                        (hasAnyCircularityMissingData3 ? (
                          <div className="ml-4">
                            <Badge>{t("incomplete")}</Badge>
                          </div>
                        ) : (
                          <div className="ml-4">
                            <Badge color="green">{t("complete")}</Badge>
                          </div>
                        ))}
                    </div>
                  </Box>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ComponentsTree
