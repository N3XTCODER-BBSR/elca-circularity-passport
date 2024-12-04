import { prisma, prismaLegacy } from "prisma/prismaClient"

const Test = async () => {
  //   const FOO = await prismaLegacy.elca_element_components.findMany({
  //     where: {
  //         pr
  //   })
  const dataTestResult = await prismaLegacy.elca_project_variants.findFirst({
    where: {
      project_id: 1,
    },
    // select: { id: true },
    select: {
      id: true,
      name: true,
      elements: {
        select: {
          id: true,
          element_components: {
            select: {
              id: true,
              quantity: true,
              process_configs: {
                select: {
                  name: true,
                  process_categories: {
                    select: {
                      name: true,
                      nested_nodes: {
                        select: {
                          process_categories: {
                            select: {
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        // include: {
        // element_components: {
        //     select: {
        //         id: true,

        //     }
        // }
        // }
      },
    },
  })

  //   elements: {
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //     include: {
  //       elements: {
  //         select: {
  //           id: true,
  //           name: true,
  //         },
  //         include: {
  //           element_components: {
  //             select: {
  //               id: true,

  //               process_configs: {
  //                 select: {
  //                   id: true,
  //                   name: true,
  //                   process_categories: {
  //                     select: {
  //                       nested_nodes: {
  //                         select: {
  //                           process_categories: {
  //                             select: {
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
  //       },
  //     },
  //   },

  //   const dataTestResult = await prismaLegacy.projects.findFirst({
  //     where: {
  //       id: 1,
  //     },
  //     select: { id: true },
  //     include: {
  //         project_variants_projects_current_variant_idToproject_variants: true
  //     },
  //   })

  var jsonPretty = JSON.stringify(dataTestResult, null, 2)

  //   return <div>result: {JSON.stringify(dataTestResult, null, 4)}</div>
  console.log(jsonPretty)
  return (
    <div>
      {JSON.stringify(dataTestResult, null, 4)}
      <ul>
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
      </ul>
    </div>
  )
}

export default Test
