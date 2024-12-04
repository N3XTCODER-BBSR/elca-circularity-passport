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
          name: true,
          elements: {
            select: {
              id: true,
              name: true,
              element_components: {
                select: {
                  id: true,

                  process_configs: {
                    select: {
                      id: true,
                      name: true,
                      process_categories: {
                        select: {
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
          },
        },
      },
    },
  })
  //   const dataTestResult = await prismaLegacy.projects.findFirst({
  //     where: {
  //       id: 1,
  //     },
  //     select: { id: true },
  //     include: {
  //         project_variants_projects_current_variant_idToproject_variants: true
  //     },
  //   })

  return <div>result: {JSON.stringify(dataTestResult)}</div>
  //   return <div>result: {JSON.stringify(dataTestResult, null, 4)}</div>
}

export default Test
