"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { CategoryData } from "./types"

interface MaterialCategorySelectorProps {
  categories: CategoryData[]
  selectedCategory: string
  isDropdownOpen: boolean
  setSelectedCategory: (category: string) => void
  setIsDropdownOpen: (isOpen: boolean) => void
  isPending: boolean
  "data-testid-prefix"?: string
}

const MaterialCategorySelector: React.FC<MaterialCategorySelectorProps> = ({
  categories,
  selectedCategory,
  isDropdownOpen,
  setSelectedCategory,
  setIsDropdownOpen,
  isPending,
  "data-testid-prefix": dataTestidPrefix = "material-category-selector",
}) => {
  const circularityTranslations = useTranslations("Circularity.Components.Layers.CircularityInfo")
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDropdownOpen) setFocusedIndex(-1)
  }, [isDropdownOpen])

  return (
    <div className="relative">
      <button
        type="button"
        className="block w-full appearance-none rounded-md border-2 border-gray-200 p-2 pr-10 text-left shadow-sm focus:border-bbsr-blue-500 focus:ring-bbsr-blue-500 sm:text-sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isPending}
      >
        {selectedCategory
          ? categories.find((cat) => cat.number === selectedCategory)?.name
          : circularityTranslations("tBaustoffSelector.allCategories")}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
          <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isDropdownOpen && (
        <div
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
          role="listbox"
          tabIndex={0}
          ref={containerRef}
          onKeyDown={(e) => {
            const totalItems = categories.length + 1 // +1 for "All Categories"
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setFocusedIndex((prev) => (prev + 1) % totalItems)
            } else if (e.key === "ArrowUp") {
              e.preventDefault()
              setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems)
            } else if (e.key === "Enter") {
              e.preventDefault()
              if (focusedIndex === 0) {
                setSelectedCategory("")
              } else if (focusedIndex > 0 && focusedIndex <= categories.length) {
                const category = categories[focusedIndex - 1]
                if (category) {
                  setSelectedCategory(category.number)
                }
              }
              setIsDropdownOpen(false)
            } else if (e.key === "Escape") {
              e.preventDefault()
              setIsDropdownOpen(false)
            }
          }}
        >
          <div
            role="option"
            tabIndex={0}
            aria-selected={selectedCategory === ""}
            onClick={() => {
              setSelectedCategory("")
              setIsDropdownOpen(false)
            }}
            onFocus={() => setFocusedIndex(0)}
            className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
              focusedIndex === 0 ? "ring-bbsr-blue-300 ring-2" : ""
            }`}
            data-testid={`${dataTestidPrefix}__option__all`}
          >
            {circularityTranslations("tBaustoffSelector.allCategories")}
          </div>
          {categories.map((category, idx) => {
            const isFocused = focusedIndex === idx + 1
            return (
              <div
                key={category.number}
                role="option"
                tabIndex={0}
                aria-selected={selectedCategory === category.number}
                onClick={() => {
                  setSelectedCategory(category.number)
                  setIsDropdownOpen(false)
                }}
                onFocus={() => setFocusedIndex(idx + 1)}
                className={`cursor-pointer px-4 py-2 outline-none hover:bg-gray-100 ${
                  category.type === "sub" ? "pl-8 text-gray-600" : "border-t border-gray-100 font-bold"
                } ${isFocused ? "ring-bbsr-blue-300 ring-2" : ""}`}
                data-testid={`${dataTestidPrefix}__option__${category.number}`}
              >
                {`${category.number} - ${category.name}`}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MaterialCategorySelector
