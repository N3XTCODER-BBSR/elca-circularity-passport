import { useMemo, useState } from "react"
import { CategoryData, MainCategoryData, SelectOption, SubCategoryData } from "./types"

export function useMaterialOptions(options: SelectOption[], processCategoryTranslations: (key: string) => string) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const optionsSortedAlphabetically = useMemo(() => {
    return [...options].sort((a, b) => a.value.localeCompare(b.value))
  }, [options])

  const categories = useMemo(() => {
    const categoriesMap = new Map<string, MainCategoryData>()

    options.forEach((option) => {
      if (option.processCategory?.number) {
        const [mainCategoryNum, subCategoryNum] = option.processCategory.number.split(".")

        // Add main category if not exists and mainCategoryNum is defined
        if (mainCategoryNum && !categoriesMap.has(mainCategoryNum)) {
          categoriesMap.set(mainCategoryNum, {
            number: mainCategoryNum,
            name: processCategoryTranslations(`${mainCategoryNum}.name`),
            type: "main" as const,
            subCategories: new Map(),
          })
        }

        // Add sub category if it exists
        if (mainCategoryNum && subCategoryNum) {
          const mainCategoryData = categoriesMap.get(mainCategoryNum)
          if (mainCategoryData) {
            const fullSubCategoryNumber = `${mainCategoryNum}.${subCategoryNum}`
            if (!mainCategoryData.subCategories.has(fullSubCategoryNumber)) {
              mainCategoryData.subCategories.set(fullSubCategoryNumber, {
                number: fullSubCategoryNumber,
                name: processCategoryTranslations(`${mainCategoryNum}.${subCategoryNum}`),
                type: "sub" as const,
              })
            }
          }
        }
      }
    })

    // Flatten the hierarchy into a single array
    const flatCategories: CategoryData[] = []
    categoriesMap.forEach((mainCategory) => {
      flatCategories.push({
        number: mainCategory.number,
        name: mainCategory.name,
        type: mainCategory.type,
      })
      mainCategory.subCategories.forEach((subCategory: SubCategoryData) => {
        flatCategories.push(subCategory)
      })
    })

    return flatCategories.sort((a, b) => a.number.localeCompare(b.number))
  }, [options, processCategoryTranslations])

  const filteredOptions = useMemo(() => {
    return optionsSortedAlphabetically.filter((option) => {
      const matchesSearch = option.value.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        !selectedCategory ||
        (option.processCategory?.number &&
          (option.processCategory.number.startsWith(selectedCategory) ||
            option.processCategory.number === selectedCategory))
      return matchesSearch && matchesCategory
    })
  }, [optionsSortedAlphabetically, searchTerm, selectedCategory])

  return {
    optionsSortedAlphabetically,
    categories,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  }
}
