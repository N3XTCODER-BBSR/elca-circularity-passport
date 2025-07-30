export interface SelectOption {
  id: string
  value: string
  processCategory?: {
    number: string
    name: string
  } | null
}

export interface CategoryData {
  number: string
  name: string
  type: "main" | "sub"
}

export interface MainCategoryData extends CategoryData {
  type: "main"
  subCategories: Map<string, SubCategoryData>
}

export interface SubCategoryData extends CategoryData {
  type: "sub"
}
