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
    include: {
      elements: {
        include: {
          elements: {
            include: {
              element_components: {
                include: {
                  process_configs: {
                    include: {
                      process_categories: {
                        include: {
                          nested_nodes: true,
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

  return <div>result: {JSON.stringify(dataTestResult, null, 2)}</div>
}

export default Test
