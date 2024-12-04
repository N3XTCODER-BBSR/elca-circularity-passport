export type CategoryNode = {
  node_id: number
  name: string
  ref_num: string | null
  //   svg_pattern_id: number | null
}

export type MaterialNode = {
  component_uuid: string
  product_id: number
  name: string
  process_category_node_id: number
  // Include other fields as necessary
}

export interface RootCategoryNode extends CategoryNode {
  subcategories: SubCategoryNode[]
  materials: MaterialNode[]
}

export interface SubCategoryNode extends CategoryNode {
  materials?: MaterialNode[]
}

export function buildTree(categories: CategoryNode[], materials: MaterialNode[]): RootCategoryNode[] {
  // Maps for quick lookup
  const categoriesByRefNum: { [refNum: string]: CategoryNode } = {}
  const categoriesByNodeId: { [nodeId: number]: CategoryNode } = {}

  categories.forEach((category) => {
    if (category.ref_num) {
      categoriesByRefNum[category.ref_num] = category
    }
    categoriesByNodeId[category.node_id] = category
  })

  // Initialize root categories
  const rootCategories: { [refNum: string]: RootCategoryNode } = {}

  categories.forEach((category) => {
    if (category.ref_num && !category.ref_num.includes(".")) {
      // This is a root category
      rootCategories[category.ref_num] = {
        ...category,
        subcategories: [],
        materials: [],
      }
    }
  })

  // Build subcategories
  const subCategoriesByNodeId: { [nodeId: number]: SubCategoryNode } = {}

  categories.forEach((category) => {
    if (category.ref_num && category.ref_num.includes(".")) {
      // This is a subcategory
      const parentRefNum = getParentRefNum(category.ref_num)
      const parentCategory = rootCategories[parentRefNum!]
      if (parentCategory) {
        const subCategoryNode: SubCategoryNode = {
          ...category,
          materials: [],
        }
        parentCategory.subcategories?.push(subCategoryNode)
        subCategoriesByNodeId[category.node_id] = subCategoryNode
      }
    }
  })

  // Assign materials to subcategories or root categories
  materials.forEach((material) => {
    const subCategory = subCategoriesByNodeId[material.process_category_node_id]
    if (subCategory) {
      subCategory.materials?.push(material)
    } else {
      const category = categoriesByNodeId[material.process_category_node_id]
      if (category && category.ref_num) {
        if (!category.ref_num.includes(".")) {
          // Material belongs to a root category
          const rootCategory = rootCategories[category.ref_num]
          rootCategory?.materials?.push(material)
        } else {
          // Handle materials with no matching category if necessary
        }
      }
    }
  })

  return Object.values(rootCategories).filter(
    (el) => el.subcategories?.some((el2) => el2.materials && el2.materials.length > 0)
  )
}

// Helper function to get the parent ref_num
function getParentRefNum(refNum: string): string | null {
  const lastDotIndex = refNum.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return null // No parent ref_num
  } else {
    return refNum.substring(0, lastDotIndex)
  }
}
