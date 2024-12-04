import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/server-actions/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { prisma, prismaLegacy } from "prisma/prismaClient"
import { calculateTotalCircularityIndex } from "../projects/[projectId]/(index)/(components)/BuildingOverview"

type CategoryNode = {
  node_id: number
  name: string
  ref_num: string | null
  svg_pattern_id: number | null
}

type MaterialNode = {
  component_uuid: string
  product_id: number
  name: string
  process_category_node_id: number
  // Include other fields as necessary
}

interface RootCategoryNode extends CategoryNode {
  subcategories?: SubCategoryNode[]
  materials?: MaterialNode[]
}

interface SubCategoryNode extends CategoryNode {
  materials?: MaterialNode[]
}

function buildTree(categories: CategoryNode[], materials: MaterialNode[]): RootCategoryNode[] {
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

  return Object.values(rootCategories)
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
    await getProjectCircularityIndexData(1, "2")

  //   const totalCircularityIndexForProject = await calculateTotalCircularityIndex(circularityData)

  const products: CalculateCircularityDataForLayerReturnType[] = circularityData.flatMap((el) => el.layers)

  const FOO = products.map(
    (el) =>
      ({
        component_uuid: el.element_uuid,
        product_id: el.component_id,
        name: el.process_name,
        process_category_node_id: el.process_category_node_id,
      }) as MaterialNode
  )

  const tree = buildTree(dataTestResult, FOO)

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
      {JSON.stringify(tree, null, 4)}
      {tree.map((l1) => (
        <div className="pl-2">{l1.name}</div>
      ))}
      <br />
      <br />
      <br />
      {/* {JSON.stringify(dataTestResult, null, 4)} */}
      <br />
      <br />
      <br />
      <br />
      {/* {JSON.stringify(dataTestResult2, null, 4)} */}
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
