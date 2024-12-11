import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/server-actions/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { prisma, prismaLegacy } from "prisma/prismaClient"
import { calculateTotalCircularityIndex } from "../projects/[projectId]/(index)/(components)/BuildingOverview"
import {
  buildTree,
  MaterialNode,
} from "../projects/[projectId]/(index)/(components)/CircularityIndexBreakdownByMaterialType/logic"

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

  const materialNodes: MaterialNode[] = products.map(
    (el) =>
      ({
        component_uuid: el.element_uuid,
        product_id: el.component_id,
        name: el.process_name,
        process_category_node_id: el.process_category_node_id,
      }) as MaterialNode
  )

  const tree = buildTree(dataTestResult, materialNodes)

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
