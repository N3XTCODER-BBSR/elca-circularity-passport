import { prisma, prismaLegacy } from "prisma/prismaClient"

const Test = async () => {
  //   const FOO = await prismaLegacy.elca_element_components.findMany({
  //     where: {
  //         pr
  //   })
  const dataTestResult = await prismaLegacy.projects.findFirst({
    where: {
      id: 1,
    },
    select: { id: true },
    include: {
      elca_element_components: {
        select: {
          id: true,
          name: true,
          layers: {
            select: {
              id: true,
              circularityIndex: true,
              mass: true,
            },
          },
        },
      },
    },
  })

  return <div>result: {JSON.stringify(dataTestResult)}</div>
}

export default Test
