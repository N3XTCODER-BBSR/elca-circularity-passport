import { notFound } from "next/navigation"
import ComponentsTree from "./(components)/ComponentsTree"
import { getDinEnrichedPassportData } from "../../../(utils)/getPassportData"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportData(params.passportId)

  if (dinEnrichedPassportData == null) {
    notFound()
  }

  return <ComponentsTree buildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents} />
}

export default Page
