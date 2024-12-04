import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/server-actions/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { prisma, prismaLegacy } from "prisma/prismaClient"

type CategoryNode = {
  node_id: number
  name: string
  ref_num: string | null
  svg_pattern_id: number | null
}

type Material = {
  id: number
  name: string
  process_category_node_id: number
  // Other fields can be included as needed
}

interface CategoryTreeNode extends CategoryNode {
  children: TreeNode[]
}

type TreeNode = CategoryTreeNode | Material

function buildTree(categories: CategoryNode[], materials: Material[]): TreeNode[] {
  const categoryByRefNum: Map<string, CategoryTreeNode> = new Map()
  const categoryByNodeId: Map<number, CategoryTreeNode> = new Map()

  // Initialize categories as TreeNodes with empty children arrays
  const categoriesWithChildren: CategoryTreeNode[] = categories.map((category) => ({
    ...category,
    children: [],
  }))

  // Build maps for quick lookup
  categoriesWithChildren.forEach((category) => {
    if (category.ref_num) {
      categoryByRefNum.set(category.ref_num, category)
    }
    categoryByNodeId.set(category.node_id, category)
  })

  const roots: CategoryTreeNode[] = []

  // Build the category tree
  categoriesWithChildren.forEach((category) => {
    const refNum = category.ref_num
    if (!refNum) {
      // Categories with null ref_num are considered roots
      roots.push(category)
    } else {
      const parentRefNum = getParentRefNum(refNum)
      if (parentRefNum === null) {
        // No parent ref_num means this category is a root
        roots.push(category)
      } else {
        const parentCategory = categoryByRefNum.get(parentRefNum)
        if (parentCategory) {
          parentCategory.children.push(category)
        } else {
          // Parent category not found; consider as root or handle accordingly
          roots.push(category)
        }
      }
    }
  })

  // Assign materials to their respective categories
  materials.forEach((material) => {
    const category = categoryByNodeId.get(material.process_category_node_id)
    if (category) {
      category.children.push(material)
    } else {
      // Handle materials with no matching category if necessary
    }
  })

  return roots
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

const Test = async () => {
  //   const FOO = await prismaLegacy.elca_element_components.findMany({
  //     where: {
  //         pr
  //   })

  const dataTestResult = await prismaLegacy.process_categories.findMany()

  const dataTestResult2 = await prismaLegacy.process_configs.findMany()

  const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await getProjectCircularityIndexData(1, 2)

  const totalCircularityIndexForProject = await calculateTotalCircularityIndex(circularityData)

  const tree = buildTree(dataTestResult, materials)

  //   const dataTestResult = await prismaLegacy.elca_project_variants.findFirst({
  //     where: {
  //       project_id: 1,
  //     },
  //     // select: { id: true },
  //     select: {
  //       id: true,
  //       name: true,
  //       elements: {
  //         select: {
  //           id: true,
  //           element_components: {
  //             select: {
  //               id: true,
  //               quantity: true,
  //               process_configs: {
  //                 select: {
  //                   id: true,
  //                   name: true,
  //                   process_categories: {
  //                     select: {
  //                       node_id: true,
  //                       name: true,
  //                     //   other_nested_nodes: {
  //                     //     process_categories: {
  //                     //         select: {
  //                     //             node_id: true
  //                     //         }
  //                     //     },
  //                     //   },
  //                       nested_nodes: {
  //                         select: {
  //                           root_id: true,
  //                           process_categories: {
  //                             select: {
  //                               node_id: true,
  //                               name: true,
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         // include: {
  //         // element_components: {
  //         //     select: {
  //         //         id: true,

  //         //     }
  //         // }
  //         // }
  //       },
  //     },
  //   })
  return (
    <div>
      {JSON.stringify(dataTestResult, null, 4)}
      <br />
      <br />
      <br />
      <br />
      {JSON.stringify(dataTestResult2, null, 4)}
      {/* <ul>
        {dataTestResult?.elements.map((el) => (
          <ul>
            <li>{el.id}</li>
            <li>
              <ul>
                {el.element_components.map((el2) => (
                  <div>{String(el2.quantity)}</div>
                ))}
              </ul>
            </li>
          </ul>
        ))}
      </ul> */}
    </div>
  )
}

export default Test
